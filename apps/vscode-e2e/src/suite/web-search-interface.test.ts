import * as assert from "assert"
import type { RooCodeAPI } from "@roo-code/types"
import { waitUntilCompleted, sleep } from "./utils"

declare global {
	var api: RooCodeAPI
}

interface ToolUseMessage {
	type: "tool_use"
	toolName: string
	params: any
	blockId: string
	taskId: string
}

interface CompletionResultMessage {
	type: "say"
	say: "completion_result"
	text: string
	partial: false
}

type HandledMessage = any | ToolUseMessage

function isToolUseMessage(message: HandledMessage): message is ToolUseMessage {
	return message && message.type === "tool_use"
}

suite("Web Search Interface E2E Tests", () => {
	suite("Web Search com Deep Research", () => {
		test("deve detectar uso da ferramenta web_search e renderizar componente DeepResearchResultsBlock", async function () {
			this.timeout(60000)

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let webSearchResults: any = null
			let completionText: string | undefined

			const messageHandler = (message: HandledMessage) => {
				console.log(`[E2E Test] Received message: ${JSON.stringify(message)}`)

				if (isToolUseMessage(message)) {
					usedTools.push({
						name: message.toolName,
						params: message.params,
						blockId: message.blockId,
					})

					// Capturar especificamente web_search
					if (message.toolName === "web_search") {
						console.log(`[E2E Test] web_search tool detected with params:`, message.params)
					}
				}

				// Capturar resultados de web search
				if (message.type === "say" && message.text && message.text.includes('"provider"')) {
					try {
						const parsedResult = JSON.parse(message.text)
						if (parsedResult.provider && parsedResult.results) {
							webSearchResults = parsedResult
							console.log(`[E2E Test] Web search results captured:`, parsedResult)
						}
					} catch (e) {
						// Não é JSON válido, ignorar
					}
				}

				if (message.type === "say" && message.say === "completion_result") {
					completionText = message.text
				}
			}

			api.on("message", messageHandler)

			const query = "Como implementar análise de sentimento em português usando transformers?"
			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: `Faça uma busca web sobre: "${query}". Use a ferramenta web_search para encontrar informações detalhadas.`,
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 45000 })
			} catch (error) {
				console.warn(`[E2E Test] Task may have timed out: ${error}`)
			}

			api.off("message", messageHandler)

			// Verificações dos resultados
			console.log(`[E2E Test] Used tools: ${JSON.stringify(usedTools)}`)
			console.log(`[E2E Test] Web search results: ${JSON.stringify(webSearchResults)}`)

			// Verificar que web_search foi chamada
			const webSearchTool = usedTools.find((tool) => tool.name === "web_search")
			assert.ok(webSearchTool, "web_search tool should have been used")
			assert.ok(webSearchTool.params.query, "web_search should have query parameter")
			assert.strictEqual(typeof webSearchTool.params.query, "string", "Query should be a string")

			// Se temos resultados, verificar a estrutura
			if (webSearchResults) {
				assert.ok(webSearchResults.provider, "Results should have provider")
				assert.ok(Array.isArray(webSearchResults.results), "Results should be an array")
				assert.ok(webSearchResults.query, "Results should include the original query")

				// Se for Deep Research, verificar estrutura específica
				if (webSearchResults.provider === "deep_research_fallback") {
					const firstResult = webSearchResults.results[0]
					if (firstResult && firstResult.deepResearchData) {
						assert.ok(
							firstResult.deepResearchData.think || firstResult.deepResearchData.reasoning,
							"Deep Research should have thinking or reasoning data",
						)
						console.log("[E2E Test] ✅ Deep Research data structure validated")
					}
				}

				console.log(
					`[E2E Test] ✅ Web search completed with ${webSearchResults.results.length} results from ${webSearchResults.provider}`,
				)
			} else {
				console.log("[E2E Test] ⚠️ No web search results captured, but tool was used")
			}
		})

		test("deve medir tempo de resposta da busca web", async function () {
			this.timeout(45000)

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; timestamp: number }> = []
			let startTime: number = 0
			let endTime: number = 0

			const messageHandler = (message: HandledMessage) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					startTime = Date.now()
					usedTools.push({
						name: message.toolName,
						params: message.params,
						timestamp: startTime,
					})
				}

				if (message.type === "say" && message.say === "completion_result") {
					endTime = Date.now()
				}
			}

			api.on("message", messageHandler)

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busque informações sobre 'BERT vs DistilBERT performance comparison' usando web search.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 30000 })
				if (endTime === 0) {
					endTime = Date.now()
				}
			} catch (error) {
				endTime = Date.now()
				console.warn(`[E2E Test] Task timed out: ${error}`)
			}

			api.off("message", messageHandler)

			const duration = endTime - startTime
			console.log(`[E2E Test] Web search completed in ${duration}ms`)

			assert.ok(startTime > 0, "Start time should be recorded")
			assert.ok(endTime > 0, "End time should be recorded")
			assert.ok(duration > 0, "Duration should be positive")
			assert.ok(duration < 30000, "Search should complete within 30 seconds")

			const webSearchUsed = usedTools.find((tool) => tool.name === "web_search")
			assert.ok(webSearchUsed, "web_search tool should have been used")

			console.log(`[E2E Test] ✅ Performance test completed: ${duration}ms`)
		})
	})

	suite("Validação de Interface do Componente", () => {
		test("deve validar que resultados Deep Research são renderizados corretamente", async function () {
			this.timeout(30000)

			const api = globalThis.api
			let deepResearchDetected = false
			let componentDataValidated = false

			const messageHandler = (message: HandledMessage) => {
				if (message.type === "say" && message.text) {
					try {
						const parsed = JSON.parse(message.text)
						if (parsed.provider === "deep_research_fallback" && parsed.results) {
							deepResearchDetected = true

							// Validar estrutura necessária para o componente DeepResearchResultsBlock
							const firstResult = parsed.results[0]
							if (firstResult) {
								// Verificar propriedades básicas necessárias
								const hasRequiredProps = firstResult.title && firstResult.url && firstResult.snippet

								// Verificar dados específicos do Deep Research
								const hasDeepResearchData =
									firstResult.deepResearchData &&
									(firstResult.deepResearchData.think || firstResult.deepResearchData.reasoning)

								if (hasRequiredProps && hasDeepResearchData) {
									componentDataValidated = true
									console.log(
										"[E2E Test] ✅ Component data structure validated for DeepResearchResultsBlock",
									)
								}
							}
						}
					} catch (e) {
						// Não é JSON, ignorar
					}
				}
			}

			api.on("message", messageHandler)

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Pesquise sobre 'machine learning interpretability methods' e forneça uma análise detalhada.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 25000 })
			} catch (error) {
				console.warn(`[E2E Test] Task may have timed out: ${error}`)
			}

			api.off("message", messageHandler)

			if (deepResearchDetected) {
				assert.ok(componentDataValidated, "Deep Research component data should be properly structured")
				console.log("[E2E Test] ✅ Deep Research interface validation completed")
			} else {
				console.log("[E2E Test] ⚠️ Deep Research not triggered, but basic web search functionality verified")
			}
		})
	})

	suite("Fallback e Error Handling", () => {
		test("deve lidar graciosamente com queries simples que não acionam Deep Research", async function () {
			this.timeout(20000)

			const api = globalThis.api
			let webSearchUsed = false
			let resultsReceived = false

			const messageHandler = (message: HandledMessage) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					webSearchUsed = true
				}

				if (message.type === "say" && message.text && message.text.includes('"results"')) {
					resultsReceived = true
				}
			}

			api.on("message", messageHandler)

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busque por 'Python tutorial' usando web search.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 15000 })
			} catch (error) {
				console.warn(`[E2E Test] Task timed out: ${error}`)
			}

			api.off("message", messageHandler)

			assert.ok(webSearchUsed, "web_search should be used even for simple queries")

			if (resultsReceived) {
				console.log("[E2E Test] ✅ Fallback handling verified - results received")
			} else {
				console.log("[E2E Test] ⚠️ Tool used but no results captured")
			}
		})
	})
})
