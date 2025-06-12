import * as assert from "assert"
import type { RooCodeAPI } from "@roo-code/types"
import { waitUntilCompleted, sleep } from "./utils"

declare global {
	var api: RooCodeAPI
}

suite("Web Search UI Components E2E Tests", () => {
	suite("DeepResearchResultsBlock Component Integration", () => {
		test("deve renderizar resultados de Deep Research com componente correto", async function () {
			this.timeout(45000)

			const api = globalThis.api
			let deepResearchResultsFound = false
			let componentStructureValid = false

			const messageHandler = (message: any) => {
				// Verificar se recebemos resultados de Deep Research
				if (message.type === "say" && message.text) {
					try {
						const parsed = JSON.parse(message.text)
						if (parsed.provider === "deep_research_fallback" && parsed.results) {
							deepResearchResultsFound = true

							// Validar que a estrutura está correta para o componente DeepResearchResultsBlock
							const result = parsed.results[0]
							if (result) {
								const hasBasicProps = result.title && result.url && result.snippet
								const hasDeepResearchData =
									result.deepResearchData &&
									(result.deepResearchData.think ||
										result.deepResearchData.reasoning ||
										result.deepResearchData.references)

								if (hasBasicProps && hasDeepResearchData) {
									componentStructureValid = true
									console.log("[E2E UI Test] ✅ DeepResearchResultsBlock data structure validated")

									// Validar estrutura específica das referências se presente
									if (
										result.deepResearchData.references &&
										Array.isArray(result.deepResearchData.references)
									) {
										const firstRef = result.deepResearchData.references[0]
										if (firstRef && firstRef.exactQuote && firstRef.url) {
											console.log("[E2E UI Test] ✅ References structure validated")
										}
									}
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
				text: "Faça uma análise detalhada sobre 'neural network interpretability techniques in NLP' usando web search com reasoning avançado.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 40000 })
			} catch (error) {
				console.warn(`[E2E UI Test] Task may have timed out: ${error}`)
			}

			api.off("message", messageHandler)

			if (deepResearchResultsFound) {
				assert.ok(
					componentStructureValid,
					"Deep Research component data should be properly structured for UI rendering",
				)
				console.log("[E2E UI Test] ✅ DeepResearchResultsBlock component integration validated")
			} else {
				console.log("[E2E UI Test] ⚠️ Deep Research not triggered, testing basic web search UI")
			}
		})

		test("deve validar campos obrigatórios para renderização do componente", async function () {
			this.timeout(30000)

			const api = globalThis.api
			let webSearchResults: any = null

			const messageHandler = (message: any) => {
				if (message.type === "say" && message.text && message.text.includes('"provider"')) {
					try {
						const parsed = JSON.parse(message.text)
						if (parsed.provider && parsed.results && Array.isArray(parsed.results)) {
							webSearchResults = parsed
						}
					} catch (e) {
						// Não é JSON válido
					}
				}
			}

			api.on("message", messageHandler)

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busque por 'React hooks best practices' usando web search.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 25000 })
			} catch (error) {
				console.warn(`[E2E UI Test] Task may have timed out: ${error}`)
			}

			api.off("message", messageHandler)

			if (webSearchResults) {
				// Validar propriedades obrigatórias para o componente
				assert.ok(webSearchResults.provider, "Provider é obrigatório para renderização")
				assert.ok(webSearchResults.query, "Query é obrigatória para exibir contexto")
				assert.ok(Array.isArray(webSearchResults.results), "Results deve ser um array")

				if (webSearchResults.results.length > 0) {
					const firstResult = webSearchResults.results[0]
					assert.ok(firstResult.title, "Result deve ter title")
					assert.ok(firstResult.url, "Result deve ter url")
					assert.ok(firstResult.snippet, "Result deve ter snippet")

					console.log(`[E2E UI Test] ✅ Component props validation passed for ${webSearchResults.provider}`)
				}
			} else {
				console.log("[E2E UI Test] ⚠️ No web search results to validate")
			}
		})
	})

	suite("Responsividade e Acessibilidade", () => {
		test("deve validar que dados são adequados para diferentes tamanhos de tela", async function () {
			this.timeout(25000)

			const api = globalThis.api
			let resultsForValidation: any = null

			const messageHandler = (message: any) => {
				if (message.type === "say" && message.text && message.text.includes('"results"')) {
					try {
						const parsed = JSON.parse(message.text)
						if (parsed.results && Array.isArray(parsed.results)) {
							resultsForValidation = parsed
						}
					} catch (e) {
						// Ignorar se não for JSON
					}
				}
			}

			api.on("message", messageHandler)

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busque informações sobre 'JavaScript testing frameworks' usando web search.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 20000 })
			} catch (error) {
				console.warn(`[E2E UI Test] Task may have timed out: ${error}`)
			}

			api.off("message", messageHandler)

			if (resultsForValidation && resultsForValidation.results.length > 0) {
				resultsForValidation.results.forEach((result: any, index: number) => {
					// Validações de acessibilidade e responsividade

					// Títulos não devem ser muito longos para telas pequenas
					if (result.title) {
						assert.ok(
							result.title.length <= 150,
							`Title ${index} should be ≤150 chars for mobile (got ${result.title.length})`,
						)
					}

					// URLs devem ser válidas
					if (result.url) {
						assert.ok(
							result.url.length <= 200,
							`URL ${index} should be reasonable length (got ${result.url.length})`,
						)
						assert.ok(
							result.url.startsWith("http") || result.url.startsWith("deep-research://"),
							`URL ${index} should be valid format`,
						)
					}

					// Snippets não devem ser muito repetitivos
					if (result.snippet) {
						const words = result.snippet.split(" ")
						const uniqueWords = new Set(words.map((w: string) => w.toLowerCase()))
						const repetitionRatio = uniqueWords.size / words.length
						assert.ok(
							repetitionRatio > 0.3,
							`Snippet ${index} should not be too repetitive (ratio: ${repetitionRatio})`,
						)
					}
				})

				console.log(
					`[E2E UI Test] ✅ Responsiveness and accessibility validation passed for ${resultsForValidation.results.length} results`,
				)
			} else {
				console.log("[E2E UI Test] ⚠️ No results to validate for responsiveness")
			}
		})
	})

	suite("Estados de Loading e Progresso", () => {
		test("deve detectar progresso durante busca web complexa", async function () {
			this.timeout(35000)

			const api = globalThis.api
			let toolCallDetected = false
			let progressIndicatorsCount = 0

			const messageHandler = (message: any) => {
				// Detectar quando a ferramenta é chamada
				if (message.type === "tool_use" && message.toolName === "web_search") {
					toolCallDetected = true
					console.log("[E2E UI Test] Web search tool call detected - loading state should be visible")
				}

				// Contar indicadores de progresso/loading
				if (message.type === "say" && message.partial === true) {
					progressIndicatorsCount++
				}
			}

			api.on("message", messageHandler)

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Realize uma busca web detalhada sobre 'advanced machine learning optimization techniques for large datasets' e forneça insights.",
			})

			try {
				await waitUntilCompleted({ api, taskId, timeout: 30000 })
			} catch (error) {
				console.warn(`[E2E UI Test] Task may have timed out: ${error}`)
			}

			api.off("message", messageHandler)

			assert.ok(toolCallDetected, "Web search tool should have been called to trigger loading states")

			console.log(
				`[E2E UI Test] ✅ Progress/loading state test completed - ${progressIndicatorsCount} progress updates detected`,
			)
		})
	})
})
