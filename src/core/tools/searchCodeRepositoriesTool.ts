import { Task } from "../../core/task/Task"
import { ToolUse } from "../../shared/tools"
import { searchCodeRepositoriesParamsSchema, SearchCodeRepositoriesParams } from "../../schemas"
import { logger } from "../../utils/logging" // Corrected import and path
import { AskApproval } from "../../shared/tools"
import { PushToolResult } from "../../shared/tools" // Corrected path for pushToolResult and type PushToolResult to function pushToolResult
import { HandleError } from "../../shared/tools"

export async function searchCodeRepositoriesTool(
	cline: Task,
	block: ToolUse,
	askApproval: AskApproval,
	pushToolResult: PushToolResult,
	handleError: HandleError,
): Promise<void> {
	let params: SearchCodeRepositoriesParams
	try {
		params = searchCodeRepositoriesParamsSchema.parse(block.params)
	} catch (error) {
		logger.error("Error parsing params:", error)
		await handleError("Os parâmetros fornecidos para search_code_repositories são inválidos.", error)
		return
	}

	const { query, platform = "github", repository, organization, user, per_page = 30, page = 1 } = params

	if (platform.toLowerCase() !== "github") {
		await pushToolResult([
			{
				type: "text",
				text: `A plataforma '${platform}' ainda não é suportada. Atualmente, apenas 'github' é suportado.`,
			},
		])
		return
	}

	// Lógica para GitHub
	try {
		const apiUrl = new URL("https://api.github.com/search/code")
		const searchTerms: string[] = [query]

		if (repository) {
			searchTerms.push(`repo:${repository}`)
		}
		if (organization) {
			searchTerms.push(`org:${organization}`)
		}
		if (user) {
			searchTerms.push(`user:${user}`)
		}

		apiUrl.searchParams.append("q", searchTerms.join(" "))
		apiUrl.searchParams.append("per_page", per_page.toString())
		apiUrl.searchParams.append("page", page.toString())

		logger.warn(
			"Fazendo chamada para a API do GitHub sem token de autenticação. " +
				"Um token pode ser necessário para evitar limites de taxa e acessar repositórios privados. " +
				"Isso será configurável via ProviderSettings futuramente.",
		)

		const response = await fetch(apiUrl.toString(), {
			headers: {
				Accept: "application/vnd.github.v3+json",
			},
		})

		if (!response.ok) {
			const errorText = await response.text()
			logger.error(`Erro na API do GitHub: ${response.status} ${response.statusText}`, {
				error: new Error(errorText),
			})
			await handleError(
				`Erro ao buscar na API do GitHub: ${response.status} ${response.statusText}. Detalhes: ${errorText}`,
				new Error(errorText),
			)
			return
		}

		const data = await response.json()

		const results = data.items.map((item: any) => ({
			name: item.name,
			path: item.path,
			html_url: item.html_url,
			repository: item.repository.full_name,
		}))

		const summary = `Encontrados ${results.length} resultados (total: ${data.total_count}) para a busca no GitHub.`

		const wantsToProceed = await askApproval(
			"tool", // type: ClineAsk
			summary + "\nDeseja ver os resultados completos?", // partialMessage
		)

		if (wantsToProceed) {
			await pushToolResult([
				{
					type: "text",
					text: JSON.stringify(results, null, 2),
				},
			])
		} else {
			await pushToolResult([
				{
					type: "text",
					text: "Busca cancelada pelo usuário.",
				},
			])
		}
	} catch (error: any) {
		logger.error("Erro ao executar search_code_repositories:", error)
		await handleError("Ocorreu um erro inesperado ao tentar pesquisar repositórios de código.", error)
	}
}
