import { McpValidator } from "../../core/mcp/validation"
import type { McpTool } from "../../shared/mcp"

describe("MCP Schema Validation", () => {
	test("should validate correct tool schema", async () => {
		const toolName = "test_tool"
		const schemaProps = { testParam: { type: "string" } }
		const schemaRequired = ["testParam"]
		const toolInputSchema = {
			type: "object",
			properties: schemaProps,
			required: schemaRequired,
		} as any

		const validTool: McpTool = {
			name: toolName,
			inputSchema: toolInputSchema,
		}

		// Valide se a ferramenta com um esquema de entrada correto é válida
		const result = McpValidator.validateTool(validTool)
		expect(result.isValid).toBe(true)
	})

	test("deve rejeitar esquema de ferramenta inválido", async () => {
		// Ferramenta "broken_tool" com um esquema de entrada inválido
		const invalidTool: McpTool = {
			name: "broken_tool",
			inputSchema: { invalid: "schema" },
		}

		const result = McpValidator.validateTool(invalidTool)
		expect(result.isValid).toBe(false)
		expect(result.errors).toHaveLength(1)
	})
})
