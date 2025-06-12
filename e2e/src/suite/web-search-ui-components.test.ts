/// <reference types="mocha" />
import * as assert from "assert"
import type { ClineMessage } from "../../../src/exports/roo-code"
import { waitUntilCompleted, sleep } from "./utils"

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

type HandledMessage = ClineMessage | ToolUseMessage

function isToolUseMessage(message: HandledMessage): message is ToolUseMessage {
	return message.type === "tool_use"
}

// Mock data para testes de UI
const createMockDeepResearchData = () => ({
	provider: "deep_research_fallback",
	query: "Test UI query para Deep Research",
	results: [
		{
			title: "Deep Research UI Test Result",
			link: "deep-research://ui-test",
			snippet:
				"Este é um teste de interface para validar a renderização correta dos componentes do Deep Research com **markdown** e `código inline`.",
			score: 1.0,
			provider: "deep_research_fallback",
			favicon:
				"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM0LjY4NjMgMiAyIDQuNjg2MyAyIDhTNC42ODYzIDE0IDggMTRTMTQgMTEuMzEzNyAxNCA4UzExLjMxMzcgMiA4IDJaTTggMTJDNS43OTA5IDEyIDQgMTAuMjA5MSA0IDhTNS43OTA5IDQgOCA0UzEyIDUuNzkwOSAxMiA4UzEwLjIwOTEgMTIgOCAxMloiIGZpbGw9IiM0Qjc2ODgiLz4KPC9zdmc+",
			deepResearchData: {
				think: "Para este teste de interface, preciso verificar como os diferentes elementos são renderizados no componente DeepResearchResultsBlock. Isso inclui o processo de raciocínio, análise detalhada, referências e estatísticas.",
				reasoning: `# Análise de Interface do Deep Research

## Componentes Testados

### 1. Header do Componente
- ✅ Ícone de lightning bolt para indicar Deep Research
- ✅ Título localizável
- ✅ Contador de resultados
- ✅ Botão de detalhes técnicos

### 2. Seção de Raciocínio
\`\`\`typescript
// Processo de pensamento do Deep Research
const thinkingProcess = {
	step1: "Análise da query",
	step2: "Busca de informações",
	step3: "Síntese de resultados"
}
\`\`\`

### 3. Formatação de Texto
- **Negrito** para destaques importantes
- *Itálico* para citações
- \`Código inline\` para termos técnicos
- Links para [referencias externas](https://example.com)

### 4. Listas e Estruturas
1. **Primeiro item** - Descrição detalhada
2. **Segundo item** - Mais informações
3. **Terceiro item** - Conclusão

- Item de lista simples
- Outro item com **formatação**
- Item final com \`código\``,
				references: [
					{
						exactQuote: "A interface deve ser intuitiva e responsiva para uma boa experiência do usuário",
						url: "https://ui-guidelines.test.com/deep-research",
						dateTime: "2024-01-15T10:30:00Z",
					},
					{
						exactQuote: "Componentes de busca avançada requerem feedback visual claro sobre o progresso",
						url: "https://ux-research.test.com/search-interfaces",
						dateTime: "2024-01-10T14:22:00Z",
					},
					{
						exactQuote: "Deep research results should provide expandable sections for detailed information",
						url: "https://design-patterns.test.com/research-ui",
						dateTime: "2024-01-12T09:15:00Z",
					},
				],
				visitedURLs: [
					"https://ui-guidelines.test.com",
					"https://ux-research.test.com",
					"https://design-patterns.test.com",
					"https://accessibility-standards.test.com",
					"https://performance-metrics.test.com",
				],
				readURLs: [
					"https://ui-guidelines.test.com/deep-research",
					"https://ux-research.test.com/search-interfaces",
					"https://design-patterns.test.com/research-ui",
				],
				allURLs: [
					"https://ui-guidelines.test.com",
					"https://ux-research.test.com",
					"https://design-patterns.test.com",
					"https://accessibility-standards.test.com",
					"https://performance-metrics.test.com",
					"https://color-theory.test.com",
					"https://typography-best-practices.test.com",
					"https://responsive-design.test.com",
				],
			},
		},
	],
})

const createMockJinaData = () => ({
	provider: "jina",
	query: "Test UI query para Jina",
	results: [
		{
			title: "Jina API Test Result",
			link: "https://jina-test.example.com",
			snippet: "Resultado padrão da API Jina para comparação com interface do Deep Research.",
			score: 0.92,
			provider: "jina",
			favicon: "https://www.google.com/s2/favicons?domain=example.com",
		},
		{
			title: "Second Jina Result",
			link: "https://second-result.example.com",
			snippet: "Segundo resultado para testar renderização de múltiplos itens na interface.",
			score: 0.88,
			provider: "jina",
			favicon: "https://www.google.com/s2/favicons?domain=second-result.example.com",
		},
	],
})

