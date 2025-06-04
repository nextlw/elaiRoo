/// <reference types="mocha" />
import * as assert from "assert"
import type { ClineMessage } from "../../../src/exports/roo-code"
import { waitUntilCompleted } from "./utils"

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

describe("Deep Research Task E2E", () => {
	it("deve realizar uma pesquisa profunda por um perfil no LinkedIn usando o modo deep-research e suas ferramentas", async () => {
		jest.setTimeout(30000) // Aumentar timeout para testes e2e, pois envolvem mais passos

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
			if (isToolUseMessage(message)) {
				console.log(`[E2E Test] Tool use detected: ${message.toolName}`, message.params)
				usedTools.push({ name: message.toolName, params: message.params, blockId: message.blockId })

				if (message.toolName === "web_search") {
					console.log(`[E2E Test] Mocking result for web_search (blockId: ${message.blockId})`)
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
				const completionMsg = message as CompletionResultMessage
				console.log(`[E2E Test] Completion result received:`, completionMsg.text)
				completionText = completionMsg.text
			}
		}

		const taskId = await api.startNewTask({
			configuration: { mode: "deep-research", alwaysAllowModeSwitch: true, autoApprovalEnabled: true },
			text: "Encontre o perfil no LinkedIn de William Duarte e extraia suas informações de experiência profissional e formação acadêmica.",
		})

		api.on("message", messageHandler)

		const taskPrompt =
			"Encontre o perfil no LinkedIn de William Duarte e extraia suas informações de experiência profissional e formação acadêmica."
		console.log(`[E2E Test] Starting new task with prompt: "${taskPrompt}"`)

		console.log(`[E2E Test] Task started with ID: ${taskId}. Waiting for completion...`)

		await waitUntilCompleted({ api, taskId })
		console.log(`[E2E Test] Task ${taskId} completed.`)

		api.off("message", messageHandler)

		console.log("[E2E Test] Performing assertions...")

		const webSearchCall = usedTools.find((tool) => tool.name === "web_search")
		expect(webSearchCall).toBeTruthy()
		if (webSearchCall) {
			expect(webSearchCall.params?.query.toLowerCase()).toContain("william duarte")
			expect(webSearchCall.params?.query.toLowerCase()).toContain("linkedin")
		}

		const extractPageContentCall = usedTools.find((tool) => tool.name === "extract_page_content")
		expect(extractPageContentCall).toBeTruthy()
		if (extractPageContentCall) {
			expect(extractPageContentCall.params?.url).toBe(mockLinkedInURL)
		}

		expect(completionText).toBeTruthy()
		if (completionText) {
			console.log("[E2E Test] Verifying content of completion_result...")
			expectedExperience.forEach((exp) => {
				expect(completionText).toContain(exp)
			})
			expectedEducation.forEach((edu) => {
				expect(completionText).toContain(edu)
			})
		}
		console.log("[E2E Test] Assertions passed.")
	})
})
