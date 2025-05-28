import { ToolUse, AskApproval, ToolResponse } from "../../shared/tools"
import { Task } from "../../core/task/Task"
import { extractPageContentParamsSchema, ExtractPageContentParams, ToolName } from "../../schemas/index_e"
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
		// log: Task['log'], // Task não possui a propriedade log diretamente
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
		// askApproval: AskApproval,
		// log: Task['log'],
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
				const markdownContent = await fetcher.urlToMarkdown(url)

				if (!markdownContent) {
					onResult({
						toolExecutionId: toolUseWithParams.toolExecutionId,
						result: `Não foi possível buscar conteúdo da URL: ${url}`,
						error: "fetch_error",
					})
					return
				}

				let contentToReturn: ToolResponse = markdownContent // Corrigido: usar markdownContent

				if (clean_html) {
					// TODO: A lógica de clean_html=false precisaria retornar o HTML bruto,
					// mas urlToMarkdown já processa para Markdown.
					// Se clean_html for false, idealmente buscaríamos o HTML bruto.
					// Por agora, urlToMarkdown sempre "limpa" para markdown.
					console.log(`[extract_page_content] Conteúdo extraído como Markdown. clean_html=${clean_html}`)
				} else {
					// Se clean_html for false, idealmente deveríamos buscar o HTML bruto.
					// Como urlToMarkdown já retorna markdown "limpo", vamos apenas logar.
					// Para uma implementação completa de clean_html=false, seria necessário
					// um método em UrlContentFetcher que retorne o HTML bruto.
					console.log(
						`[extract_page_content] clean_html é false, mas UrlContentFetcher.urlToMarkdown já retorna conteúdo processado (Markdown).`,
					)
				}
				contentToReturn = markdownContent

				onResult({
					toolExecutionId: toolUseWithParams.toolExecutionId,
					result: contentToReturn,
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
