import { webSearchTool } from "../webSearchTool"
import { webSearchParamsSchema } from "../../../schemas"
import { Task } from "../../task/Task"

// Mock da classe Task
const mockTask = {
	providerRef: {
		deref: () => ({
			contextProxy: {
				getSearchApiSettings: () => null,
			},
		}),
	},
	browserSession: {
		launchBrowser: jest.fn(),
		navigateToUrl: jest.fn(),
		doAction: jest.fn(),
		closeBrowser: jest.fn(),
	},
} as any

// Mock da classe Task com configuração Jina
const mockTaskWithJina = {
	providerRef: {
		deref: () => ({
			contextProxy: {
				getSearchApiSettings: () => ({
					searchApiProviderName: "jina",
					apiKey: "test-api-key",
					searchEndpoint: "https://s.jina.ai/search",
					enableReranking: false,
					enableResultEmbeddings: false,
					isEnabled: true,
				}),
			},
		}),
	},
	browserSession: {
		launchBrowser: jest.fn(),
		navigateToUrl: jest.fn(),
		doAction: jest.fn(),
		closeBrowser: jest.fn(),
	},
} as any

describe("WebSearchTool", () => {
	const mockCallbacks = {
		askApproval: jest.fn(),
		pushToolResult: jest.fn(),
		handleError: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
		mockCallbacks.askApproval.mockResolvedValue(true)
	})

	describe("Parameter validation", () => {
		it("should validate required query parameter", () => {
			const invalidParams = { num_results: 5 } // missing query AND tool_name
			const result = webSearchParamsSchema.safeParse(invalidParams)
			expect(result.success).toBe(false)
			// O primeiro erro é sobre tool_name, depois query
			expect(result.error?.issues[0].path).toEqual(["tool_name"])
		})

		it("should validate valid parameters", () => {
			const validParams = {
				tool_name: "web_search",
				query: "capital da França",
				num_results: 3,
			}
			const result = webSearchParamsSchema.safeParse(validParams)
			expect(result.success).toBe(true)
		})
	})

	describe("Jina API Configuration", () => {
		it("should detect when Jina API key is configured", () => {
			const searchApiSettings = mockTaskWithJina.providerRef.deref().contextProxy.getSearchApiSettings()

			expect(searchApiSettings).toBeDefined()
			expect(searchApiSettings.searchApiProviderName).toBe("jina")
			expect(searchApiSettings.apiKey).toBe("test-api-key")
			expect(searchApiSettings.isEnabled).toBe(true)
		})

		it("should detect when no search API is configured", () => {
			const searchApiSettings = mockTask.providerRef.deref().contextProxy.getSearchApiSettings()

			expect(searchApiSettings).toBeNull()
		})
	})

	describe("Tool execution", () => {
		it("should handle missing query parameter and call handleError", async () => {
			const block = {
				name: "web_search",
				params: { num_results: 5 }, // missing query
			}

			await webSearchTool(mockTask, block as any, mockCallbacks)

			// O webSearchTool chama handleError quando há erro de validação
			expect(mockCallbacks.handleError).toHaveBeenCalled()
		})

		it("should process valid query without search API settings", async () => {
			const block = {
				name: "web_search",
				params: {
					query: "teste query",
					num_results: 3,
				},
			}

			// Mock browser session
			mockTask.browserSession.doAction.mockImplementation(async (callback: any) => {
				await callback({
					content: () =>
						'<html><div class="result"><h3><a href="http://example.com">Test Result</a></h3><p>Test snippet</p></div></html>',
				})
			})

			await webSearchTool(mockTask, block as any, mockCallbacks)

			expect(mockCallbacks.askApproval).toHaveBeenCalled()
			expect(mockCallbacks.pushToolResult).toHaveBeenCalled()
		})

		it("should fallback to Deep Research when enabled", async () => {
			const mockTaskWithDeepResearch = {
				providerRef: {
					deref: () => ({
						contextProxy: {
							getSearchApiSettings: () => ({
								searchApiProviderName: "deep_research_fallback",
								endpoint: "http://localhost:3002",
								timeout: 30000,
								enableSSE: true,
								isEnabled: true,
							}),
						},
					}),
				},
				browserSession: {
					launchBrowser: jest.fn(),
					navigateToUrl: jest.fn(),
					doAction: jest.fn(),
					closeBrowser: jest.fn(),
				},
			} as any

			const block = {
				name: "web_search",
				params: {
					query: "Como implementar análise de sentimento?",
					num_results: 3,
				},
			}

			await webSearchTool(mockTaskWithDeepResearch, block as any, mockCallbacks)

			// Verificar se foi chamado com aprovação
			expect(mockCallbacks.askApproval).toHaveBeenCalled()

			// Verificar se o resultado foi enviado
			expect(mockCallbacks.pushToolResult).toHaveBeenCalled()

			// Verificar se o resultado contém dados do Deep Research
			const pushCallArgs = mockCallbacks.pushToolResult.mock.calls[0][0]
			const resultData = JSON.parse(pushCallArgs)

			expect(resultData.provider).toBe("deep_research_fallback")
			expect(resultData.results).toHaveLength(1)
			expect(resultData.results[0]).toHaveProperty("deepResearchData")
			expect(resultData.results[0].deepResearchData).toHaveProperty("think")
			expect(resultData.results[0].deepResearchData).toHaveProperty("reasoning")
		})
	})
})
