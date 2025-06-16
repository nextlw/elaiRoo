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

		logger.info(`[webSearchTool] SearchApiSettings obtained: ${JSON.stringify(searchApiSettings)}`)

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
							pushToolResult(`ERROR: Jina search failed: ${jinaError.message}`)
							if (handleError) {
								await handleError(`Jina search failed for query "${query}"`, jinaError)
								return // Retorna da função webSearchTool inteira em caso de erro fatal com Jina
							}
							providerNameForResults = "duckduckgo_fallback" // Prepara para fallback se handleError não for fatal
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

		let textApprovalMessage = `Web search for "${query}" (using ${providerNameForResults}) found ${searchResults.length} results.`
		if (searchResults.length > 0) {
			textApprovalMessage += `\n\nTop results:`
			searchResults.slice(0, Math.min(3, searchResults.length)).forEach((result, index) => {
				textApprovalMessage += `\n${index + 1}. ${result.title || "N/A"} - ${result.link || "N/A"}`
			})
		}
		textApprovalMessage += "\n\nProceed to retrieve these search results?"

		const approvalMessageContent = {
			tool: "webSearch",
			text: textApprovalMessage,
		}

		let approved = false
		try {
			logger.info(`[webSearchTool] Requesting approval for search results`)
			approved = await askApproval("tool" as ClineAsk, JSON.stringify(approvalMessageContent))
			logger.info(`[webSearchTool] Approval result: ${approved}`)
		} catch (approvalError: any) {
			logger.error(`[webSearchTool] Error during approval request: ${approvalError.message}`, approvalError)
			// Se houver erro na aprovação, trate como rejeitado
			pushToolResult(`ERROR: Failed to get approval: ${approvalError.message}`)
			return
		}

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

		// Garantir que o browser seja fechado em caso de erro
		try {
			await cline.browserSession.closeBrowser()
		} catch (closeError) {
			logger.error(`[webSearchTool] Error closing browser after error: ${closeError}`)
		}

		if (handleError) {
			await handleError(`web_search failed for query "${query || "unknown"}" (Tool ID: ${block.name})`, error)
		} else {
			pushToolResult(`ERROR: ${errorMessage}`)
		}
	}
}
