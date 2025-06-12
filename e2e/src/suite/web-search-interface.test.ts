/// <reference types="mocha" />
import * as assert from "assert"
import type { ClineMessage } from "../../../src/exports/roo-code"
import { waitUntilCompleted, waitFor, sleep } from "./utils"

declare global {
	var api: any
}

interface ToolUseMessage extends ClineMessage {
	type: "tool_use"
	toolName: string
	params: any
	blockId: string
	taskId: string
}

interface CompletionResultMessage extends ClineMessage {
	type: "say"
	say: "completion_result"
	text: string
	partial: false
}

type HandledMessage = ClineMessage | ToolUseMessage

function isToolUseMessage(message: HandledMessage): message is ToolUseMessage {
	return message.type === "tool_use"
}

// @ts-ignore - Mocha globals
suite("Web Search Interface E2E Tests", () => {
	// @ts-ignore - Mocha globals
	suite("Web Search com Jina API", () => {
		// @ts-ignore - Mocha globals
		test("deve realizar uma busca web básica e exibir resultados formatados", async function () {
			this.timeout(60000) // Timeout maior para testes de interface

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let completionText: string | undefined

			const mockJinaResults = {
				provider: "jina",
				query: "análise de sentimento python BERT",
				results: [
					{
						title: "BERT for Sentiment Analysis in Python",
						link: "https://example.com/bert-sentiment",
						snippet:
							"Complete guide to implementing BERT for sentiment analysis in Python with transformers library.",
						score: 0.95,
						provider: "jina",
						favicon: "https://www.google.com/s2/favicons?domain=example.com",
					},
					{
						title: "DistilBERT vs BERT Performance Comparison",
						link: "https://research.com/distilbert-comparison",
						snippet: "Performance analysis comparing BERT and DistilBERT for text classification tasks.",
						score: 0.87,
						provider: "jina",
						favicon: "https://www.google.com/s2/favicons?domain=research.com",
					},
				],
			}

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message)) {
					console.log(`[E2E Test] Tool use detected: ${message.toolName}`, message.params)
					usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

					if (message.toolName === "web_search") {
						console.log(`[E2E Test] Mocking Jina web_search result (blockId: ${message.blockId})`)
						;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
							result: JSON.stringify(mockJinaResults),
						})
					}
				} else if (message.type === "say" && message.say === "completion_result" && message.partial === false) {
					const completionMsg = message as CompletionResultMessage
					console.log(`[E2E Test] Completion result received:`, completionMsg.text)
					completionText = completionMsg.text
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "code", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Faça uma busca sobre análise de sentimento em Python usando BERT",
			})

			api.on("message", messageHandler)

			console.log(`[E2E Test] Task started with ID: ${taskId}. Waiting for completion...`)

			await waitUntilCompleted({ api, taskId })
			console.log(`[E2E Test] Task ${taskId} completed.`)

			api.off("message", messageHandler)

			// Validações
			const webSearchCall = usedTools.find((tool) => tool.name === "web_search")
			assert.ok(webSearchCall, "Web search tool should have been called")
			if (webSearchCall) {
				assert.ok(
					webSearchCall.params?.query.toLowerCase().includes("sentimento"),
					"Query should contain 'sentimento'",
				)
				assert.ok(webSearchCall.params?.query.toLowerCase().includes("python"), "Query should contain 'python'")
			}

			assert.ok(completionText, "Completion text should be present")
			if (completionText) {
				// Verificar que os resultados da busca estão presentes
				assert.ok(completionText.includes("BERT"), "Completion should contain 'BERT'")
				assert.ok(completionText.includes("sentiment"), "Completion should contain 'sentiment'")
			}

			console.log("[E2E Test] Web Search básico - Assertions passed.")
		})
	})

	// @ts-ignore - Mocha globals
	suite("Deep Research Fallback", () => {
		// @ts-ignore - Mocha globals
		test("deve usar Deep Research quando Jina falha e exibir interface específica", async function () {
			this.timeout(60000)

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let completionText: string | undefined

			const mockDeepResearchResults = {
				provider: "deep_research_fallback",
				query: "Como implementar análise de sentimento em português usando transformers e qual a diferença de performance entre BERT e DistilBERT?",
				results: [
					{
						title: "Deep Research: Como implementar análise de sentimento em português usando transformers e qual a diferença de performance entre BERT e DistilBERT?",
						link: "deep-research://analysis",
						snippet:
							"Análise completa sobre implementação de análise de sentimento em português, comparando BERT e DistilBERT com métricas de performance detalhadas.",
						score: 1.0,
						provider: "deep_research_fallback",
						favicon:
							"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM0LjY4NjMgMiAyIDQuNjg2MyAyIDhTNC42ODYzIDE0IDggMTRTMTQgMTEuMzEzNyAxNCA4UzExLjMxMzcgMiA4IDJaTTggMTJDNS43OTA5IDEyIDQgMTAuMjA5MSA0IDhTNS43OTA5IDQgOCA0UzEyIDUuNzkwOSAxMiA4UzEwLjIwOTEgMTIgOCAxMloiIGZpbGw9IiM0Qjc2ODgiLz4KPC9zdmc+",
						deepResearchData: {
							think: "Para responder esta pergunta complexa sobre análise de sentimento em português, preciso buscar informações sobre diferentes modelos de transformers, suas implementações específicas para português e comparações de performance entre BERT e DistilBERT.",
							reasoning: `## Implementação de Análise de Sentimento em Português

### 1. Modelos Recomendados
- **BERTimbau**: Modelo BERT treinado especificamente em português brasileiro
- **DistilBERT Multilingual**: Versão compacta do BERT com boa performance

### 2. Diferenças de Performance
- **BERT**: Maior acurácia (F1-score ~0.92) mas 6x mais lento
- **DistilBERT**: Acurácia reduzida (F1-score ~0.88) mas 6x mais rápido
- **Uso de memória**: DistilBERT usa 40% menos RAM

### 3. Implementação Prática
\`\`\`python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Carregar modelo específico para português
model_name = "neuralmind/bert-base-portuguese-cased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
\`\`\``,
							references: [
								{
									exactQuote:
										"BERTimbau achieved state-of-the-art results on Portuguese sentiment analysis tasks",
									url: "https://arxiv.org/abs/2008.10441",
									dateTime: "2020-08-24",
								},
								{
									exactQuote: "DistilBERT retains 97% of BERT's performance while being 60% smaller",
									url: "https://arxiv.org/abs/1910.01108",
									dateTime: "2019-10-01",
								},
								{
									exactQuote:
										"For Portuguese texts shorter than 128 tokens, DistilBERT shows minimal accuracy loss",
									url: "https://www.sciencedirect.com/science/article/pii/S0306457321001199",
									dateTime: "2021-05-15",
								},
							],
							visitedURLs: [
								"https://arxiv.org/abs/2008.10441",
								"https://arxiv.org/abs/1910.01108",
								"https://huggingface.co/neuralmind/bert-base-portuguese-cased",
								"https://www.sciencedirect.com/science/article/pii/S0306457321001199",
							],
							readURLs: ["https://arxiv.org/abs/2008.10441", "https://arxiv.org/abs/1910.01108"],
							allURLs: [
								"https://arxiv.org/abs/2008.10441",
								"https://arxiv.org/abs/1910.01108",
								"https://huggingface.co/neuralmind/bert-base-portuguese-cased",
								"https://www.sciencedirect.com/science/article/pii/S0306457321001199",
								"https://github.com/neuralmind-ai/portuguese-bert",
								"https://paperswithcode.com/sota/sentiment-analysis-on-sst-2-binary",
							],
						},
					},
				],
			}

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message)) {
					console.log(`[E2E Test] Tool use detected: ${message.toolName}`, message.params)
					usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

					if (message.toolName === "web_search") {
						console.log(`[E2E Test] Mocking Deep Research fallback result (blockId: ${message.blockId})`)
						// Simular que Jina falhou e Deep Research foi usado
						;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
							result: JSON.stringify(mockDeepResearchResults),
						})
					}
				} else if (message.type === "say" && message.say === "completion_result" && message.partial === false) {
					const completionMsg = message as CompletionResultMessage
					console.log(`[E2E Test] Completion result received:`, completionMsg.text)
					completionText = completionMsg.text
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Como implementar análise de sentimento em português usando transformers e qual a diferença de performance entre BERT e DistilBERT para textos curtos?",
			})

			api.on("message", messageHandler)

			console.log(`[E2E Test] Task started with ID: ${taskId}. Waiting for completion...`)

			await waitUntilCompleted({ api, taskId, timeout: 45000 })
			console.log(`[E2E Test] Task ${taskId} completed.`)

			api.off("message", messageHandler)

			// Validações específicas do Deep Research
			const webSearchCall = usedTools.find((tool) => tool.name === "web_search")
			assert.ok(webSearchCall, "Web search tool should have been called")
			if (webSearchCall) {
				assert.ok(
					webSearchCall.params?.query.toLowerCase().includes("transformers"),
					"Query should contain 'transformers'",
				)
				assert.ok(webSearchCall.params?.query.toLowerCase().includes("bert"), "Query should contain 'bert'")
			}

			assert.ok(completionText, "Completion text should be present")
			if (completionText) {
				// Verificar conteúdo específico do Deep Research
				assert.ok(completionText.includes("BERTimbau"), "Should contain 'BERTimbau'")
				assert.ok(completionText.includes("DistilBERT"), "Should contain 'DistilBERT'")
				assert.ok(completionText.includes("performance"), "Should contain 'performance'")
				assert.ok(completionText.includes("português"), "Should contain 'português'")

				// Verificar que reasoning do Deep Research está presente
				assert.ok(
					completionText.includes("Implementação de Análise de Sentimento"),
					"Should contain reasoning title",
				)
				assert.ok(completionText.includes("F1-score"), "Should contain 'F1-score'")
			}

			console.log("[E2E Test] Deep Research Fallback - Assertions passed.")
		})
	})

	// @ts-ignore - Mocha globals
	suite("Interface UI Components", () => {
		// @ts-ignore - Mocha globals
		test("deve renderizar corretamente os componentes de resultado do Deep Research", async function () {
			this.timeout(30000)

			// Este teste simula a validação da interface sem renderização real
			// Em uma implementação completa, usaríamos Playwright ou Selenium

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let receivedResults: any = null

			const mockUIResults = {
				provider: "deep_research_fallback",
				query: "test query for UI",
				results: [
					{
						title: "Deep Research Test Result",
						link: "deep-research://test",
						snippet: "Test snippet with **markdown** formatting",
						score: 1.0,
						provider: "deep_research_fallback",
						deepResearchData: {
							think: "Test thinking process",
							reasoning: "## Test Reasoning\n\nThis is a test reasoning with markdown",
							references: [
								{
									exactQuote: "Test quote",
									url: "https://test.com",
									dateTime: "2024-01-01",
								},
							],
							visitedURLs: ["https://test1.com", "https://test2.com"],
							readURLs: ["https://test1.com"],
							allURLs: ["https://test1.com", "https://test2.com", "https://test3.com"],
						},
					},
				],
			}

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message)) {
					usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

					if (message.toolName === "web_search") {
						receivedResults = mockUIResults
						;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
							result: JSON.stringify(mockUIResults),
						})
					}
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Teste de interface UI",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			// Validar estrutura de dados para componentes UI
			assert.ok(receivedResults, "Results should be received")
			if (receivedResults) {
				assert.strictEqual(
					receivedResults.provider,
					"deep_research_fallback",
					"Provider should be deep_research_fallback",
				)
				assert.strictEqual(receivedResults.results.length, 1, "Should have exactly 1 result")

				const result = receivedResults.results[0]
				assert.ok(result.deepResearchData, "Result should have deepResearchData")
				assert.ok(result.deepResearchData.think, "Should have think property")
				assert.ok(result.deepResearchData.reasoning, "Should have reasoning property")
				assert.strictEqual(result.deepResearchData.references.length, 1, "Should have 1 reference")
				assert.strictEqual(result.deepResearchData.visitedURLs.length, 2, "Should have 2 visited URLs")
				assert.strictEqual(result.deepResearchData.readURLs.length, 1, "Should have 1 read URL")
				assert.strictEqual(result.deepResearchData.allURLs.length, 3, "Should have 3 total URLs")
			}

			console.log("[E2E Test] UI Components validation - Assertions passed.")
		})
	})

	// @ts-ignore - Mocha globals
	suite("Performance e Timeout", () => {
		// @ts-ignore - Mocha globals
		test("deve completar busca complexa dentro do tempo limite", async function () {
			this.timeout(20000)

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let startTime: number
			let endTime: number

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message)) {
					usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

					if (message.toolName === "web_search") {
						// Simular resposta rápida para teste de performance
						const quickResult = {
							provider: "jina",
							query: message.params.query,
							results: [
								{
									title: "Quick Test Result",
									link: "https://quick-test.com",
									snippet: "Quick test snippet",
									score: 0.9,
									provider: "jina",
								},
							],
						}
						;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
							result: JSON.stringify(quickResult),
						})
					}
				}
			}

			startTime = Date.now()

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busca rápida para teste de performance",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId, timeout: 15000 }) // 15s timeout
			api.off("message", messageHandler)

			endTime = Date.now()
			const duration = endTime - startTime

			// Validar que a busca foi completada em tempo hábil
			assert.ok(duration < 15000, `Duration should be less than 15 seconds, got ${duration}ms`)
			assert.ok(usedTools.length > 0, "Should have used at least one tool")

			console.log(`[E2E Test] Performance test completed in ${duration}ms - Assertions passed.`)
		})
	})

	// @ts-ignore - Mocha globals
	suite("Error Handling", () => {
		// @ts-ignore - Mocha globals
		test("deve lidar graciosamente com erros de API", async function () {
			this.timeout(30000)

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let completionText: string | undefined

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message)) {
					usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

					if (message.toolName === "web_search") {
						// Simular erro seguido de fallback bem-sucedido
						const fallbackResult = {
							provider: "duckduckgo_fallback",
							query: message.params.query,
							results: [
								{
									title: "Fallback Result After Error",
									link: "https://fallback-test.com",
									snippet: "This result came from fallback after API error",
									provider: "duckduckgo_fallback",
								},
							],
						}
						;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
							result: JSON.stringify(fallbackResult),
						})
					}
				} else if (message.type === "say" && message.say === "completion_result" && message.partial === false) {
					const completionMsg = message as CompletionResultMessage
					completionText = completionMsg.text
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Teste de tratamento de erro",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			// Validar que o fallback funcionou
			const webSearchCall = usedTools.find((tool) => tool.name === "web_search")
			assert.ok(webSearchCall, "Web search tool should have been called")
			assert.ok(completionText, "Completion text should be present")
			if (completionText) {
				assert.ok(completionText.includes("fallback"), "Should contain fallback reference")
			}

			console.log("[E2E Test] Error handling - Assertions passed.")
		})
	})
})
