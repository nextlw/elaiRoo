import * as fs from "fs/promises"
import * as path from "path"
import { JSONPath } from "jsonpath-plus"
import { parse as csvParse } from "csv-parse/sync"
import { SearchStructuredDataParams } from "../../schemas/index_e"
import { Task } from "../task/Task"
import { PushToolResult } from "../../shared/tools"
import { safeJsonParse } from "../../shared/safeJsonParse"

// TODO: Verify if Roo has a standard way to handle JSONPath queries and CSV parsing to avoid redundancy.
// This implementation uses 'jsonpath-plus' for JSONPath and 'csv-parse' for CSV.

export async function searchStructuredDataTool(
	cline: Task,
	block: { id: string; params: SearchStructuredDataParams }, // Simplified block type for now, assuming id and params are key
	askApproval: (message: string, choices?: string[]) => Promise<string | undefined>,
	pushToolResult: PushToolResult, // Added pushToolResult as a parameter
): Promise<void> {
	const params = block.params

	try {
		const fileContent = await fs.readFile(params.file_path, "utf-8")
		let fileType = params.file_type

		if (!fileType) {
			const ext = path.extname(params.file_path).toLowerCase()
			if (ext === ".json") {
				fileType = "json"
			} else if (ext === ".jsonl") {
				fileType = "jsonl"
			} else if (ext === ".csv") {
				fileType = "csv"
			} else {
				throw new Error(`Unsupported file extension: ${ext}. Please specify file_type.`)
			}
		}

		let results: unknown[] = []

		switch (fileType) {
			case "json": {
				const jsonData = safeJsonParse(fileContent) // safeJsonParse now returns the value or undefined
				if (jsonData === undefined) {
					// Check for undefined instead of .error
					throw new Error(`Error parsing JSON file: ${params.file_path}`)
				}
				if (params.query) {
					// Assuming query is a JSONPath expression
					results = JSONPath({ path: params.query, json: jsonData })
				} else {
					results = [jsonData] // Return all content if no query
				}
				break
			}
			case "jsonl": {
				const lines = fileContent.split("\n").filter((line) => line.trim() !== "")
				const jsonDataObjects = lines
					.map((line) => {
						const parsed = safeJsonParse(line) // safeJsonParse now returns the value or undefined
						if (parsed === undefined) {
							// Check for undefined
							// Log or handle individual line parse error, maybe skip?
							console.warn(`Skipping invalid JSONL line in file: ${params.file_path}`)
							return null
						}
						return parsed
					})
					.filter((obj) => obj !== null)

				if (params.query) {
					// Apply JSONPath query to each JSON object in JSONL
					// This might need adjustment based on how 'criteria' is meant to be used with JSONPath on multiple objects
					jsonDataObjects.forEach((obj) => {
						if (obj) {
							const lineResults = JSONPath({ path: params.query, json: obj })
							if (lineResults && lineResults.length > 0) {
								results.push(...lineResults)
							}
						}
					})
				} else {
					results = jsonDataObjects
				}
				break
			}
			case "csv": {
				const records = csvParse(fileContent, {
					columns: true,
					skip_empty_lines: true,
					trim: true,
				})

				if (params.query) {
					// For CSV, query might be a string to search in any cell,
					// or criteria might specify columns and values to filter.
					// This is a simple implementation: filter records where any value matches the query.
					// A more sophisticated approach would parse 'query' and 'criteria' for specific column filters.
					const queryLower = params.query.toLowerCase()
					results = records.filter((record: Record<string, string>) =>
						Object.values(record).some((value) => String(value).toLowerCase().includes(queryLower)),
					)
				} else {
					results = records
				}

				// Example of how criteria might be used (if it's a stringified JSON object of column:value)
				if (params.criteria) {
					const criteriaObj = safeJsonParse(params.criteria) // Use safeJsonParse
					if (typeof criteriaObj === "object" && criteriaObj !== null && criteriaObj !== undefined) {
						results = (results.length > 0 ? results : records).filter((record: any) => {
							return Object.entries(criteriaObj).every(([key, value]) => {
								return record[key] !== undefined && String(record[key]) === String(value)
							})
						})
					} else {
						console.warn(`Could not parse criteria as JSON object: ${params.criteria}`)
					}
				}
				break
			}
			default:
				throw new Error(`Unsupported file_type: ${fileType}`)
		}

		const resultString = JSON.stringify(results, null, 2)
		const summary = `Found ${results.length} item(s) in ${params.file_path}.`

		if (results.length > 0) {
			const approvalMessage = `${summary}\nPreview (first 500 chars):\n${resultString.substring(
				0,
				500,
			)}...\n\nProceed to push full result?`
			const userResponse = await askApproval(approvalMessage, ["Yes", "No"])
			if (userResponse === "Yes") {
				pushToolResult(resultString)
			} else {
				pushToolResult("Search cancelled by user.")
			}
		} else {
			pushToolResult(summary)
		}
	} catch (error: any) {
		console.error(`Error in searchStructuredDataTool: ${error.message}`)
		pushToolResult(`Error: ${error.message}`)
	}
}
