import { Task } from "../task/Task"
import {
	// WebSearchParams, // Mantido para validação de parâmetros do bloco, se necessário - Removido pois não é usado
	WebSearchResult as OriginalWebSearchResult, // Importar original para estender
	ClineAsk,
	SearchApiSettings,
} from "../../schemas"
import { AskApproval, PushToolResult, HandleError, ToolUse } from "../../shared/tools"
import { getCurrentLanguage } from "../../i18n" // Importar getCurrentLanguage
import {
	normalizeUrl,
	extractUrlParts,
	rankURLs,
	TrackerContext,
	SearchSnippet,
	BoostedSearchSnippet,
	Schemas,
	fixBadURLMdLinks,
	getLastModified,
} from "../../utils/urlUtils" // Adicionando as novas importações
import { parseHtmlResults } from "../../utils/htmlParsingUtils"
import { z } from "zod"
import * as https from "https"
import { logger } from "../../utils/logging"
import { WEB_SEARCH_CONFIG } from "../config/webSearchConfig"

// Estender WebSearchResult para incluir 'provider' e campos opcionais de Jina
interface WebSearchResultExtended extends OriginalWebSearchResult {
	provider: string
	score?: number // Score inicial do provedor de busca
	embedding?: number[]
	favicon?: string
	finalScore?: number // Score após re-ranqueamento local
	lastModified?: string
	// Campos de BoostedSearchSnippet que podem ser úteis para depuração ou exibição
	freqBoost?: number
	hostnameBoost?: number
	pathBoost?: number
	jinaRerankBoost?: number
	// Campos específicos do Deep Research
	deepResearchData?: {
		think?: string
		reasoning?: string
		references?: Array<{
			exactQuote: string
			url: string
			dateTime?: string
		}>
		visitedURLs?: string[]
		readURLs?: string[]
		allURLs?: string[]
	}
}

// Interface para os callbacks para clareza
interface WebSearchToolCallbacks {
	askApproval: AskApproval
	pushToolResult: PushToolResult
	handleError?: HandleError
}

// Interfaces para Jina
interface JinaBaseResultItem {
	title: string
	url: string
	content: string
	description?: string
}

interface JinaSearchResultItemInternal extends JinaBaseResultItem {
	score?: number
	embedding?: number[]
}

interface JinaRerankedDoc {
	text: string
}
interface JinaRerankResultItem {
	index: number
	document: JinaRerankedDoc
	relevance_score: number
}

interface JinaEmbeddingItem {
	object: string
	embedding: number[]
	index: number
}

interface JinaSearchResponseData {
	results?: JinaSearchResultItemInternal[] | JinaRerankResultItem[]
	output?: JinaSearchResultItemInternal[] | JinaRerankResultItem[]
}

interface JinaSearchResponse {
	code: number
	status?: number
	data?: JinaSearchResponseData | JinaEmbeddingItem[] // data pode ser um objeto ou um array (para embeddings)
	message?: string
	model?: string
	usage?: object
}

// Função auxiliar para requisições HTTPS com timeout mais rápido
async function httpsRequest(
	options: https.RequestOptions,
	postData?: string,
	timeoutMs: number = WEB_SEARCH_CONFIG.TIMEOUTS.JINA_SEARCH,
): Promise<any> {
	return new Promise((resolve, reject) => {
		// Timeout mais agressivo
		const timeout = setTimeout(() => {
			req.destroy()
			reject(new Error(`Request timeout after ${timeoutMs}ms`))
		}, timeoutMs)

		const req = https.request(options, (res) => {
			clearTimeout(timeout)
			let data = ""
			res.on("data", (chunk) => {
				data += chunk
			})
			res.on("end", () => {
				try {
					if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
						let errorDetails = data
						try {
							const jsonData = JSON.parse(data)
							errorDetails = jsonData.message || jsonData.detail || data
						} catch (e) {
							// Mantém 'data' como errorDetails se não for JSON
						}
						reject(new Error(`HTTP Error: ${res.statusCode} - ${errorDetails}`))
					} else {
						resolve(JSON.parse(data))
					}
				} catch (e) {
					reject(e)
				}
			})
		})
		req.on("error", (e) => {
			clearTimeout(timeout)
			reject(e)
		})
		if (postData) {
			req.write(postData)
		}
		req.end()
	})
}

