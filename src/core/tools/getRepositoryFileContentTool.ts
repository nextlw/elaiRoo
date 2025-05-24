import { Task } from "../../core/task/Task"
import { ToolUse, AskApproval, PushToolResult, HandleError } from "../../shared/tools"
import { getRepositoryFileContentParamsSchema, GetRepositoryFileContentParams } from "../../schemas/index"
import { ILogger as Logger } from "../../utils/logging/types"

export async function getRepositoryFileContentTool(
	cline: Task,
	block: ToolUse,
	logger: Logger,
	askApproval: AskApproval,
	pushToolResult: PushToolResult,
	handleError: HandleError,
): Promise<void> {
	logger.info("Executing get_repository_file_content tool")

	let params: GetRepositoryFileContentParams
	try {
		params = getRepositoryFileContentParamsSchema.parse(block.params)
	} catch (error) {
		logger.error(`Error parsing params: ${error}`)
		handleError(
			`Error in ${block.name}: Parsing parameters for get_repository_file_content`,
			new Error(`Invalid parameters: ${error}`),
		)
		return
	}

	const { repository_url, file_path, ref, platform } = params

	if (platform !== "github") {
		const message = `Platform '${platform}' is not yet supported for get_repository_file_content. Only 'github' is currently supported.`
		logger.warn(message)
		pushToolResult(message)
		return
	}

	// Parse repository_url to extract owner and repo
	let owner: string
	let repo: string
	try {
		const url = new URL(repository_url)
		const pathParts = url.pathname.split("/").filter((part) => part.length > 0)
		if (url.hostname !== "github.com" || pathParts.length < 2) {
			throw new Error("Invalid GitHub repository URL format.")
		}
		;[owner, repo] = pathParts
		// Remove .git suffix if present
		if (repo.endsWith(".git")) {
			repo = repo.slice(0, -4)
		}
	} catch (error) {
		const message = `Error parsing repository URL '${repository_url}': ${
			error instanceof Error ? error.message : String(error)
		}`
		logger.error(message)
		handleError(`Error in ${block.name}: Parsing repository URL`, new Error(message))
		return
	}

	let apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${file_path}`
	if (ref) {
		apiUrl += `?ref=${ref}`
	}

	logger.warn(
		"GitHub API call will be made without an authentication token. This may lead to rate limiting or issues with private repositories. Future implementation should include token configuration.",
	)

	try {
		const response = await fetch(apiUrl, {
			headers: {
				Accept: "application/vnd.github.v3+json", // Request JSON to get metadata including content
			},
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: response.statusText }))
			const errorMessage = `GitHub API error: ${response.status} - ${errorData.message || "Unknown error"}`
			logger.error(errorMessage)
			if (response.status === 404) {
				handleError(
					`Error in ${block.name}: File or repository not found`,
					new Error(`File or repository not found at ${apiUrl}. ${errorMessage}`),
				)
			} else {
				handleError(`Error in ${block.name}: GitHub API error`, new Error(errorMessage))
			}
			return
		}

		const data = await response.json()

		if (data.type !== "file") {
			const message = `The path '${file_path}' in repository '${repository_url}' is not a file (type: ${data.type}).`
			logger.warn(message)
			handleError(`Error in ${block.name}: Path is not a file`, new Error(message))
			return
		}

		if (!data.content || data.encoding !== "base64") {
			const message = `Could not retrieve file content or content is not base64 encoded. API URL: ${apiUrl}`
			logger.error(message)
			handleError(`Error in ${block.name}: Invalid content encoding`, new Error(message))
			return
		}

		// Decode base64 content
		const fileContent = Buffer.from(data.content, "base64").toString("utf-8")

		// For very large files, consider asking for approval or truncating.
		// For now, we'll send the full content.
		// const approval = await askApproval(
		//   `Found file content for '${file_path}'. Do you want to proceed with this content (approx. ${fileContent.length} characters)?`,
		//   block, // block might not be expected here by askApproval, check its definition
		// );
		// if (!approval.approved) {
		//   pushToolResult('User cancelled operation.');
		//   return;
		// }

		pushToolResult(fileContent)
		logger.info(`Successfully fetched content for ${file_path} from ${repository_url}`)
	} catch (error) {
		const message = `Error fetching file content from GitHub API: ${
			error instanceof Error ? error.message : String(error)
		}. API URL: ${apiUrl}`
		logger.error(message)
		handleError(`Error in ${block.name}: Fetching file content from API`, new Error(message))
	}
}
