import * as assert from "assert"
import type { ClineMessage as OriginalClineMessage } from "../../../src/exports/roo-code"
import { waitUntilCompleted } from "./utils"

// Usamos Omit para pegar todas as propriedades de OriginalClineMessage exceto 'say',
// e então sobrescrevemos 'say' com o tipo literal 'tool_use' e adicionamos o payload.
// No entanto, a mensagem de erro original indica que 'toolName', 'params', etc., não estão em OriginalClineMessage.
// Portanto, uma abordagem mais simples é definir ToolUseMessage como uma combinação de propriedades.
interface ToolUseMessage {
	type: "tool_use"
	toolName: string
	params: any
	blockId: string
	taskId: string // taskId da tarefa que originou o uso da ferramenta
	// Outras propriedades comuns de OriginalClineMessage podem ser adicionadas se necessário,
	// como 'id', 'timestamp', etc. Para este teste, focamos no essencial.
}

// Tipo união para as mensagens que o handler pode receber
type HandledMessage = OriginalClineMessage | ToolUseMessage

interface CompletionResultMessage extends OriginalClineMessage {
	type: "say"
	say: "completion_result"
	text: string
	partial: false
}

suite("Deep Research Task E2E", () => {
	test("deve realizar uma pesquisa profunda por um perfil no LinkedIn usando o modo deep-research e suas ferramentas", async function () {
		this.timeout(30000) // Aumentar timeout para testes e2e, pois envolvem mais passos

		const api = globalThis.api
		const usedTools: Array<{ name: string; params: any; blockId: string }> = []
		let completionText: string | undefined

		const mockLinkedInURL = "https://www.linkedin.com/in/william-duarte-fake-profile"
		const mockWebSearchResults = [
			{
				title: "William Duarte - Perfil Profissional | LinkedIn",
				link: mockLinkedInURL,
				snippet: "Veja o perfil de William Duarte no LinkedIn, a maior comunidade profissional do mundo.",
			},
		]

		const mockPageContent =
			"<h1>William Duarte</h1><section id='experience'><h2>Experiência</h2><p>Engenheiro de Software na Empresa X</p><p>Analista de Dados na Empresa Y</p></section><section id='education'><h2>Formação Acadêmica</h2><p>Bacharel em Ciência da Computação na Universidade Z</p></section>"

		const expectedExperience = ["Engenheiro de Software na Empresa X", "Analista de Dados na Empresa Y"]
		const expectedEducation = ["Bacharel em Ciência da Computação na Universidade Z"]

		const messageHandler = ({ message }: { message: HandledMessage }) => {
			// console.log("[E2E Test] Received message:", JSON.stringify(message, null, 2));

			// Guarda de tipo para ToolUseMessage
			if (message.type === "tool_use") {
				// Com HandledMessage, TypeScript infere 'message' como ToolUseMessage aqui.
				// O cast 'as unknown as ToolUseMessage' não é mais necessário.
				// Acessamos os campos diretamente de 'message'.
				console.log(`[E2E Test] Tool use detected: ${message.toolName}`, message.params)
				// Assumindo que o taskId da mensagem da ferramenta é o mesmo da tarefa principal
				// Se a mensagem 'tool_use' não tiver taskId, usamos o taskId da tarefa.
				usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

				if (message.toolName === "web_search") {
					console.log(`[E2E Test] Mocking result for web_search (blockId: ${message.blockId})`)
					// Usando (api as any) para contornar o erro de TS sobre pushToolResult
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: JSON.stringify(mockWebSearchResults),
					})
				} else if (message.toolName === "extract_page_content") {
					console.log(`[E2E Test] Mocking result for extract_page_content (blockId: ${message.blockId})`)
					;(api as any).pushToolResult(message.taskId || taskId, message.blockId, {
						result: mockPageContent,
					})
				}
			} else if (message.type === "say" && message.say === "completion_result" && message.partial === false) {
				// Aqui, 'message' é inferido como OriginalClineMessage.
				const completionMsg = message as CompletionResultMessage
				console.log(`[E2E Test] Completion result received:`, completionMsg.text)
				completionText = completionMsg.text
			}
		}

		const taskId = await api.startNewTask({
			// Definir taskId aqui para estar no escopo do messageHandler
			configuration: { mode: "deep-research", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
			text: "Encontre o perfil no LinkedIn de William Duarte e extraia suas informações de experiência profissional e formação acadêmica.",
		})

		api.on("message", messageHandler)

		const taskPrompt =
			"Encontre o perfil no LinkedIn de William Duarte e extraia suas informações de experiência profissional e formação acadêmica."
		console.log(`[E2E Test] Starting new task with prompt: "${taskPrompt}"`)
		// const taskId = await api.startNewTask({ // Movido para cima
		// 	configuration: { mode: "deep-research", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
		// 	text: taskPrompt,
		// });

		console.log(`[E2E Test] Task started with ID: ${taskId}. Waiting for completion...`)

		await waitUntilCompleted({ api, taskId })
		console.log(`[E2E Test] Task ${taskId} completed.`)

		api.off("message", messageHandler) // Limpar o handler para não interferir em outros testes

		// Asserções
		console.log("[E2E Test] Performing assertions...")

		const webSearchCall = usedTools.find((tool) => tool.name === "web_search")
		assert.ok(webSearchCall, "A ferramenta 'web_search' deveria ter sido chamada.")
		if (webSearchCall) {
			assert.ok(
				webSearchCall.params &&
					typeof webSearchCall.params.query === "string" &&
					webSearchCall.params.query.toLowerCase().includes("william duarte"),
				`A query da 'web_search' deveria incluir "william duarte". Query: ${webSearchCall.params?.query}`,
			)
			assert.ok(
				webSearchCall.params &&
					typeof webSearchCall.params.query === "string" &&
					webSearchCall.params.query.toLowerCase().includes("linkedin"),
				`A query da 'web_search' deveria incluir "linkedin". Query: ${webSearchCall.params?.query}`,
			)
		}

		const extractPageContentCall = usedTools.find((tool) => tool.name === "extract_page_content")
		assert.ok(extractPageContentCall, "A ferramenta 'extract_page_content' deveria ter sido chamada.")
		if (extractPageContentCall) {
			assert.strictEqual(
				extractPageContentCall.params?.url,
				mockLinkedInURL,
				`A 'extract_page_content' deveria ser chamada com a URL: ${mockLinkedInURL}. Chamada com: ${extractPageContentCall.params?.url}`,
			)
		}

		assert.ok(completionText, "O resultado da conclusão (completion_result) não deveria estar vazio.")
		// As verificações .includes() são movidas para dentro deste bloco para garantir que completionText é definido.
		if (completionText) {
			console.log("[E2E Test] Verifying content of completion_result...")
			expectedExperience.forEach((exp) => {
				assert.ok(
					completionText!.includes(exp), // Usando ! pois já verificamos que completionText não é undefined
					`O resultado da conclusão deveria incluir a experiência: "${exp}". Resultado: ${completionText}`,
				)
			})
			expectedEducation.forEach((edu) => {
				assert.ok(
					completionText!.includes(edu), // Usando ! pois já verificamos que completionText não é undefined
					`O resultado da conclusão deveria incluir a formação: "${edu}". Resultado: ${completionText}`,
				)
			})
		}
		console.log("[E2E Test] Assertions passed.")
	})
})