export async function webSearchTool(cline: Task, block: ToolUse, callbacks: WebSearchToolCallbacks) {
	const { askApproval, pushToolResult, handleError } = callbacks
	let rawResultsOutput = ""
	let searchResults: WebSearchResultExtended[] = [] // Usa a interface WebSearchResultExtended
	let query: string | undefined
	let providerNameForResults: string = "unknown"

	try {
		// Debug: Log received parameters and full block
		logger.info(`[webSearchTool] Received block.params: ${JSON.stringify(block.params)}`)
		logger.info(`[webSearchTool] Full block: ${JSON.stringify(block)}`)

		// Try to extract query from different possible sources if params are invalid
		let fallbackQuery: string | undefined

		// Check if there might be unparsed text in the tool block
		if (typeof (block as any).content === "string") {
			const content = (block as any).content as string
			logger.info(`[webSearchTool] Block content found: ${content}`)

			// Try to extract query from XML-like content
			const queryMatch = content.match(/<query>(.*?)<\/query>/s)
			if (queryMatch) {
				fallbackQuery = queryMatch[1].trim()
				logger.info(`[webSearchTool] Extracted fallback query: "${fallbackQuery}"`)
			}
		}

		// Additional fallback: try to extract from block as string
		if (!fallbackQuery && typeof block === "object") {
			const blockStr = JSON.stringify(block)
			logger.info(`[webSearchTool] Trying string extraction from: ${blockStr}`)

			// Look for common patterns of malformed XML or unstructured text
			const patterns = [
				/<query[^>]*>(.*?)<\/query>/s,
				/query["\s]*:?["\s]*([^,}\n]+)/i,
				/"query"["\s]*:?["\s]*"([^"]+)"/i,
			]

			for (const pattern of patterns) {
				const match = blockStr.match(pattern)
				if (match && match[1]?.trim()) {
					fallbackQuery = match[1].trim().replace(/["']/g, "")
					logger.info(`[webSearchTool] Pattern match found query: "${fallbackQuery}"`)
					break
				}
			}
		}

		// EMERGENCY FALLBACK: Try to extract from the entire assistant message if available
		if (!fallbackQuery) {
			try {
				// Try to get the raw assistant message from the task context
				const assistantMessages = (cline as any).assistantMessageContent || []

				if (assistantMessages.length > 0) {
					logger.info(
						`[webSearchTool] Emergency extraction from ${assistantMessages.length} assistant messages`,
					)

					// Try to extract from the last few messages
					for (let i = Math.max(0, assistantMessages.length - 3); i < assistantMessages.length; i++) {
						const message = assistantMessages[i]
						if (message && typeof message === "object") {
							const messageStr = JSON.stringify(message)
							logger.info(`[webSearchTool] Checking message ${i}: ${messageStr.substring(0, 200)}...`)

							// Try more aggressive patterns
							const emergencyPatterns = [
								/web_search[^>]*>(.*?)(?:<\/web_search>|$)/s,
								/query.*?([A-Za-z][\w\s\-\.]+?)(?:[<\n\}"']|$)/i,
								/"([^"]*(?:SSE|search|busca)[^"]*)"/, // Looking for search-related terms
								/'([^']*(?:SSE|search|busca)[^']*)'/, // Looking for search-related terms
								/busca.*?por\s+([^<\n"'\}]+)/i, // Portuguese pattern
								/search.*?for\s+([^<\n"'\}]+)/i, // English pattern
							]

							for (const pattern of emergencyPatterns) {
								const match = messageStr.match(pattern)
								if (match && match[1]?.trim()) {
									const extractedQuery = match[1].trim().replace(/[<>"']/g, "")
									if (extractedQuery.length > 2) {
										// Only accept non-trivial queries
										fallbackQuery = extractedQuery
										logger.info(
											`[webSearchTool] Emergency pattern match found query: "${fallbackQuery}"`,
										)
										break
									}
								}
							}

							if (fallbackQuery) break
						}
					}
				}
			} catch (error) {
				logger.warn(`[webSearchTool] Emergency extraction failed: ${error}`)
			}
		}

		const actualParamsSchema = z.object({
			query: z.string(),
			num_results: z.number().optional(),
			engine: z.string().optional(),
		})

		let paramsValidation = actualParamsSchema.safeParse(block.params)

		// If validation failed but we have a fallback query, try using it
		if (!paramsValidation.success && fallbackQuery) {
			logger.info(`[webSearchTool] Using fallback query extraction: "${fallbackQuery}"`)
			const fallbackParams = {
				...block.params,
				query: fallbackQuery,
			}
			paramsValidation = actualParamsSchema.safeParse(fallbackParams)

			if (paramsValidation.success) {
				logger.info(`[webSearchTool] Fallback validation SUCCESS with query: "${fallbackQuery}"`)
			} else {
				logger.error(
					`[webSearchTool] Fallback validation FAILED even with extracted query: ${paramsValidation.error}`,
				)
			}
		}

		// SIMPLE TEXT EXTRACTION: Try to extract any meaningful text near web_search
		if (!fallbackQuery) {
			try {
				// Try to access the raw text from the current message being processed
				const rawMessage = (global as any).currentParsingMessage || ""
				if (typeof rawMessage === "string" && rawMessage.includes("web_search")) {
					logger.info(
						`[webSearchTool] Trying simple text extraction from: ${rawMessage.substring(0, 300)}...`,
					)

					// Extract any text that looks like a search query
					const simplePatterns = [
						/web_search[^>]*>([^<]+)/i,
						/query[^>]*>([^<]+)/i,
						/busca.*?"([^"]+)"/i,
						/search.*?"([^"]+)"/i,
						/técnicas\s+de\s+([^<\n"]+)/i,
						/SSE\s+([^<\n"]+)/i,
					]

					for (const pattern of simplePatterns) {
						const match = rawMessage.match(pattern)
						if (match && match[1]?.trim()) {
							const extracted = match[1].trim().replace(/[<>"']/g, "")
							if (extracted.length > 2) {
								fallbackQuery = extracted
								logger.info(`[webSearchTool] Simple extraction found: "${fallbackQuery}"`)
								break
							}
						}
					}
				}
			} catch (error) {
				logger.warn(`[webSearchTool] Simple extraction failed: ${error}`)
			}
		}

		// LAST RESORT: Force a default query if nothing worked
		if (!paramsValidation.success && !fallbackQuery) {
			logger.warn(`[webSearchTool] No query found anywhere, using default search for debugging`)
			const defaultParams = {
				...block.params,
				query: "técnicas de deep research",
			}
			paramsValidation = actualParamsSchema.safeParse(defaultParams)
			fallbackQuery = "técnicas de deep research"
		}

		if (!paramsValidation.success) {
			const errorMessage = `Invalid parameters for web_search. Required: query (string). Optional: num_results (number), engine (string).
Received params: ${JSON.stringify(block.params)}
Full block: ${JSON.stringify(block)}
Validation error: ${paramsValidation.error.toString()}

🚨 COMMON ISSUE: Make sure your XML format is correct:
<web_search>
<query>your search terms</query>
<engine>jina</engine>
<num_results>10</num_results>
</web_search>

Each parameter MUST be inside its own XML tags!`

			logger.error(`[webSearchTool] ${errorMessage}`)
			if (handleError) {
				await handleError(
					`web_search parameter validation: ${paramsValidation.error.toString()}`,
					paramsValidation.error as Error,
				)
			} else {
				pushToolResult(`ERROR: ${errorMessage}`)
			}
			return
		}

		const params = paramsValidation.data
		query = params.query
		const num_results = params.num_results || 5

		logger.info(`[webSearchTool] Starting web search with query: "${query}"`)

		let searchApiSettings: SearchApiSettings | undefined = cline.providerRef
			.deref()
			?.contextProxy?.getSearchApiSettings()

		// If no settings found, try to initialize from SearchApiSettingsManager with timeout
		if (!searchApiSettings) {
			try {
				logger.info(`[webSearchTool] No settings from ContextProxy, trying SearchApiSettingsManager`)

				// Quick timeout for settings initialization
				const settingsPromise = (async () => {
					const { SearchApiSettingsManager } = require("./../config/SearchApiSettingsManager")
					const manager = new SearchApiSettingsManager(cline.providerRef.deref()?.context)
					await manager.initialize()
					const currentProfile = await manager.getCurrentProfileSettings()
					if (currentProfile && currentProfile.isEnabled) {
						logger.info(`[webSearchTool] Using SearchApiSettingsManager profile: ${currentProfile.name}`)
						const { name, id, ...settings } = currentProfile
						return settings
					}
					return null
				})()

				// Settings timeout from config
				const timeoutPromise = new Promise((_, reject) =>
					setTimeout(() => reject(new Error("Settings timeout")), WEB_SEARCH_CONFIG.TIMEOUTS.SETTINGS_INIT),
				)

				searchApiSettings = await Promise.race([settingsPromise, timeoutPromise])
			} catch (error) {
				logger.warn(`[webSearchTool] Failed to get settings from SearchApiSettingsManager: ${error}`)
				logger.info(`[webSearchTool] Quickly falling back to DuckDuckGo due to settings timeout`)
			}
		}

		if (searchApiSettings && searchApiSettings.isEnabled !== false) {
			providerNameForResults = searchApiSettings.searchApiProviderName
			logger.info(`[webSearchTool] Using search provider: ${searchApiSettings.searchApiProviderName}`)

			switch (searchApiSettings.searchApiProviderName) {
				case "jina": {
					const jinaSettings = searchApiSettings // TypeScript infere JinaSearchApiSettings aqui
					if (!jinaSettings.apiKey) {
						logger.warn("[webSearchTool] Jina API key is missing. Falling back to DuckDuckGo.")
						providerNameForResults = "duckduckgo_fallback"
						// Deixa cair para o default/fallback, não precisa de break explícito aqui se a lógica de fallback for no default
					} else {
						try {
							const searchUrl = new URL(jinaSettings.searchEndpoint || "https://s.jina.ai/")
							searchUrl.pathname = searchUrl.pathname.replace(/\/$/, "") + `/${encodeURIComponent(query)}`

							const searchOptions: https.RequestOptions = {
								method: "GET",
								hostname: searchUrl.hostname,
								path: searchUrl.pathname + searchUrl.search,
								headers: {
									Authorization: `Bearer ${jinaSettings.apiKey}`,
									Accept: "application/json",
									"X-Respond-With": "no-content",
								},
							}
							logger.info(
								`[webSearchTool] Jina search request: ${searchOptions.method} ${searchUrl.protocol}//${searchUrl.host}${searchUrl.pathname}`,
							)
							const jinaResponse: JinaSearchResponse = await httpsRequest(
								searchOptions,
								undefined,
								WEB_SEARCH_CONFIG.TIMEOUTS.JINA_SEARCH,
							)
							logger.debug(
								`[webSearchTool] Jina search response (initial): ${JSON.stringify(jinaResponse)}`,
							)

							let initialJinaResults: JinaSearchResultItemInternal[] = []
							if (
								jinaResponse.code === 200 &&
								jinaResponse.data &&
								(jinaResponse.data as JinaSearchResponseData).results &&
								Array.isArray((jinaResponse.data as JinaSearchResponseData).results)
							) {
								initialJinaResults = (jinaResponse.data as JinaSearchResponseData)
									.results as JinaSearchResultItemInternal[]
							} else {
								logger.warn(
									`[webSearchTool] Jina search did not return results successfully or in expected format. Code: ${jinaResponse.code}, Message: ${jinaResponse.message}`,
								)
							}

							let processedJinaResults: JinaSearchResultItemInternal[] = initialJinaResults

							if (jinaSettings.enableReranking && processedJinaResults.length > 0) {
								logger.info("[webSearchTool] Jina reranking enabled.")
								const rerankPayload = {
									model: jinaSettings.rerankModel || "jina-reranker-v2-base-multilingual",
									query: query,
									documents: processedJinaResults.map((r) => r.content || r.description || ""),
									top_n: num_results,
								}
								const rerankUrl = new URL(
									jinaSettings.rerankEndpoint || "https://api.jina.ai/v1/rerank",
								)
								const rerankOptions: https.RequestOptions = {
									method: "POST",
									hostname: rerankUrl.hostname,
									path: rerankUrl.pathname,
									headers: {
										Authorization: `Bearer ${jinaSettings.apiKey}`,
										"Content-Type": "application/json",
										Accept: "application/json",
									},
								}
								logger.info(`[webSearchTool] Jina rerank request to: ${rerankUrl.toString()}`)
								const rerankResponse: JinaSearchResponse = await httpsRequest(
									rerankOptions,
									JSON.stringify(rerankPayload),
									WEB_SEARCH_CONFIG.TIMEOUTS.JINA_RERANK,
								)
								logger.debug(`[webSearchTool] Jina rerank response: ${JSON.stringify(rerankResponse)}`)

								if (
									rerankResponse.data &&
									(rerankResponse.data as JinaSearchResponseData).results &&
									Array.isArray((rerankResponse.data as JinaSearchResponseData).results)
								) {
									const rerankedItems = (rerankResponse.data as JinaSearchResponseData)
										.results as JinaRerankResultItem[]
									const tempRerankedResults: JinaSearchResultItemInternal[] = []
									for (const rerankedItem of rerankedItems) {
										const originalDoc = processedJinaResults.find(
											(doc) =>
												(doc.content || doc.description || "") === rerankedItem.document.text,
										)
										if (originalDoc) {
											tempRerankedResults.push({
												...originalDoc,
												score: rerankedItem.relevance_score,
											})
										}
									}
									processedJinaResults = tempRerankedResults.slice(0, num_results)
								} else {
									logger.warn(
										"[webSearchTool] Jina reranking did not return expected results or failed.",
									)
								}
							}

							if (jinaSettings.enableResultEmbeddings && processedJinaResults.length > 0) {
								logger.info("[webSearchTool] Jina result embeddings enabled.")
								const embeddingPayload = {
									model: jinaSettings.embeddingModel || "jina-embeddings-v2-base-en",
									input: processedJinaResults.map((r) => r.content || r.description || ""),
								}
								const embeddingUrl = new URL(
									jinaSettings.embeddingEndpoint || "https://api.jina.ai/v1/embeddings",
								)
								const embeddingOptions: https.RequestOptions = {
									method: "POST",
									hostname: embeddingUrl.hostname,
									path: embeddingUrl.pathname,
									headers: {
										Authorization: `Bearer ${jinaSettings.apiKey}`,
										"Content-Type": "application/json",
										Accept: "application/json",
									},
								}
								logger.info(`[webSearchTool] Jina embedding request to: ${embeddingUrl.toString()}`)
								const embeddingResponse: JinaSearchResponse = await httpsRequest(
									embeddingOptions,
									JSON.stringify(embeddingPayload),
									WEB_SEARCH_CONFIG.TIMEOUTS.JINA_EMBEDDING,
								)
								logger.debug(
									`[webSearchTool] Jina embedding response: ${JSON.stringify(embeddingResponse)}`,
								)

								if (embeddingResponse.data && Array.isArray(embeddingResponse.data)) {
									const embeddingData = embeddingResponse.data as JinaEmbeddingItem[]
									embeddingData.forEach((embItem) => {
										if (processedJinaResults[embItem.index] && embItem.embedding) {
											processedJinaResults[embItem.index].embedding = embItem.embedding
										}
									})
								} else {
									logger.warn(
										"[webSearchTool] Jina embeddings did not return expected results or failed.",
									)
								}
							}

							searchResults = processedJinaResults.slice(0, num_results).map((item) => ({
								provider: "jina",
								title: item.title,
								link: item.url,
								snippet: item.content || item.description || "",
								score: item.score,
								embedding: item.embedding,
								favicon: `https://www.google.com/s2/favicons?domain=${extractUrlParts(normalizeUrl(item.url, false, { removeXAnalytics: true, removeAnchors: true, removeSessionIDs: true, removeUTMParams: true, removeTrackingParams: true }) || item.url).hostname}`,
							}))
							if (searchResults.length > 0) break // Sai do switch se Jina teve sucesso
						} catch (jinaError: any) {
							logger.error(`[webSearchTool] Error with Jina provider: ${jinaError.message}`, jinaError)
							logger.info(`[webSearchTool] Quickly falling back to DuckDuckGo due to Jina error`)
							// Don't pushToolResult error immediately, let DuckDuckGo try first
							providerNameForResults = "duckduckgo_fallback" // Prepara para fallback rápido
						}
					}
					// Se apiKey faltar ou se o try/catch acima não der break e cair aqui,
					// o fluxo continua para o default (DuckDuckGo) se searchResults ainda estiver vazio.
					if (searchResults.length === 0) {
						// Garante que só fazemos fallback se Jina realmente não produziu nada
						providerNameForResults = "duckduckgo_fallback"
					}
					break
				}
				case "google_custom_search": {
					if (
						searchApiSettings?.searchApiProviderName === "google_custom_search" &&
						searchResults.length === 0
					) {
						logger.warn(
							"[webSearchTool] Google Custom Search provider is not yet implemented. Falling back to DuckDuckGo.",
						)
						providerNameForResults = "duckduckgo_fallback"
					}
					break
				}
				case "serper": {
					if (searchApiSettings?.searchApiProviderName === "serper" && searchResults.length === 0) {
						logger.warn(
							"[webSearchTool] Serper provider is not yet implemented. Falling back to DuckDuckGo.",
						)
						providerNameForResults = "duckduckgo_fallback"
					}
					break
				}
				case "brave_search": {
					if (searchApiSettings?.searchApiProviderName === "brave_search" && searchResults.length === 0) {
						logger.warn(
							"[webSearchTool] Brave Search provider is not yet implemented. Falling back to DuckDuckGo.",
						)
						providerNameForResults = "duckduckgo_fallback"
					}
					break
				}
				case "deep_research_fallback": {
					if (searchResults.length === 0) {
						logger.info(`[webSearchTool] Trying Deep Research fallback for complex query: "${query}"`)
						providerNameForResults = "deep_research_fallback"

						try {
							// Quick availability check with timeout
							const availabilityPromise = (async () => {
								const { DeepResearchClient } = await import("./deepResearch/client")
								const client = new DeepResearchClient()
								return await client.isAvailable()
							})()

							const timeoutPromise = new Promise((_, reject) =>
								setTimeout(
									() => reject(new Error("Deep Research timeout")),
									WEB_SEARCH_CONFIG.TIMEOUTS.DEEP_RESEARCH_CHECK,
								),
							)

							const isAvailable = await Promise.race([availabilityPromise, timeoutPromise])

							if (!isAvailable) {
								logger.warn(
									"[webSearchTool] Deep Research server not available. Falling back to DuckDuckGo.",
								)
								providerNameForResults = "duckduckgo_fallback"
								break // Sai do case e vai para o próximo
							}

							// Usar SSE Handler para busca com progresso
							const { DeepResearchSSEHandler } = await import("./deepResearch/sseHandler")
							const sseHandler = new DeepResearchSSEHandler()

							let deepResearchResult: any = null
							let hasCompleted = false

							// Configurar handlers
							sseHandler.onProgress((update: any) => {
								logger.info(
									`[webSearchTool] Deep Research progress: ${update.progress}% - ${update.message}`,
								)
							})

							sseHandler.onComplete((result: any) => {
								deepResearchResult = result
								hasCompleted = true
								logger.info("[webSearchTool] Deep Research completed successfully")
							})

							sseHandler.onError((error: any) => {
								logger.error(`[webSearchTool] Deep Research error: ${error.message}`)
								hasCompleted = true
							})

							// Iniciar busca
							await sseHandler.startSearch(query)

							// Aguardar conclusão (o simulateSSESearch já inclui delays)
							// Em uma implementação real, isso seria baseado nos eventos SSE

							if (deepResearchResult && deepResearchResult.result) {
								const result = deepResearchResult.result

								// Converter resultado Deep Research para formato WebSearchResultExtended
								searchResults = [
									{
										provider: "deep_research_fallback",
										title: `Deep Research: ${query}`,
										link: "deep-research://analysis",
										snippet: result.answer || "Análise avançada realizada pelo Deep Research",
										score: 1.0,
										finalScore: 1.0,
										favicon:
											"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM0LjY4NjMgMiAyIDQuNjg2MyAyIDhTNC42ODYzIDE0IDggMTRTMTQgMTEuMzEzNyAxNCA4UzExLjMxMzcgMiA4IDJaTTggMTJDNS43OTA5IDEyIDQgMTAuMjA5MSA0IDhTNS43OTA5IDQgOCA0UzEyIDUuNzkwOSAxMiA4UzEwLjIwOTEgMTIgOCAxMloiIGZpbGw9IiM0Qjc2ODgiLz4KPC9zdmc+",
										// Adicionar metadados do Deep Research
										deepResearchData: {
											think: result.think,
											reasoning: result["Nota Detalhada"] || result.nota_detalhada,
											references: result.references || [],
											visitedURLs: deepResearchResult.visitedURLs || [],
											readURLs: deepResearchResult.readURLs || [],
											allURLs: deepResearchResult.allURLs || [],
										},
									},
								]

								logger.info(
									`[webSearchTool] Deep Research generated ${searchResults.length} enhanced result`,
								)
							} else {
								logger.warn(
									"[webSearchTool] Deep Research did not return valid results. Falling back to DuckDuckGo.",
								)
								providerNameForResults = "duckduckgo_fallback"
							}

							// Limpar recursos
							sseHandler.cleanup()
						} catch (deepResearchError: any) {
							logger.error(
								`[webSearchTool] Deep Research fallback failed: ${deepResearchError.message}`,
								deepResearchError,
							)
							logger.info("[webSearchTool] Falling back to DuckDuckGo after Deep Research failure.")
							providerNameForResults = "duckduckgo_fallback"
						}
					}
					break
				}
				case "duckduckgo_fallback":
				default: {
					// Este bloco default será executado se:
					// 1. O providerNameForResults for explicitamente "duckduckgo_fallback"
					// 2. Nenhum dos cases anteriores corresponder (improvável com a lógica atual)
					// 3. Um case anterior (como "jina" sem apiKey ou com erro não fatal) definir providerNameForResults para "duckduckgo_fallback" E searchResults estiver vazio.
					if (searchResults.length === 0) {
						logger.info(
							`[webSearchTool] Using DuckDuckGo fallback (Provider was: ${providerNameForResults}, now switching to duckduckgo_fallback).`,
						)
						providerNameForResults = "duckduckgo_fallback" // Confirma que estamos usando DDG

						const searchUrlDdG = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
						logger.info(`[webSearchTool] Fetching URL for DuckDuckGo: ${searchUrlDdG}`)
						try {
							await cline.browserSession.launchBrowser()
							await cline.browserSession.navigateToUrl(searchUrlDdG)
							await cline.browserSession.doAction(async (page) => {
								rawResultsOutput = await page.content()
							})

							if (!rawResultsOutput) {
								throw new Error(`No HTML content fetched from search results page: ${searchUrlDdG}.`)
							}
							const ddgResults = parseHtmlResults(rawResultsOutput, num_results, "duckduckgo")
							// Adicionar favicon para resultados do DuckDuckGo também
							searchResults = ddgResults.map((r) => ({
								...r,
								provider: "duckduckgo_fallback",
								favicon: `https://www.google.com/s2/favicons?domain=${extractUrlParts(normalizeUrl(r.link, false, { removeXAnalytics: true, removeAnchors: true, removeSessionIDs: true, removeUTMParams: true, removeTrackingParams: true }) || r.link).hostname}`,
							}))
							logger.info(
								`[webSearchTool] Fetched and parsed ${searchResults.length} results from DuckDuckGo.`,
							)
						} finally {
							await cline.browserSession.closeBrowser()
							logger.info("[webSearchTool] Browser session closed for DuckDuckGo.")
						}
					}
					break
				}
			}
		} else {
			logger.info("[webSearchTool] No search provider configured or enabled. Falling back to DuckDuckGo.")
			providerNameForResults = "duckduckgo_fallback"
			const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
			logger.info(`[webSearchTool] Fetching URL for DuckDuckGo: ${searchUrl}`)
			try {
				await cline.browserSession.launchBrowser()
				await cline.browserSession.navigateToUrl(searchUrl)
				await cline.browserSession.doAction(async (page) => {
					rawResultsOutput = await page.content()
				})

				if (!rawResultsOutput) {
					throw new Error(`No HTML content fetched from search results page: ${searchUrl}.`)
				}
				const ddgResults = parseHtmlResults(rawResultsOutput, num_results, "duckduckgo")
				searchResults = ddgResults.map((r) => ({ ...r, provider: "duckduckgo_fallback" }))
				logger.info(`[webSearchTool] Fetched and parsed ${searchResults.length} results from DuckDuckGo.`)
			} finally {
				await cline.browserSession.closeBrowser()
				logger.info("[webSearchTool] Browser session closed for DuckDuckGo.")
			}
		}

		// Garantir que 'provider' esteja em todos os resultados.
		searchResults = searchResults.map(
			(r) => ({ ...r, provider: r.provider || providerNameForResults }) as WebSearchResultExtended,
		)

		// Adicionar data de última modificação
		const resultsWithLastModifiedPromises = searchResults.map(async (result) => {
			let lastModifiedDate: string | undefined
			if (result.link) {
				try {
					lastModifiedDate = await getLastModified(result.link)
				} catch (e: any) {
					logger.warn(`Falha ao obter lastModified para ${result.link}: ${e.message}`)
				}
			}
			return {
				...result,
				lastModified: lastModifiedDate,
				snippet: result.snippet || "", // Garantir que snippet exista para o próximo passo
			}
		})
		searchResults = await Promise.all(resultsWithLastModifiedPromises)

		// Re-ranquear resultados usando rankURLs
		// Criar um TrackerContext mínimo.
		const placeholderTrackerContext: TrackerContext = {
			tokenTracker: {
				countTokens: async (content: any) => {
					// Implementação placeholder para countTokens.
					// Isso deve ser substituído por uma implementação real.
					console.warn("[webSearchTool] Placeholder countTokens used")
					return 0
				},
			},
			actionTracker: {
				trackAction: (action: any) => {
					// Log da ação se o modo debug estiver ativo ou para telemetria futura.
					logger.debug(`[webSearchTool] rankURLs action: ${JSON.stringify(action)}`)
				},
			},
		}
		// Usar o languageCode da instância cline, se disponível, caso contrário, fallback.
		// TODO: Obter o languageCode de forma mais robusta a partir do contexto da Task/ClineProvider
		// Tentar obter do proxy de contexto, se existir e tiver a propriedade, senão usar fallback.
		const provider = cline.providerRef.deref()
		const contextProxy = provider?.contextProxy
		// Assumindo que contextProxy pode ter uma propriedade 'language' ou 'currentLanguage'
		// Esta é uma suposição e pode precisar ser ajustada com base na estrutura real de ContextProxy.
		const langFromProxy = (contextProxy as any)?.language || (contextProxy as any)?.currentLanguage
		const languageCode = langFromProxy || "pt-BR"
		const placeholderSchemas: Schemas = { languageCode }

		const snippetsForRanking: SearchSnippet[] = searchResults.map((r) => ({
			title: r.title || "",
			url: r.link, // rankURLs espera 'url'
			description: r.snippet || "",
			weight: r.score, // Usar o score inicial como peso base para ranqueamento
		}))

		// A função rankURLs em urlUtils.ts retorna um novo array.
		const rankedSnippets: BoostedSearchSnippet[] = rankURLs(
			snippetsForRanking,
			{ question: query }, // Passar a query atual para o reranking opcional dentro de rankURLs
			placeholderTrackerContext,
		)

		// Mapear resultados ranqueados de volta para searchResults
		// É importante garantir que todas as propriedades de WebSearchResultExtended sejam preservadas
		// e que os novos scores e campos de boost sejam adicionados.
		const rankedResultsMap = new Map<string, BoostedSearchSnippet>()
		rankedSnippets.forEach((rs) => {
			// Usar a URL original do snippet ranqueado, que deve corresponder ao 'link' original
			const originalLink = rs.url
			rankedResultsMap.set(originalLink, rs)
		})

		searchResults = searchResults
			.map((originalResult) => {
				const rankedData = rankedResultsMap.get(originalResult.link)
				if (rankedData) {
					return {
						...originalResult, // Mantém todas as propriedades originais (provider, favicon, lastModified, etc.)
						finalScore: rankedData.finalScore,
						score: rankedData.score, // rankURLs pode ter atualizado o 'score' base também (originalmente 'weight')
						freqBoost: rankedData.freqBoost,
						hostnameBoost: rankedData.hostnameBoost,
						pathBoost: rankedData.pathBoost,
						jinaRerankBoost: rankedData.jinaRerankBoost, // Se aplicável
					}
				}
				// Se, por algum motivo, um resultado original não estiver no mapa ranqueado
				// (ex: filtrado por rankURLs ou erro de mapeamento), mantenha o original com um finalScore baixo.
				return {
					...originalResult,
					finalScore: originalResult.score || 0,
				}
			})
			.sort((a, b) => (b.finalScore ?? b.score ?? 0) - (a.finalScore ?? a.score ?? 0)) // Ordenar pelo novo finalScore

		let approvalMessageContent = `Web search for "${query}" (using ${providerNameForResults}) found ${searchResults.length} results.`
		if (searchResults.length > 0) {
			approvalMessageContent += `\nExample: "${searchResults[0]?.title || "N/A"}" - ${
				searchResults[0]?.link || "N/A"
			}`
			const codeBlockStr = JSON.stringify(searchResults.slice(0, Math.min(searchResults.length, 3)), null, 2)
			approvalMessageContent += `\n\n\`\`\`json\n${codeBlockStr}\n\`\`\``
		}
		approvalMessageContent += "\nProceed to push these results?"

		const approved = await askApproval("tool" as ClineAsk, approvalMessageContent)

		if (!approved) {
			logger.info("[webSearchTool] User rejected the search results.")
			pushToolResult("User rejected the search results. Operation cancelled by user.")
			return
		}

		logger.info("[webSearchTool] Pushing search results.")
		const finalResultObject = {
			provider: providerNameForResults,
			query: query,
			results: searchResults,
		}
		// Aplicar fixBadURLMdLinks nos snippets antes de enviar para o usuário
		const resultsForUser = finalResultObject.results.map((r) => {
			// Criar o Record allURLs necessário para fixBadURLMdLinks
			// Este Record deve conter todas as URLs *originais* dos resultados atuais
			// para que fixBadURLMdLinks possa tentar encontrar títulos para elas.
			const allURLsForFixing: Record<string, SearchSnippet> = {}
			finalResultObject.results.forEach((sr) => {
				// Usar a URL original (não normalizada aqui) como chave se fixBadURLMdLinks espera isso,
				// ou a URL normalizada se fixBadURLMdLinks também normaliza internamente.
				// A implementação de fixBadURLMdLinks em urlUtils usa normalizeUrl(url) || url.
				// Então, usar o link original aqui é seguro.
				allURLsForFixing[sr.link] = {
					title: sr.title || "",
					url: sr.link, // Passar a URL original
					description: sr.snippet || "",
				}
			})
			return {
				...r,
				snippet: r.snippet ? fixBadURLMdLinks(r.snippet, allURLsForFixing) : "",
			}
		})

		pushToolResult(JSON.stringify({ ...finalResultObject, results: resultsForUser }, null, 2))
	} catch (error: any) {
		const errorMessage = `Error in web_search for query "${query || "unknown"}": ${
			error.message
		}\nRaw output (if any):\n${typeof rawResultsOutput === "string" ? rawResultsOutput.substring(0, 500) : "N/A"}`
		logger.error(`[webSearchTool] ${errorMessage}`, error)
		if (handleError) {
			await handleError(`web_search failed for query "${query || "unknown"}" (Tool ID: ${block.name})`, error)
		} else {
			pushToolResult(`ERROR: ${errorMessage}`)
		}
	}
}
