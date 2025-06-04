// Tipos necessários para os testes e2e
interface RooCodeAPI {
	on(event: string, callback: Function): void
	off(event: string, callback: Function): void
	startNewTask(options: any): Promise<string>
	postMessage?(message: any): Promise<void>
}

type WaitForOptions = {
	timeout?: number
	interval?: number
}

export const waitFor = (
	condition: (() => Promise<boolean>) | (() => boolean),
	{ timeout = 30_000, interval = 250 }: WaitForOptions = {},
) => {
	let timeoutId: NodeJS.Timeout | undefined = undefined

	return Promise.race([
		new Promise<void>((resolve) => {
			const check = async () => {
				const result = condition()
				const isSatisfied = result instanceof Promise ? await result : result

				if (isSatisfied) {
					if (timeoutId) {
						clearTimeout(timeoutId)
						timeoutId = undefined
					}

					resolve()
				} else {
					setTimeout(check, interval)
				}
			}

			check()
		}),
		new Promise((_, reject) => {
			timeoutId = setTimeout(() => {
				reject(new Error(`Timeout after ${Math.floor(timeout / 1000)}s`))
			}, timeout)
		}),
	])
}

type WaitUntilAbortedOptions = WaitForOptions & {
	api: RooCodeAPI
	taskId: string
}

export const waitUntilAborted = async ({ api, taskId, ...options }: WaitUntilAbortedOptions) => {
	const set = new Set<string>()
	api.on("taskAborted", (taskId) => set.add(taskId))
	await waitFor(() => set.has(taskId), options)
}

type WaitUntilCompletedOptions = WaitForOptions & {
	api: RooCodeAPI
	taskId: string
}

export const waitUntilCompleted = async ({ api, taskId, ...options }: WaitUntilCompletedOptions) => {
	const set = new Set<string>()
	api.on("taskCompleted", (taskId) => set.add(taskId))
	await waitFor(() => set.has(taskId), options)
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// WhatsApp integration utilities
export const waitForMcpToolCall = async (
	api: RooCodeAPI,
	serverName: string,
	toolName: string,
	timeout: number = 15000,
) => {
	const toolCalls: Array<{ serverName: string; toolName: string; arguments: any }> = []

	const messageHandler = ({ message }: { message: any }) => {
		if (
			message.type === "whatsappToolResponse" &&
			message.serverName === serverName &&
			message.toolName === toolName
		) {
			toolCalls.push({
				serverName: message.serverName,
				toolName: message.toolName,
				arguments: message.arguments || {},
			})
		}
	}

	api.on("message", messageHandler)

	try {
		await waitFor(() => toolCalls.length > 0, { timeout })
		return toolCalls[0]
	} finally {
		api.off("message", messageHandler)
	}
}

export const simulateWhatsAppMessage = async (api: RooCodeAPI, message: string, senderPhone: string) => {
	// Simula a chegada de uma mensagem do WhatsApp
	return await (api as any).postMessage({
		type: "whatsappTaskFromEvent",
		text: message,
		sender_phone_number: senderPhone,
		chat_jid: `${senderPhone}@s.whatsapp.net`,
		original_message: message,
		message_timestamp: new Date().toISOString(),
		source: "whatsapp",
	})
}
