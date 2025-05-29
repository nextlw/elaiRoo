import { ToolUse, AskApproval, ToolResponse } from "../../shared/tools"
import { Task } from "../../core/task/Task"
import { extractPageContentParamsSchema, ExtractPageContentParams, ToolName } from "../../schemas"
import { z } from "zod"

// Definindo uma interface local para a estrutura da ferramenta
interface IExtractPageContentTool {
	name: ToolName
	description: string
	create: (
		cline: Task,
		block: ToolUse, // block é do tipo ToolUse
		onResult: (result: { toolExecutionId: string; result: ToolResponse; error?: string }) => void,
		askApproval: AskApproval,
		log: Task["emit"], // Adicionando o parâmetro log
	) => ToolUse & { execute: () => Promise<void>; parameters: ExtractPageContentParams }
}

/**
 * Implements the 'extract_page_content' tool.
 * Fetches the content of a web page given a URL.
 * Can optionally attempt to clean the HTML to extract main content.
 */
export const extractPageContentTool: IExtractPageContentTool = {
	name: "extract_page_content",
	description: "Extracts the main content from a given URL. Can optionally clean HTML.",
	create: (
		cline: Task,
		block: ToolUse,
		onResult: (result: { toolExecutionId: string; result: ToolResponse; error?: string }) => void,
		askApproval: AskApproval,
	) => {
		// Os parâmetros são validados dentro da função execute
		const toolUseWithParams = block as ToolUse & { toolExecutionId: string; parameters: ExtractPageContentParams }

		const execute = async (): Promise<void> => {
			let params: ExtractPageContentParams
			try {
				// Validar e obter os parâmetros específicos da ferramenta
				params = extractPageContentParamsSchema.parse(toolUseWithParams.parameters)
			} catch (error) {
				console.error("Error parsing parameters for extract_page_content:", error)
				onResult({
					toolExecutionId: toolUseWithParams.toolExecutionId,
					result: `Erro ao validar os parâmetros da ferramenta: ${
						error instanceof z.ZodError
							? error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
							: String(error)
					}`,
					error: "parameter_validation_error",
				})
				return
			}

			const { url, clean_html = true } = params
			console.log(`[extract_page_content] Executando com url: ${url}, clean_html: ${clean_html}`)

			const fetcher = cline.urlContentFetcher
			try {
				// O browser precisa ser inicializado antes de usar urlToMarkdown
				await fetcher.launchBrowser()

				// Usando o novo método fetchContent que implementa o processo de validação
				const contentResult = await fetcher.fetchContent(url, clean_html)

				if (!contentResult || (!contentResult.html && !contentResult.markdown)) {
					onResult({
						toolExecutionId: toolUseWithParams.toolExecutionId,
						result: `Não foi possível buscar conteúdo da URL: ${url}`,
						error: "fetch_error",
					})
					return
				}

				let contentToReturn: ToolResponse

				if (clean_html) {
					// Se o usuário pediu para limpar o HTML
					if (contentResult.markdown && contentResult.cleaned) {
						// Temos um markdown validado e limpo
						contentToReturn = contentResult.markdown
						console.log(
							`[extract_page_content] Conteúdo extraído e convertido para Markdown com sucesso. A validação passou.`,
						)
					} else {
						// A limpeza foi solicitada, mas a validação falhou
						// Retornamos o HTML com aviso
						contentToReturn = contentResult.html
						console.log(
							`[extract_page_content] Aviso: A validação da conversão para Markdown falhou. Retornando HTML limpo.`,
						)
					}
				} else {
					// O usuário pediu explicitamente o HTML bruto
					contentToReturn = contentResult.html
					console.log(`[extract_page_content] Retornando HTML bruto conforme solicitado (clean_html=false).`)
				}

				onResult({
					toolExecutionId: toolUseWithParams.toolExecutionId,
					result: `@@EXACT_CONTENT_START@@\n${contentToReturn}\n@@EXACT_CONTENT_END@@`,
				})
			} catch (error: any) {
				console.error(`[extract_page_content] Erro durante a execução para a URL ${url}:`, error)
				onResult({
					toolExecutionId: toolUseWithParams.toolExecutionId,
					result: `Erro ao extrair conteúdo da URL ${url}: ${error.message || String(error)}`,
					error: "execution_error",
				})
			} finally {
				// Garante que o browser seja fechado independentemente de sucesso ou falha
				await fetcher.closeBrowser()
			}
		}

		return {
			...toolUseWithParams,
			execute,
			// parameters: toolUseWithParams.parameters, // Redundante, já está em toolUseWithParams
		}
	},
}
