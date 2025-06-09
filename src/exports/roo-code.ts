export interface ClineMessage {
	type: string
	say?: string
	text?: string
	partial?: boolean
	id?: string
	timestamp?: number
}

export interface ToolUseMessage extends ClineMessage {
	type: "tool_use"
	toolName: string
	params: any
	blockId: string
	taskId: string
}

export interface CompletionResultMessage extends ClineMessage {
	type: "say"
	say: "completion_result"
	text: string
	partial: false
}

export type HandledMessage = ClineMessage | ToolUseMessage
