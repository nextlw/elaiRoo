import { Task } from "../../core/task/Task"
import { ToolUse } from "../../shared/tools"
import { extractDocumentContentParamsSchema, ExtractDocumentContentParams } from "../../schemas"
import { logger } from "../../utils/logging"
import * as fs from "fs/promises"
import axios from "axios"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import * as tmp from "tmp"
import * as path from "path"

// Define UserCancelledError locally
class UserCancelledError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "UserCancelledError"
	}
}

// const logger = getLogger('extractDocumentContentTool'); // Removed, using imported logger directly

async function downloadFile(url: string, tempFilePath: string): Promise<void> {
	try {
		const response = await axios({
			method: "get",
			url: url,
			responseType: "arraybuffer", // Important for binary files
		})
		await fs.writeFile(tempFilePath, response.data)
	} catch (error) {
		logger.error(`Failed to download file from ${url}:`, error)
		throw new Error(`Failed to download file from ${url}: ${error.message}`)
	}
}

function getFileType(source: string, explicitType?: string): string {
	if (explicitType) {
		return explicitType.toLowerCase()
	}
	const extension = path.extname(source).toLowerCase()
	if (extension.startsWith(".")) {
		return extension.substring(1)
	}
	return extension
}

export async function extractDocumentContentTool(
	cline: Task,
	block: ToolUse,
	askApproval: (message: string, keepMenuOpen?: boolean) => Promise<void>,
	pushToolResult: (data: unknown, contentType?: string, label?: string) => void,
	signal: AbortSignal,
): Promise<void> {
	let params: ExtractDocumentContentParams
	try {
		params = extractDocumentContentParamsSchema.parse(block.params)
	} catch (err) {
		logger.error("Error parsing params for extract_document_content:", err)
		pushToolResult(
			{
				error: "Invalid parameters for extract_document_content",
				details: err.errors,
			},
			"application/json",
		)
		return
	}

	const { source, document_type: explicitDocumentType } = params
	let filePath = source
	let isTempFile = false
	let tempFile: tmp.FileResult | null = null

	try {
		// Check if source is a URL
		const isUrl = source.startsWith("http://") || source.startsWith("https://")

		if (isUrl) {
			await askApproval(`Download and process document from URL: ${source}?`)
			if (signal.aborted) throw new UserCancelledError("Download cancelled by user.")

			tempFile = tmp.fileSync({ postfix: path.extname(source) || ".tmp" })
			filePath = tempFile.name
			isTempFile = true
			logger.info(`Downloading from ${source} to temporary file ${filePath}`)
			await downloadFile(source, filePath)
			logger.info(`Successfully downloaded file to ${filePath}`)
		} else {
			// It's a local file path, check if it exists
			try {
				await fs.access(filePath)
			} catch (e) {
				logger.error(`Local file not found or not accessible: ${filePath}`, e)
				pushToolResult({ error: `File not found or not accessible: ${filePath}` }, "application/json")
				return
			}
			await askApproval(`Process local document: ${filePath}?`)
			if (signal.aborted) throw new UserCancelledError("Processing cancelled by user.")
		}

		if (signal.aborted) throw new UserCancelledError("Operation cancelled by user.")

		const docType = getFileType(filePath, explicitDocumentType)
		logger.info(`Determined document type: ${docType} for source: ${source}`)

		let content: string

		switch (docType) {
			case "pdf":
				const pdfData = await fs.readFile(filePath)
				const pdfParsed = await pdfParse(pdfData)
				content = pdfParsed.text
				break
			case "docx":
				const docxResult = await mammoth.extractRawText({ path: filePath })
				content = docxResult.value
				break
			case "txt":
				content = await fs.readFile(filePath, "utf-8")
				break
			default:
				logger.warn(`Unsupported document type: ${docType} for source: ${source}`)
				pushToolResult(
					{ error: `Unsupported document type: ${docType}. Supported types are PDF, DOCX, TXT.` },
					"application/json",
				)
				return
		}

		if (signal.aborted) throw new UserCancelledError("Operation cancelled by user.")

		logger.info(`Successfully extracted content from ${source} (type: ${docType})`)
		pushToolResult(content, "text/plain", `Content from ${path.basename(source)}`)
	} catch (error) {
		if (error instanceof UserCancelledError) {
			logger.info(`extract_document_content cancelled by user: ${error.message}`)
			pushToolResult({ error: `Operation cancelled by user: ${error.message}` }, "application/json")
			return
		}
		logger.error(`Error in extract_document_content for source ${source}:`, error)
		pushToolResult(
			{
				error: `Failed to extract content from ${source}: ${error.message}`,
			},
			"application/json",
		)
	} finally {
		if (isTempFile && tempFile) {
			try {
				tempFile.removeCallback() // Clean up temporary file
				logger.info(`Temporary file ${tempFile.name} removed.`)
			} catch (cleanupError) {
				logger.error(`Error removing temporary file ${tempFile.name}:`, cleanupError)
			}
		}
	}
}