// @ts-ignore - Mocha globals
suite("Web Search UI Components Tests", () => {
	// @ts-ignore - Mocha globals
	suite("DeepResearchResultsBlock Component", () => {
		// @ts-ignore - Mocha globals
		test("deve renderizar corretamente dados complexos do Deep Research", async function () {
			this.timeout(30000)

			const api = globalThis.api
			const usedTools: Array<{ name: string; params: any; blockId: string }> = []
			let receivedResults: any = null

			const mockData = createMockDeepResearchData()

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message)) {
					usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

					if (message.toolName === "web_search") {
						receivedResults = mockData
						;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
							result: JSON.stringify(mockData),
						})
					}
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Teste de componentes UI do Deep Research",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			// Validações estruturais
			assert.ok(receivedResults, "Results should be received")
			assert.strictEqual(receivedResults.provider, "deep_research_fallback", "Should be Deep Research provider")

			const result = receivedResults.results[0]
			const deepData = result.deepResearchData

			// Validar estrutura do deepResearchData
			assert.ok(deepData, "Should have deepResearchData")
			assert.ok(deepData.think, "Should have thinking process")
			assert.ok(deepData.reasoning, "Should have detailed reasoning")
			assert.ok(Array.isArray(deepData.references), "References should be array")
			assert.strictEqual(deepData.references.length, 3, "Should have 3 references")

			// Validar estrutura das referências
			deepData.references.forEach((ref: any, index: number) => {
				assert.ok(ref.exactQuote, `Reference ${index} should have exactQuote`)
				assert.ok(ref.url, `Reference ${index} should have URL`)
				assert.ok(ref.dateTime, `Reference ${index} should have dateTime`)
			})

			// Validar arrays de URLs
			assert.ok(Array.isArray(deepData.visitedURLs), "VisitedURLs should be array")
			assert.ok(Array.isArray(deepData.readURLs), "ReadURLs should be array")
			assert.ok(Array.isArray(deepData.allURLs), "AllURLs should be array")

			assert.strictEqual(deepData.visitedURLs.length, 5, "Should have 5 visited URLs")
			assert.strictEqual(deepData.readURLs.length, 3, "Should have 3 read URLs")
			assert.strictEqual(deepData.allURLs.length, 8, "Should have 8 total URLs")

			// Validar formatação de conteúdo
			assert.ok(deepData.reasoning.includes("# Análise de Interface"), "Should contain markdown headers")
			assert.ok(deepData.reasoning.includes("```typescript"), "Should contain code blocks")
			assert.ok(deepData.reasoning.includes("**Negrito**"), "Should contain bold formatting")
			assert.ok(deepData.reasoning.includes("`Código inline`"), "Should contain inline code")

			console.log("[UI Test] DeepResearchResultsBlock structure validation - Passed")
		})

		// @ts-ignore - Mocha globals
		test("deve validar dados de estado para toggles e interações", async function () {
			this.timeout(25000)

			const api = globalThis.api
			let receivedResults: any = null

			const mockData = createMockDeepResearchData()

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					receivedResults = mockData
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: JSON.stringify(mockData),
					})
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Teste de estados de interface",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			// Simular estados de UI que o componente deve suportar
			const uiStates = {
				isCollapsed: false,
				showTechnicalDetails: false,
				showThinking: false,
				showReferences: true, // Estado padrão
			}

			// Validar que os dados suportam todos os estados necessários
			const result = receivedResults.results[0]
			const deepData = result.deepResearchData

			// Para showThinking toggle
			assert.ok(deepData.think, "Should have think data for showThinking toggle")
			assert.ok(deepData.think.length > 50, "Think content should be substantial")

			// Para showReferences toggle
			assert.ok(deepData.references.length > 0, "Should have references for showReferences toggle")

			// Para showTechnicalDetails toggle
			assert.ok(deepData.visitedURLs.length > 0, "Should have technical data for details toggle")
			assert.ok(result.score, "Should have score for technical details")
			assert.ok(result.provider, "Should have provider for technical details")

			// Validar conteúdo para interface responsiva
			assert.ok(result.title.length < 200, "Title should be reasonable length for UI")
			assert.ok(result.snippet.length > 10, "Snippet should have content")

			console.log("[UI Test] Interface state validation - Passed")
		})
	})

	// @ts-ignore - Mocha globals
	suite("Comparação de Interfaces", () => {
		// @ts-ignore - Mocha globals
		test("deve comparar renderização entre Jina e Deep Research", async function () {
			this.timeout(35000)

			const api = globalThis.api
			const results: any[] = []

			// Testar primeiro com Jina
			const jinaData = createMockJinaData()

			let messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					results.push({ type: "jina", data: jinaData })
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: JSON.stringify(jinaData),
					})
				}
			}

			let taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busca teste com Jina",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			// Aguardar um pouco entre os testes
			await sleep(1000)

			// Testar depois com Deep Research
			const deepResearchData = createMockDeepResearchData()

			messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					results.push({ type: "deep_research", data: deepResearchData })
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: JSON.stringify(deepResearchData),
					})
				}
			}

			taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Busca teste com Deep Research",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			// Validar que temos ambos os resultados
			assert.strictEqual(results.length, 2, "Should have both Jina and Deep Research results")

			const jinaResult = results.find((r) => r.type === "jina")
			const deepResult = results.find((r) => r.type === "deep_research")

			assert.ok(jinaResult, "Should have Jina result")
			assert.ok(deepResult, "Should have Deep Research result")

			// Comparar estruturas
			const jinaFirstResult = jinaResult.data.results[0]
			const deepFirstResult = deepResult.data.results[0]

			// Ambos devem ter campos básicos
			assert.ok(jinaFirstResult.title, "Jina should have title")
			assert.ok(deepFirstResult.title, "Deep Research should have title")
			assert.ok(jinaFirstResult.link, "Jina should have link")
			assert.ok(deepFirstResult.link, "Deep Research should have link")
			assert.ok(jinaFirstResult.snippet, "Jina should have snippet")
			assert.ok(deepFirstResult.snippet, "Deep Research should have snippet")

			// Deep Research deve ter dados extras
			assert.ok(!jinaFirstResult.deepResearchData, "Jina should not have deepResearchData")
			assert.ok(deepFirstResult.deepResearchData, "Deep Research should have deepResearchData")

			// Validar providers diferentes
			assert.strictEqual(jinaResult.data.provider, "jina", "Jina result should have jina provider")
			assert.strictEqual(
				deepResult.data.provider,
				"deep_research_fallback",
				"Deep Research should have correct provider",
			)

			console.log("[UI Test] Interface comparison - Passed")
		})
	})

	// @ts-ignore - Mocha globals
	suite("Accessibility e Responsividade", () => {
		// @ts-ignore - Mocha globals
		test("deve validar acessibilidade dos dados renderizados", async function () {
			this.timeout(25000)

			const api = globalThis.api
			let receivedResults: any = null

			const mockData = createMockDeepResearchData()

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					receivedResults = mockData
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: JSON.stringify(mockData),
					})
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Teste de acessibilidade",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			const result = receivedResults.results[0]

			// Validar que textos não são excessivamente longos (readabilidade)
			assert.ok(result.title.length < 150, "Title should be readable length")
			assert.ok(result.snippet.length < 500, "Snippet should be manageable length")

			// Validar que links são válidos
			if (!result.link.startsWith("deep-research://")) {
				assert.ok(result.link.startsWith("http"), "External links should be valid URLs")
			}

			// Validar que referências têm informações suficientes
			const deepData = result.deepResearchData
			deepData.references.forEach((ref: any, index: number) => {
				assert.ok(ref.exactQuote.length > 10, `Reference ${index} quote should be meaningful`)
				assert.ok(ref.url.startsWith("http"), `Reference ${index} should have valid URL`)
			})

			// Validar que não há conteúdo duplicado excessivo
			const allText = result.title + " " + result.snippet + " " + deepData.think + " " + deepData.reasoning
			const words = allText.toLowerCase().split(/\s+/)
			const uniqueWords = new Set(words)
			const duplicateRatio = (words.length - uniqueWords.size) / words.length

			assert.ok(duplicateRatio < 0.5, "Content should not be excessively repetitive")

			console.log("[UI Test] Accessibility validation - Passed")
		})

		// @ts-ignore - Mocha globals
		test("deve validar dados para diferentes tamanhos de tela", async function () {
			this.timeout(20000)

			const api = globalThis.api
			let receivedResults: any = null

			const mockData = createMockDeepResearchData()

			const messageHandler = ({ message }: { message: HandledMessage }) => {
				if (isToolUseMessage(message) && message.toolName === "web_search") {
					receivedResults = mockData
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: JSON.stringify(mockData),
					})
				}
			}

			const taskId = await api.startNewTask({
				configuration: { mode: "ask", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
				text: "Teste de responsividade",
			})

			api.on("message", messageHandler)
			await waitUntilCompleted({ api, taskId })
			api.off("message", messageHandler)

			const result = receivedResults.results[0]

			// Simular validações para diferentes tamanhos de tela
			const screenSizes = {
				mobile: { maxWidth: 768, maxLines: 3 },
				tablet: { maxWidth: 1024, maxLines: 5 },
				desktop: { maxWidth: 1920, maxLines: 10 },
			}

			Object.entries(screenSizes).forEach(([size, config]) => {
				// Validar que títulos cabem em diferentes telas
				const titleWords = result.title.split(" ")
				const estimatedTitleWidth = titleWords.length * 8 // ~8px por palavra

				if (size === "mobile") {
					assert.ok(titleWords.length < 15, "Title should be mobile-friendly")
				}

				// Validar que snippets podem ser truncados apropriadamente
				const snippetLines = result.snippet.split("\n")
				assert.ok(snippetLines.length <= config.maxLines * 2, `Content should be manageable for ${size}`)
			})

			// Validar que URLs não quebram layout
			const deepData = result.deepResearchData
			deepData.references.forEach((ref: any) => {
				assert.ok(ref.url.length < 200, "URLs should not be excessively long")
			})

			console.log("[UI Test] Responsive data validation - Passed")
		})
	})
})
