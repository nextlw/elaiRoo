import { ToolUse, AskApproval, PushToolResult, HandleError, ToolResponse } from "../../shared/tools"
import { Task } from "../../core/task/Task"
import { ILogger as Logger } from "../../utils/logging/types"
import { processTextContentParamsSchema, ProcessTextContentParams } from "../../schemas/index_e"
import { fixMarkdown, removeDuplicateLines, summarize, extractKeywords } from "../../utils/textProcessingUtils"
import { Anthropic } from "@anthropic-ai/sdk" // Necessário para ToolResponse

/**
 * Ferramenta para processar conteúdo de texto com várias operações.
 */
export async function processTextContentTool(
	cline: Task,
	block: ToolUse,
	logger: Logger,
	askApproval: AskApproval,
	pushToolResult: PushToolResult,
	handleError: HandleError,
): Promise<void> {
	const toolName = block.name
	let params: ProcessTextContentParams

	try {
		params = processTextContentParamsSchema.parse(block.params)
	} catch (error) {
		const validationError = new Error(`Parâmetros inválidos para ${toolName}: ${(error as Error).message}`)
		logger.error(validationError.message)
		await handleError(`validação de parâmetros para ${toolName}`, validationError)
		return
	}

	const { text_content, operation, options } = params
	let processedTextContent: ToolResponse = ""

	logger.info(`Executando ${toolName} com operação: ${operation}`)

	try {
		let parsedOptions: any = options
		if (typeof options === "string" && options.trim() !== "") {
			try {
				parsedOptions = JSON.parse(options)
			} catch (e) {
				logger.warn(
					`Opções para ${toolName} (operação ${operation}) não puderam ser parseadas como JSON: "${options}". Usando como string.`,
				)
			}
		}

		switch (operation) {
			case "fixMarkdown":
				processedTextContent = fixMarkdown(text_content, parsedOptions)
				break
			case "removeDuplicateLines":
				processedTextContent = removeDuplicateLines(text_content, parsedOptions)
				break
			case "summarize":
				processedTextContent = summarize(text_content, parsedOptions)
				break
			case "extractKeywords":
				const keywordsArray = extractKeywords(text_content, parsedOptions)
				processedTextContent = keywordsArray.join(", ")
				break
			default:
				const unknownOpError = new Error(
					`Operação desconhecida para ${toolName}: ${operation}. Operações suportadas: fixMarkdown, removeDuplicateLines, summarize, extractKeywords.`,
				)
				logger.error(unknownOpError.message)
				await handleError(`operação desconhecida em ${toolName}`, unknownOpError)
				return
		}

		let outputStringForApproval: string
		if (Array.isArray(processedTextContent)) {
			const firstTextParam = processedTextContent.find((p) => p.type === "text") as
				| Anthropic.TextBlockParam
				| undefined
			outputStringForApproval = firstTextParam ? firstTextParam.text : JSON.stringify(processedTextContent)
		} else {
			outputStringForApproval = processedTextContent
		}

		if (outputStringForApproval.length > 2000) {
			const approvalMessage = `O resultado processado para ${toolName} (operação ${operation}) tem ${outputStringForApproval.length} caracteres. Deseja enviar este resultado?`
			const userApprovedResult = await askApproval("tool", approvalMessage)
			if (!userApprovedResult) {
				logger.info(
					`Envio do resultado de ${toolName} (operação ${operation}) cancelado pelo usuário devido ao tamanho.`,
				)
				pushToolResult(
					`Envio do resultado da operação "${operation}" cancelado pelo usuário devido ao tamanho.`,
				)
				return
			}
		}

		pushToolResult(processedTextContent)
	} catch (error) {
		const executionError = new Error(
			`Erro ao executar a operação "${operation}" em ${toolName}: ${(error as Error).message}`,
		)
		logger.error(executionError.message)
		await handleError(`execução da operação ${operation} em ${toolName}`, executionError)
	}
}
