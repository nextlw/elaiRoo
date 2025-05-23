import { Task } from "../task/Task"
import {
	// WebSearchParams, // Mantido para validação de parâmetros do bloco, se necessário - Removido pois não é usado
	WebSearchResult as OriginalWebSearchResult, // Importar original para estender
	ClineAsk,
	SearchApiSettings,
} from "../../schemas"
import { AskApproval, PushToolResult, HandleError, ToolUse } from "../../shared/tools"
import { parseHtmlResults } from "../../utils/htmlParsingUtils"
import { z } from "zod"
import * as https from "https"
import { logger } from "../../utils/logging"

// Estender WebSearchResult para incluir 'provider' e campos opcionais de Jina
interface WebSearchResultExtended extends OriginalWebSearchResult {
	provider: string
	score?: number
	embedding?: number[]
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

// Função auxiliar para requisições HTTPS
async function httpsRequest(options: https.RequestOptions, postData?: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
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
		const actualParamsSchema = z.object({
			query: z.string(),
			num_results: z.number().optional(),
		})

		const paramsValidation = actualParamsSchema.safeParse(block.params)

		if (!paramsValidation.success) {
			const errorMessage = `Invalid parameters for web_search: ${paramsValidation.error.toString()}`
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

		const searchApiSettings: SearchApiSettings | undefined = cline.providerRef
			.deref()
			?.contextProxy?.getSearchApiSettings()

		if (searchApiSettings && searchApiSettings.isEnabled !== false) {
			providerNameForResults = searchApiSettings.searchApiProviderName
			logger.info(`[webSearchTool] Using search provider: ${searchApiSettings.searchApiProviderName}`)

			switch (searchApiSettings.searchApiProviderName) {
				case "jina":
					const jinaSettings = searchApiSettings // TypeScript infere JinaSearchApiSettings aqui
					if (!jinaSettings.apiKey) {
						logger.warn("[webSearchTool] Jina API key is missing. Falling back to DuckDuckGo.")
						providerNameForResults = "duckduckgo_fallback"
						// Deixa cair para o default/fallback
					} else {
						try {
							const searchUrl = new URL(jinaSettings.searchEndpoint || "https://s.jina.ai/")
							// Jina search API espera a query como parte do path, não como query param
							searchUrl.pathname = searchUrl.pathname.replace(/\/$/, "") + `/${encodeURIComponent(query)}`

							const searchOptions: https.RequestOptions = {
								method: "GET",
								hostname: searchUrl.hostname,
								path: searchUrl.pathname + searchUrl.search, // searchUrl.search deve estar vazio aqui
								headers: {
									Authorization: `Bearer ${jinaSettings.apiKey}`,
									Accept: "application/json",
									"X-Respond-With": "no-content",
								},
							}
							logger.info(
								`[webSearchTool] Jina search request: ${searchOptions.method} ${searchUrl.protocol}//${searchUrl.host}${searchUrl.pathname}`,
							)
							const jinaResponse: JinaSearchResponse = await httpsRequest(searchOptions)
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
									model: jinaSettings.embeddingModel || "jina-embeddings-v2-base-en", // Defaulting to v2 as v3 might not be standard
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
								link: item.url, // Mapeado de Jina 'url'
								snippet: item.content || item.description || "", // Mapeado de Jina 'content'
								score: item.score,
								embedding: item.embedding,
							}))
							if (searchResults.length > 0) break
						} catch (jinaError: any) {
							logger.error(`[webSearchTool] Error with Jina provider: ${jinaError.message}`, jinaError)
							pushToolResult(`ERROR: Jina search failed: ${jinaError.message}`)
							if (handleError) {
								await handleError(`Jina search failed for query "${query}"`, jinaError)
								return
							}
							providerNameForResults = "duckduckgo_fallback" // Prepara para fallback
						}
					}
					break
				// Se Jina não produziu resultados (apiKey faltante ou erro não tratado que não retornou),
				// o fluxo continua para o default (DuckDuckGo) devido à ausência de 'break' aqui se apiKey faltar,
				// ou se o 'break' acima foi pulado porque searchResults estava vazio.

				case "google_custom_search":
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
				case "serper":
					if (searchApiSettings?.searchApiProviderName === "serper" && searchResults.length === 0) {
						logger.warn(
							"[webSearchTool] Serper provider is not yet implemented. Falling back to DuckDuckGo.",
						)
						providerNameForResults = "duckduckgo_fallback"
					}
					break
				case "brave_search":
					if (searchApiSettings?.searchApiProviderName === "brave_search" && searchResults.length === 0) {
						logger.warn(
							"[webSearchTool] Brave Search provider is not yet implemented. Falling back to DuckDuckGo.",
						)
						providerNameForResults = "duckduckgo_fallback"
					}
					break
				case "duckduckgo_fallback":
				default:
					if (searchResults.length === 0) {
						// Só executa fallback se nenhum resultado foi obtido ainda
						logger.info(
							`[webSearchTool] Using DuckDuckGo fallback (Provider was: ${providerNameForResults}, now switching to duckduckgo_fallback).`,
						)
						providerNameForResults = "duckduckgo_fallback"

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
							searchResults = ddgResults.map((r) => ({ ...r, provider: "duckduckgo_fallback" }))
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

		// Garantir que 'provider' esteja em todos os resultados, caso algum passo anterior não o tenha definido.
		searchResults = searchResults.map((r) => ({ ...r, provider: r.provider || providerNameForResults }))

		let approvalMessageContent = `Web search for "${query}" (using ${providerNameForResults}) found ${searchResults.length} results.`
		if (searchResults.length > 0) {
			approvalMessageContent += `\nExample: "${searchResults[0]?.title || "N/A"}" - ${searchResults[0]?.link || "N/A"}`
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
		pushToolResult(JSON.stringify(finalResultObject, null, 2))
	} catch (error: any) {
		const errorMessage = `Error in web_search for query "${query || "unknown"}": ${error.message}\nRaw output (if any):\n${typeof rawResultsOutput === "string" ? rawResultsOutput.substring(0, 500) : "N/A"}`
		logger.error(`[webSearchTool] ${errorMessage}`, error)
		if (handleError) {
			await handleError(`web_search failed for query "${query || "unknown"}" (Tool ID: ${block.name})`, error)
		} else {
			pushToolResult(`ERROR: ${errorMessage}`)
		}
	}
}
