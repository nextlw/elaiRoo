import * as https from "https"
import * as http from "http"
import { logger } from "../../../utils/logging"

export interface DeepResearchQuery {
	query: string
	tokenBudget?: number
	maxBadAttempts?: number
	numReturnedURLs?: number
	boostHostnames?: string[]
	badHostnames?: string[]
}

export interface DeepResearchReference {
	exactQuote: string
	url: string
	dateTime?: string
}

export interface DeepResearchResult {
	action: "answer" | "search" | "visit" | "reflect"
	think: string
	answer?: string
	references?: DeepResearchReference[]
	searchQuery?: string
	"url-list"?: string[]
	questionsToAnswer?: string[]
	"Nota Detalhada"?: string
	nota_detalhada?: string
}

export interface DeepResearchResponse {
	result: DeepResearchResult
	visitedURLs: string[]
	readURLs: string[]
	allURLs: string[]
	type?: "definitive" | "not_definitive"
	pass?: boolean
}

export interface DeepResearchHealthCheck {
	status: "ok" | "error"
	version?: string
	uptime?: number
}

// OpenAI-compatible message format
export interface ChatMessage {
	role: "user" | "assistant" | "system"
	content: string
}

export interface ChatCompletionRequest {
	model: string
	messages: ChatMessage[]
	stream?: boolean
	budget_tokens?: number
	max_attempts?: number
	max_returned_urls?: number
	boost_hostnames?: string[]
	bad_hostnames?: string[]
}

export interface ChatCompletionResponse {
	id: string
	object: string
	created: number
	model: string
	choices: Array<{
		index: number
		message: {
			role: string
			content: string
		}
		finish_reason: string
	}>
	usage: {
		prompt_tokens: number
		completion_tokens: number
		total_tokens: number
	}
	visitedURLs?: string[]
	readURLs?: string[]
	numURLs?: number
}

// Função auxiliar para requisições HTTP/HTTPS
async function makeRequest(url: URL, options: any, postData?: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const isHttps = url.protocol === "https:"
		const client = isHttps ? https : http

		const requestOptions = {
			...options,
			hostname: url.hostname,
			port: url.port || (isHttps ? 443 : 80),
			path: url.pathname + url.search,
		}

		const req = client.request(requestOptions, (res) => {
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

export class DeepResearchClient {
	private baseUrl: string
	private timeout: number

	constructor(baseUrl: string = "http://localhost:3002", timeout: number = 30000) {
		this.baseUrl = baseUrl
		this.timeout = timeout
	}

	/**
	 * Verifica a saúde do servidor Deep Research
	 */
	async healthCheck(): Promise<DeepResearchHealthCheck> {
		try {
			logger.info(`[DeepResearchClient] Checking health at ${this.baseUrl}/health`)

			const url = new URL(`${this.baseUrl}/health`)
			const options = {
				method: "GET",
				headers: {
					Accept: "application/json",
					"User-Agent": "elaiRoo-WebSearch/1.0",
				},
				timeout: this.timeout,
			}

			const response = await makeRequest(url, options)
			logger.info(`[DeepResearchClient] Health check successful: ${JSON.stringify(response)}`)
			return response
		} catch (error: any) {
			logger.error(`[DeepResearchClient] Health check failed: ${error.message}`, error)
			throw new Error(`Deep Research health check failed: ${error.message}`)
		}
	}

	/**
	 * Executa uma query de pesquisa no Deep Research usando API OpenAI
	 */
	async search(query: DeepResearchQuery): Promise<DeepResearchResponse> {
		try {
			logger.info(`[DeepResearchClient] Starting search for query: "${query.query}"`)

			const url = new URL(`${this.baseUrl}/v1/chat/completions`)
			const options = {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"User-Agent": "elaiRoo-WebSearch/1.0",
				},
				timeout: this.timeout,
			}

			const payload: ChatCompletionRequest = {
				model: "jina-deepsearch-v1",
				messages: [
					{
						role: "user",
						content: query.query,
					},
				],
				stream: false,
				budget_tokens: query.tokenBudget || 100000,
				max_attempts: query.maxBadAttempts || 2,
				max_returned_urls: query.numReturnedURLs || 10,
				boost_hostnames: query.boostHostnames || [],
				bad_hostnames: query.badHostnames || [],
			}

			logger.info(`[DeepResearchClient] Sending request with payload: ${JSON.stringify(payload, null, 2)}`)

			const response: ChatCompletionResponse = await makeRequest(url, options, JSON.stringify(payload))
			logger.info(`[DeepResearchClient] Search completed successfully`)
			logger.debug(`[DeepResearchClient] Response: ${JSON.stringify(response, null, 2)}`)

			// Converter resposta OpenAI para formato Deep Research
			const convertedResponse: DeepResearchResponse = {
				result: {
					action: "answer",
					think: "Deep Research analysis completed",
					answer: response.choices[0]?.message?.content || "",
					references: [], // TODO: Extrair das anotações se disponível
				},
				visitedURLs: response.visitedURLs || [],
				readURLs: response.readURLs || [],
				allURLs: [], // Será preenchido com base nos URLs visitados
				type: "definitive",
				pass: true,
			}

			// Preencher allURLs com união de visitedURLs e readURLs
			const allUrls = new Set([...(response.visitedURLs || []), ...(response.readURLs || [])])
			convertedResponse.allURLs = Array.from(allUrls)

			return convertedResponse
		} catch (error: any) {
			logger.error(`[DeepResearchClient] Search failed for query "${query.query}": ${error.message}`, error)
			throw new Error(`Deep Research search failed: ${error.message}`)
		}
	}

	/**
	 * Testa conectividade com o servidor
	 */
	async isAvailable(): Promise<boolean> {
		try {
			await this.healthCheck()
			return true
		} catch (error) {
			logger.warn(`[DeepResearchClient] Server not available: ${error}`)
			return false
		}
	}
}
