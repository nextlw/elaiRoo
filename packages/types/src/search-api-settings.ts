import { z } from "zod"

export const SearchApiProviderNameSchema = z.enum([
	"jina",
	"google_custom_search",
	"serper",
	"brave_search",
	"duckduckgo_fallback",
])

export type SearchApiProviderName = z.infer<typeof SearchApiProviderNameSchema>

export const baseSearchApiSettingsSchema = z.object({
	isEnabled: z.preprocess(
		(val) => (val === undefined ? true : val), // Se undefined, usa true, senão usa o valor fornecido
		z.boolean(), // Garante que o valor processado (e agora definido) seja um booleano
	),
})

export const jinaSearchApiSchema = baseSearchApiSettingsSchema.extend({
	searchApiProviderName: z.literal("jina"),
	apiKey: z.string().optional(), // Secret
	searchEndpoint: z.string().url().optional().default("https://s.jina.ai/search"),
	enableReranking: z.boolean().optional().default(false),
	rerankModel: z.string().optional().default("jina-reranker-v2-base-multilingual"),
	rerankEndpoint: z.string().url().optional().default("https://s.jina.ai/rerank"),
	enableResultEmbeddings: z.boolean().optional().default(false),
	embeddingModel: z.string().optional().default("jina-embeddings-v3"),
	embeddingEndpoint: z.string().url().optional().default("https://s.jina.ai/embed"),
	embeddingTaskForResult: z.string().optional().default("retrieval.passage"),
	embeddingDimensions: z.number().int().positive().optional().default(1024),
})

export const googleCustomSearchApiSchema = baseSearchApiSettingsSchema.extend({
	searchApiProviderName: z.literal("google_custom_search"),
	apiKey: z.string().optional(), // Secret
	cxId: z.string().optional(),
})

export const serperApiSchema = baseSearchApiSettingsSchema.extend({
	searchApiProviderName: z.literal("serper"),
	apiKey: z.string().optional(), // Secret
})

export const braveSearchApiSchema = baseSearchApiSettingsSchema.extend({
	searchApiProviderName: z.literal("brave_search"),
	apiKey: z.string().optional(), // Secret
})

export const duckduckgoFallbackSearchApiSchema = baseSearchApiSettingsSchema.extend({
	searchApiProviderName: z.literal("duckduckgo_fallback"),
})

export const searchApiSettingsSchemaDiscriminated = z.discriminatedUnion("searchApiProviderName", [
	jinaSearchApiSchema,
	googleCustomSearchApiSchema,
	serperApiSchema,
	braveSearchApiSchema,
	duckduckgoFallbackSearchApiSchema,
])

export type SearchApiSettings = z.infer<typeof searchApiSettingsSchemaDiscriminated>

export const SearchApiSettingsMetaSchema = z.object({
	id: z.string(),
	name: z.string(),
	provider: SearchApiProviderNameSchema,
})

export type SearchApiSettingsMeta = z.infer<typeof SearchApiSettingsMetaSchema>
