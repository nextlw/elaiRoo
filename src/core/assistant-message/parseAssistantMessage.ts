import { type ToolName, toolNames } from "@roo-code/types"

import { TextContent, ToolUse, ToolParamName, toolParamNames } from "../../shared/tools"

export type AssistantMessageContent = TextContent | ToolUse

export function parseAssistantMessage(assistantMessage: string): AssistantMessageContent[] {
	// Debug logging for web_search content
	if (assistantMessage.includes("web_search")) {
		console.log(`[DEBUG] =================== WEB_SEARCH PARSING DEBUG ===================`)
		console.log(`[DEBUG] Raw assistant message containing web_search:`)
		console.log(`"${assistantMessage}"`)
		console.log(`[DEBUG] Length: ${assistantMessage.length}`)
		console.log(`[DEBUG] Has '<query>': ${assistantMessage.includes("<query>")}`)
		console.log(`[DEBUG] Has '</query>': ${assistantMessage.includes("</query>")}`)
		console.log(`[DEBUG] Has '<web_search>': ${assistantMessage.includes("<web_search>")}`)
		console.log(`[DEBUG] Has '</web_search>': ${assistantMessage.includes("</web_search>")}`)

		// Show all XML-like structures
		const xmlTags = assistantMessage.match(/<[^>]+>/g) || []
		console.log(`[DEBUG] All XML tags found: [${xmlTags.join(", ")}]`)
		console.log(`[DEBUG] ================================================================`)

		// Store the message globally for fallback extraction
		;(global as any).currentParsingMessage = assistantMessage
	}

	let contentBlocks: AssistantMessageContent[] = []
	let currentTextContent: TextContent | undefined = undefined
	let currentTextContentStartIndex = 0
	let currentToolUse: ToolUse | undefined = undefined
	let currentToolUseStartIndex = 0
	let currentParamName: ToolParamName | undefined = undefined
	let currentParamValueStartIndex = 0
	let accumulator = ""

	for (let i = 0; i < assistantMessage.length; i++) {
		const char = assistantMessage[i]
		accumulator += char

		// There should not be a param without a tool use.
		if (currentToolUse && currentParamName) {
			const currentParamValue = accumulator.slice(currentParamValueStartIndex)
			const paramClosingTag = `</${currentParamName}>`
			if (currentParamValue.endsWith(paramClosingTag)) {
				// End of param value.
				const paramValue = currentParamValue.slice(0, -paramClosingTag.length).trim()
				currentToolUse.params[currentParamName] = paramValue

				// Debug logging for web_search parameters
				if (currentToolUse.name === "web_search") {
					console.log(`[DEBUG] web_search param captured: ${currentParamName} = "${paramValue}"`)
					console.log(`[DEBUG] Current tool params so far:`, JSON.stringify(currentToolUse.params, null, 2))
				}

				currentParamName = undefined
				continue
			} else {
				// Partial param value is accumulating.
				continue
			}
		}

		// No currentParamName.

		if (currentToolUse) {
			const currentToolValue = accumulator.slice(currentToolUseStartIndex)
			const toolUseClosingTag = `</${currentToolUse.name}>`
			if (currentToolValue.endsWith(toolUseClosingTag)) {
				// End of a tool use.
				currentToolUse.partial = false

				// Debug logging for web_search completion
				if (currentToolUse.name === "web_search") {
					console.log(
						`[DEBUG] web_search completed with params:`,
						JSON.stringify(currentToolUse.params, null, 2),
					)
				}

				contentBlocks.push(currentToolUse)
				currentToolUse = undefined
				continue
			} else {
				const possibleParamOpeningTags = toolParamNames.map((name) => `<${name}>`)
				for (const paramOpeningTag of possibleParamOpeningTags) {
					if (accumulator.endsWith(paramOpeningTag)) {
						// Start of a new parameter.
						currentParamName = paramOpeningTag.slice(1, -1) as ToolParamName
						currentParamValueStartIndex = accumulator.length
						break
					}
				}

				// There's no current param, and not starting a new param.

				// Special case for write_to_file where file contents could
				// contain the closing tag, in which case the param would have
				// closed and we end up with the rest of the file contents here.
				// To work around this, we get the string between the starting
				// content tag and the LAST content tag.
				const contentParamName: ToolParamName = "content"

				if (currentToolUse.name === "write_to_file" && accumulator.endsWith(`</${contentParamName}>`)) {
					const toolContent = accumulator.slice(currentToolUseStartIndex)
					const contentStartTag = `<${contentParamName}>`
					const contentEndTag = `</${contentParamName}>`
					const contentStartIndex = toolContent.indexOf(contentStartTag) + contentStartTag.length
					const contentEndIndex = toolContent.lastIndexOf(contentEndTag)

					if (contentStartIndex !== -1 && contentEndIndex !== -1 && contentEndIndex > contentStartIndex) {
						currentToolUse.params[contentParamName] = toolContent
							.slice(contentStartIndex, contentEndIndex)
							.trim()
					}
				}

				// Partial tool value is accumulating.
				continue
			}
		}

		// No currentToolUse.

		let didStartToolUse = false
		const possibleToolUseOpeningTags = toolNames.map((name) => `<${name}>`)

		for (const toolUseOpeningTag of possibleToolUseOpeningTags) {
			if (accumulator.endsWith(toolUseOpeningTag)) {
				// Start of a new tool use.
				const toolName = toolUseOpeningTag.slice(1, -1) as ToolName
				currentToolUse = {
					type: "tool_use",
					name: toolName,
					params: {},
					partial: true,
				}

				// Debug logging for web_search specifically
				if (toolName === "web_search") {
					console.log(`[DEBUG] Starting web_search tool parsing`)
					console.log(`[DEBUG] Current accumulator content: "${accumulator}"`)
					console.log(`[DEBUG] Tool opening tag: "${toolUseOpeningTag}"`)
				}

				currentToolUseStartIndex = accumulator.length

				// This also indicates the end of the current text content.
				if (currentTextContent) {
					currentTextContent.partial = false

					// Remove the partially accumulated tool use tag from the
					// end of text (<tool).
					currentTextContent.content = currentTextContent.content
						.slice(0, -toolUseOpeningTag.slice(0, -1).length)
						.trim()

					contentBlocks.push(currentTextContent)
					currentTextContent = undefined
				}

				didStartToolUse = true
				break
			}
		}

		if (!didStartToolUse) {
			// No tool use, so it must be text either at the beginning or
			// between tools.
			if (currentTextContent === undefined) {
				currentTextContentStartIndex = i
			}

			currentTextContent = {
				type: "text",
				content: accumulator.slice(currentTextContentStartIndex).trim(),
				partial: true,
			}
		}
	}

	if (currentToolUse) {
		// Stream did not complete tool call, add it as partial.
		if (currentParamName) {
			// Tool call has a parameter that was not completed.
			currentToolUse.params[currentParamName] = accumulator.slice(currentParamValueStartIndex).trim()
		}

		contentBlocks.push(currentToolUse)
	}

	// NOTE: It doesn't matter if check for currentToolUse or
	// currentTextContent, only one of them will be defined since only one can
	// be partial at a time.
	if (currentTextContent) {
		// Stream did not complete text content, add it as partial.
		contentBlocks.push(currentTextContent)
	}

	return contentBlocks
}
