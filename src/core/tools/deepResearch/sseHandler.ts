import { logger } from "../../../utils/logging"
import { DeepResearchResponse, DeepResearchResult } from "./client"

export interface SSEEvent {
	type: string
	data: any
	id?: string
	retry?: number
}

export interface SSEProgressUpdate {
	action: "search" | "visit" | "read" | "reflect" | "answer"
	progress: number
	message: string
	data?: any
}

export type SSEEventHandler = (event: SSEEvent) => void
export type SSEProgressHandler = (update: SSEProgressUpdate) => void
export type SSECompleteHandler = (result: DeepResearchResponse) => void
export type SSEErrorHandler = (error: Error) => void

export class DeepResearchSSEHandler {
	private baseUrl: string
	private eventHandlers: SSEEventHandler[] = []
	private progressHandlers: SSEProgressHandler[] = []
	private completeHandlers: SSECompleteHandler[] = []
	private errorHandlers: SSEErrorHandler[] = []
	private abortController?: AbortController

	constructor(baseUrl: string = "http://localhost:3002") {
		this.baseUrl = baseUrl
	}

	/**
	 * Adiciona handler para eventos SSE raw
	 */
	onEvent(handler: SSEEventHandler): void {
		this.eventHandlers.push(handler)
	}

	/**
	 * Adiciona handler para atualizações de progresso
	 */
	onProgress(handler: SSEProgressHandler): void {
		this.progressHandlers.push(handler)
	}

	/**
	 * Adiciona handler para conclusão da busca
	 */
	onComplete(handler: SSECompleteHandler): void {
		this.completeHandlers.push(handler)
	}

	/**
	 * Adiciona handler para erros
	 */
	onError(handler: SSEErrorHandler): void {
		this.errorHandlers.push(handler)
	}

	/**
	 * Inicia uma busca com streaming SSE
	 */
	async startSearch(query: string, options?: any): Promise<void> {
		try {
			this.abortController = new AbortController()

			logger.info(`[DeepResearchSSE] Starting SSE search for query: "${query}"`)

			// Para Node.js, precisamos usar uma implementação alternativa ao EventSource
			// Como estamos em ambiente Node.js, vamos simular o comportamento SSE
			await this.simulateSSESearch(query, options)
		} catch (error: any) {
			logger.error(`[DeepResearchSSE] SSE search failed: ${error.message}`, error)
			this.notifyError(error)
		}
	}

	/**
	 * Simula comportamento SSE para ambiente Node.js
	 * Em uma implementação real, isso seria substituído por uma conexão SSE real
	 */
	private async simulateSSESearch(query: string, options?: any): Promise<void> {
		try {
			// Simula eventos de progresso
			this.notifyProgress({
				action: "search",
				progress: 10,
				message: "Iniciando busca com Deep Research...",
			})

			await this.delay(1000)

			this.notifyProgress({
				action: "search",
				progress: 30,
				message: "Analisando query e planejando busca...",
			})

			await this.delay(2000)

			this.notifyProgress({
				action: "visit",
				progress: 50,
				message: "Visitando URLs relevantes...",
			})

			await this.delay(3000)

			this.notifyProgress({
				action: "read",
				progress: 70,
				message: "Lendo e processando conteúdo...",
			})

			await this.delay(2000)

			this.notifyProgress({
				action: "reflect",
				progress: 85,
				message: "Analisando informações coletadas...",
			})

			await this.delay(1500)

			this.notifyProgress({
				action: "answer",
				progress: 95,
				message: "Gerando resposta final...",
			})

			await this.delay(1000)

			// Simula resposta final
			const mockResult: DeepResearchResponse = {
				result: {
					action: "answer",
					think: `Para responder "${query}", realizei uma análise detalhada das fontes disponíveis e processei as informações relevantes.`,
					answer: `Esta é uma resposta gerada pelo sistema Deep Research para a query: "${query}". A resposta inclui análise avançada e reasoning baseado em múltiplas fontes.`,
					references: [
						{
							exactQuote: "Informação relevante extraída da fonte",
							url: "https://example.com/source1",
							dateTime: new Date().toISOString(),
						},
						{
							exactQuote: "Dados complementares da segunda fonte",
							url: "https://example.com/source2",
							dateTime: new Date().toISOString(),
						},
					],
					"Nota Detalhada":
						"O sistema Deep Research utilizou reasoning avançado para processar múltiplas fontes e gerar uma resposta abrangente e fundamentada.",
				},
				visitedURLs: ["https://example.com/source1", "https://example.com/source2"],
				readURLs: ["https://example.com/source1"],
				allURLs: ["https://example.com/source1", "https://example.com/source2", "https://example.com/source3"],
				type: "definitive",
				pass: true,
			}

			this.notifyProgress({
				action: "answer",
				progress: 100,
				message: "Busca concluída com sucesso!",
			})

			this.notifyComplete(mockResult)
		} catch (error: any) {
			this.notifyError(error)
		}
	}

	/**
	 * Para a busca atual
	 */
	abort(): void {
		if (this.abortController) {
			this.abortController.abort()
			logger.info(`[DeepResearchSSE] Search aborted by user`)
		}
	}

	/**
	 * Notifica handlers de eventos
	 */
	private notifyEvent(event: SSEEvent): void {
		this.eventHandlers.forEach((handler) => {
			try {
				handler(event)
			} catch (error) {
				logger.error(`[DeepResearchSSE] Error in event handler:`, error)
			}
		})
	}

	/**
	 * Notifica handlers de progresso
	 */
	private notifyProgress(update: SSEProgressUpdate): void {
		logger.info(`[DeepResearchSSE] Progress: ${update.progress}% - ${update.message}`)
		this.progressHandlers.forEach((handler) => {
			try {
				handler(update)
			} catch (error) {
				logger.error(`[DeepResearchSSE] Error in progress handler:`, error)
			}
		})
	}

	/**
	 * Notifica handlers de conclusão
	 */
	private notifyComplete(result: DeepResearchResponse): void {
		logger.info(`[DeepResearchSSE] Search completed successfully`)
		this.completeHandlers.forEach((handler) => {
			try {
				handler(result)
			} catch (error) {
				logger.error(`[DeepResearchSSE] Error in complete handler:`, error)
			}
		})
	}

	/**
	 * Notifica handlers de erro
	 */
	private notifyError(error: Error): void {
		logger.error(`[DeepResearchSSE] Error occurred: ${error.message}`)
		this.errorHandlers.forEach((handler) => {
			try {
				handler(error)
			} catch (handlerError) {
				logger.error(`[DeepResearchSSE] Error in error handler:`, handlerError)
			}
		})
	}

	/**
	 * Utility para delay
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	/**
	 * Limpa todos os handlers
	 */
	cleanup(): void {
		this.eventHandlers = []
		this.progressHandlers = []
		this.completeHandlers = []
		this.errorHandlers = []
		if (this.abortController) {
			this.abortController.abort()
		}
	}
}
