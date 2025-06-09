import { McpTool } from "../../shared/mcp"
import { z } from "zod"

type JsonSchema = {
	type: string
	properties?: Record<string, JsonSchema>
	required?: string[]
	items?: JsonSchema
	minLength?: number
	maximum?: number
	// Outras propriedades do JSON Schema podem ser adicionadas conforme necessário
}

export class McpValidator {
	private static convertJsonSchemaToZod(schema: object): z.ZodObject<any> {
		const jsonSchema = schema as JsonSchema

		if (jsonSchema.type !== "object") {
			throw new Error("Apenas schemas do tipo object são suportados no nível raiz")
		}

		const shape: z.ZodRawShape = {}

		for (const [key, propSchema] of Object.entries(jsonSchema.properties || {})) {
			shape[key] = this.convertJsonSchemaProperty(propSchema)
		}

		const zodSchema = z.object(shape)

		if (jsonSchema.required) {
			return zodSchema.required(
				jsonSchema.required.reduce(
					(acc, key) => {
						acc[key] = true
						return acc
					},
					{} as Record<string, true>,
				),
			)
		}

		return zodSchema
	}

	private static convertJsonSchemaProperty(schema: JsonSchema): z.ZodTypeAny {
		switch (schema.type) {
			case "string": {
				let stringValidator = z.string()
				if (schema.minLength) {
					stringValidator = stringValidator.min(schema.minLength)
				}
				return stringValidator
			}
			case "number": {
				let numberValidator = z.number()
				if (schema.maximum) {
					numberValidator = numberValidator.max(schema.maximum)
				}
				return numberValidator
			}
			case "boolean":
				return z.boolean()
			case "array":
				return z.array(this.convertJsonSchemaProperty(schema.items!))
			case "object":
				return this.convertJsonSchemaToZod(schema)
			default:
				throw new Error(`Tipo não suportado: ${schema.type}`)
		}
	}

	public static validateTool(tool: McpTool): { isValid: boolean; errors?: string[] } {
		if (!tool.inputSchema) {
			// throw new Error(`Ferramenta ${tool.name} não possui inputSchema definido`)
			return { isValid: false, errors: [`Ferramenta ${tool.name} não possui inputSchema definido`] }
		}

		try {
			const schema = this.convertJsonSchemaToZod(tool.inputSchema)
			// Apenas valida a estrutura do schema, não os dados
			return { isValid: true }
		} catch (e) {
			// throw new Error(`Schema inválido para a ferramenta ${tool.name}: ${e instanceof Error ? e.message : e}`)
			return {
				isValid: false,
				errors: [
					`Schema inválido para a ferramenta ${tool.name}: ${e instanceof Error ? e.message : String(e)}`,
				],
			}
		}
	}
}
