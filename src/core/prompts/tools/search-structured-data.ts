import { ToolArgs } from "./types"

export function getSearchStructuredDataDescription(args: ToolArgs): string {
	return `## search_structured_data
Description: Search for data within structured data files (JSON, JSONL, CSV) located in the project. Allows filtering data using a specific query for the file type and additional criteria.

Parameters:
- path: (required): The path to the file containing structured data (e.g., 'data/my_data.json', 'reports/report.csv'). Can be an absolute path or a relative path to the workspace root directory ${args.cwd}.
- query: (required): The search query.
    * For JSON/JSONL: Can be a JSONPath expression (e.g., \`$.store.book[?(@.price < 10)]\`) or a JSON string representing a simple filter object (to be applied programmatically by the tool, ex: \`{"category": "fiction"}\`).
    * For CSV: A text search term to be searched in any cell, or if \`criteria\` is used to specify columns, the \`query\` can be more targeted.
- criteria: (optional): Additional filtering criteria.
    * For JSON/JSONL: Can be used if the \`query\` JSONPath is complex, or can be a JSON stringified object for additional filters.
    * For CSV: A JSON stringified object mapping column names to values to be filtered (ex: \`{"ID": "123", "Status": "Pending"}\`).
- type: (optional): The file type (ex: "json", "csv", "jsonl"). If omitted, the tool will attempt to infer the file type from the extension.
Usage:
<search_structured_data>
<path>data/products.json</path>
<query>$.products[?(@.category == "electronics" && @.price < 500)]</query>
<criteria>{"category": "fiction"}</criteria>
<type>json</type>
</search_structured_data>

<search_structured_data>
<path>data/user_logs.csv</path>
<query>error</query>
<criteria>{"level": "critical", "user_id": "user456"}</criteria>
<type>csv</type>
</search_structured_data>
`
}
