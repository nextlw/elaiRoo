"use strict"
// Updates to this file will automatically propgate to src/exports/types.ts
// via a pre-commit hook. If you want to update the types before committing you
// can run `pnpm generate-types`.
Object.defineProperty(exports, "__esModule", { value: true })
exports.GLOBAL_STATE_KEYS =
	exports.isSecretStateKey =
	exports.SECRET_STATE_KEYS =
	exports.rooCodeSettingsSchema =
	exports.GLOBAL_SETTINGS_KEYS =
	exports.globalSettingsSchema =
	exports.PROVIDER_SETTINGS_KEYS =
	exports.providerSettingsSchema =
	exports.providerSettingsSchemaDiscriminated =
	exports.providerSettingsEntrySchema =
	exports.SearchApiSettingsMetaSchema =
	exports.searchApiSettingsSchemaDiscriminated =
	exports.deepResearchFallbackSearchApiSchema =
	exports.duckduckgoFallbackSearchApiSchema =
	exports.braveSearchApiSchema =
	exports.serperApiSchema =
	exports.googleCustomSearchApiSchema =
	exports.jinaSearchApiSchema =
	exports.baseSearchApiSettingsSchema =
	exports.SearchApiProviderNameSchema =
	exports.experimentIdsSchema =
	exports.experimentIds =
	exports.commandExecutionStatusSchema =
	exports.customSupportPromptsSchema =
	exports.customModePromptsSchema =
	exports.promptComponentSchema =
	exports.customModesSettingsSchema =
	exports.modeConfigSchema =
	exports.groupEntrySchema =
	exports.groupOptionsSchema =
	exports.historyItemSchema =
	exports.modelInfoSchema =
	exports.isModelParameter =
	exports.modelParametersSchema =
	exports.modelParameters =
	exports.reasoningEffortsSchema =
	exports.reasoningEfforts =
	exports.telemetrySettingsSchema =
	exports.telemetrySettings =
	exports.isLanguage =
	exports.languagesSchema =
	exports.languages =
	exports.toolGroupsSchema =
	exports.toolGroups =
	exports.providerNamesSchema =
	exports.providerNames =
	exports.commandIds =
	exports.terminalActionIds =
	exports.codeActionIds =
	exports.Package =
		void 0
exports.typeDefinitions =
	exports.getRepositoryFileContentParamsSchema =
	exports.processTextContentParamsSchema =
	exports.searchCodeRepositoriesParamsSchema =
	exports.searchStructuredDataParamsSchema =
	exports.extractDocumentContentParamsSchema =
	exports.extractPageContentParamsSchema =
	exports.ipcMessageSchema =
	exports.IpcOrigin =
	exports.IpcMessageType =
	exports.taskEventSchema =
	exports.taskCommandSchema =
	exports.TaskCommandName =
	exports.ackSchema =
	exports.rooCodeEventsSchema =
	exports.RooCodeEventName =
	exports.toolUsageSchema =
	exports.webSearchResultSchema =
	exports.webSearchParamsSchema =
	exports.toolNamesSchema =
	exports.toolNames =
	exports.tokenUsageSchema =
	exports.clineMessageSchema =
	exports.contextCondenseSchema =
	exports.toolProgressStatusSchema =
	exports.clineSaySchema =
	exports.clineSays =
	exports.clineAskSchema =
	exports.clineAsks =
	exports.isSearchApiGlobalStateKey =
	exports.SEARCH_API_GLOBAL_STATE_KEYS =
	exports.isSearchApiSecretStateKey =
	exports.SEARCH_API_SECRET_STATE_KEYS =
	exports.isGlobalStateKey =
		void 0
const zod_1 = require("zod")
/**
 * Extension
 */
const package_json_1 = require("../package.json")
// These ENV variables can be defined by ESBuild when building the extension
// in order to override the values in package.json. This allows us to build
// different extension variants with the same package.json file.
// The build process still needs to emit a modified package.json for consumption
// by VSCode, but that build artifact is not used during the transpile step of
// the build, so we still need this override mechanism.
exports.Package = {
	publisher: package_json_1.publisher,
	name: process.env.PKG_NAME || package_json_1.name,
	version: process.env.PKG_VERSION || package_json_1.version,
	outputChannel: process.env.PKG_OUTPUT_CHANNEL || "Roo-Code",
	sha: process.env.PKG_SHA,
}
/**
 * CodeAction
 */
exports.codeActionIds = ["explainCode", "fixCode", "improveCode", "addToContext", "newTask"]
/**
 * TerminalAction
 */
exports.terminalActionIds = ["terminalAddToContext", "terminalFixCommand", "terminalExplainCommand"]
/**
 * Command
 */
exports.commandIds = [
	"activationCompleted",
	"plusButtonClicked",
	"promptsButtonClicked",
	"mcpButtonClicked",
	"historyButtonClicked",
	"popoutButtonClicked",
	"settingsButtonClicked",
	"openInNewTab",
	"showHumanRelayDialog",
	"registerHumanRelayCallback",
	"unregisterHumanRelayCallback",
	"handleHumanRelayResponse",
	"newTask",
	"setCustomStoragePath",
	"focusInput",
	"acceptInput",
	"web_search",
]
/**
 * ProviderName
 */
exports.providerNames = [
	"anthropic",
	"glama",
	"openrouter",
	"bedrock",
	"vertex",
	"openai",
	"ollama",
	"vscode-lm",
	"lmstudio",
	"gemini",
	"openai-native",
	"mistral",
	"deepseek",
	"unbound",
	"requesty",
	"human-relay",
	"fake-ai",
	"xai",
	"groq",
	"chutes",
	"litellm",
	"extract_page_content",
	"get_repository_file_content",
]
exports.providerNamesSchema = zod_1.z.enum(exports.providerNames)
/**
 * ToolGroup
 */
exports.toolGroups = ["read", "edit", "browser", "command", "mcp", "modes", "deepSearchTools", "ask", "completion"]
exports.toolGroupsSchema = zod_1.z.enum(exports.toolGroups)
/**
 * Language
 */
exports.languages = [
	"ca",
	"de",
	"en",
	"es",
	"fr",
	"hi",
	"it",
	"ja",
	"ko",
	"nl",
	"pl",
	"pt-BR",
	"ru",
	"tr",
	"vi",
	"zh-CN",
	"zh-TW",
]
exports.languagesSchema = zod_1.z.enum(exports.languages)
const isLanguage = (value) => exports.languages.includes(value)
exports.isLanguage = isLanguage
/**
 * TelemetrySetting
 */
exports.telemetrySettings = ["unset", "enabled", "disabled"]
exports.telemetrySettingsSchema = zod_1.z.enum(exports.telemetrySettings)
/**
 * ReasoningEffort
 */
exports.reasoningEfforts = ["low", "medium", "high"]
exports.reasoningEffortsSchema = zod_1.z.enum(exports.reasoningEfforts)
/**
 * ModelParameter
 */
exports.modelParameters = ["max_tokens", "temperature", "reasoning", "include_reasoning"]
exports.modelParametersSchema = zod_1.z.enum(exports.modelParameters)
const isModelParameter = (value) => exports.modelParameters.includes(value)
exports.isModelParameter = isModelParameter
/**
 * ModelInfo
 */
exports.modelInfoSchema = zod_1.z.object({
	maxTokens: zod_1.z.number().nullish(),
	maxThinkingTokens: zod_1.z.number().nullish(),
	contextWindow: zod_1.z.number(),
	supportsImages: zod_1.z.boolean().optional(),
	supportsComputerUse: zod_1.z.boolean().optional(),
	supportsPromptCache: zod_1.z.boolean(),
	supportsReasoningBudget: zod_1.z.boolean().optional(),
	requiredReasoningBudget: zod_1.z.boolean().optional(),
	supportsReasoningEffort: zod_1.z.boolean().optional(),
	supportedParameters: zod_1.z.array(exports.modelParametersSchema).optional(),
	inputPrice: zod_1.z.number().optional(),
	outputPrice: zod_1.z.number().optional(),
	cacheWritesPrice: zod_1.z.number().optional(),
	cacheReadsPrice: zod_1.z.number().optional(),
	description: zod_1.z.string().optional(),
	reasoningEffort: exports.reasoningEffortsSchema.optional(),
	minTokensPerCachePoint: zod_1.z.number().optional(),
	maxCachePoints: zod_1.z.number().optional(),
	cachableFields: zod_1.z.array(zod_1.z.string()).optional(),
	tiers: zod_1.z
		.array(
			zod_1.z.object({
				contextWindow: zod_1.z.number(),
				inputPrice: zod_1.z.number().optional(),
				outputPrice: zod_1.z.number().optional(),
				cacheWritesPrice: zod_1.z.number().optional(),
				cacheReadsPrice: zod_1.z.number().optional(),
			}),
		)
		.optional(),
})
/**
 * HistoryItem
 */
exports.historyItemSchema = zod_1.z.object({
	id: zod_1.z.string(),
	number: zod_1.z.number(),
	ts: zod_1.z.number(),
	task: zod_1.z.string(),
	tokensIn: zod_1.z.number(),
	tokensOut: zod_1.z.number(),
	cacheWrites: zod_1.z.number().optional(),
	cacheReads: zod_1.z.number().optional(),
	totalCost: zod_1.z.number(),
	size: zod_1.z.number().optional(),
	workspace: zod_1.z.string().optional(),
	parentId: zod_1.z.string().optional(),
})
/**
 * GroupOptions
 */
exports.groupOptionsSchema = zod_1.z.object({
	fileRegex: zod_1.z
		.string()
		.optional()
		.refine(
			(pattern) => {
				if (!pattern) {
					return true // Optional, so empty is valid.
				}
				try {
					new RegExp(pattern)
					return true
				} catch {
					return false
				}
			},
			{ message: "Invalid regular expression pattern" },
		),
	description: zod_1.z.string().optional(),
})
/**
 * GroupEntry
 */
exports.groupEntrySchema = zod_1.z.union([
	exports.toolGroupsSchema,
	zod_1.z.tuple([exports.toolGroupsSchema, exports.groupOptionsSchema]),
])
/**
 * ModeConfig
 */
const groupEntryArraySchema = zod_1.z.array(exports.groupEntrySchema).refine(
	(groups) => {
		const seen = new Set()
		return groups.every((group) => {
			// For tuples, check the group name (first element).
			const groupName = Array.isArray(group) ? group[0] : group
			if (seen.has(groupName)) {
				return false
			}
			seen.add(groupName)
			return true
		})
	},
	{ message: "Duplicate groups are not allowed" },
)
exports.modeConfigSchema = zod_1.z.object({
	slug: zod_1.z.string().regex(/^[a-zA-Z0-9-]+$/, "Slug must contain only letters numbers and dashes"),
	name: zod_1.z.string().min(1, "Name is required"),
	roleDefinition: zod_1.z.string().min(1, "Role definition is required"),
	whenToUse: zod_1.z.string().optional(),
	customInstructions: zod_1.z.string().optional(),
	groups: groupEntryArraySchema,
	source: zod_1.z.enum(["global", "project"]).optional(),
})
/**
 * CustomModesSettings
 */
exports.customModesSettingsSchema = zod_1.z.object({
	customModes: zod_1.z.array(exports.modeConfigSchema).refine(
		(modes) => {
			const slugs = new Set()
			return modes.every((mode) => {
				if (slugs.has(mode.slug)) {
					return false
				}
				slugs.add(mode.slug)
				return true
			})
		},
		{
			message: "Duplicate mode slugs are not allowed",
		},
	),
})
/**
 * PromptComponent
 */
exports.promptComponentSchema = zod_1.z.object({
	roleDefinition: zod_1.z.string().optional(),
	whenToUse: zod_1.z.string().optional(),
	customInstructions: zod_1.z.string().optional(),
})
/**
 * CustomModePrompts
 */
exports.customModePromptsSchema = zod_1.z.record(zod_1.z.string(), exports.promptComponentSchema.optional())
/**
 * CustomSupportPrompts
 */
exports.customSupportPromptsSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.string().optional())
/**
 * CommandExecutionStatus
 */
exports.commandExecutionStatusSchema = zod_1.z.discriminatedUnion("status", [
	zod_1.z.object({
		executionId: zod_1.z.string(),
		status: zod_1.z.literal("started"),
		pid: zod_1.z.number().optional(),
		command: zod_1.z.string(),
	}),
	zod_1.z.object({
		executionId: zod_1.z.string(),
		status: zod_1.z.literal("output"),
		output: zod_1.z.string(),
	}),
	zod_1.z.object({
		executionId: zod_1.z.string(),
		status: zod_1.z.literal("exited"),
		exitCode: zod_1.z.number().optional(),
	}),
	zod_1.z.object({
		executionId: zod_1.z.string(),
		status: zod_1.z.literal("fallback"),
	}),
])
/**
 * ExperimentId
 */
exports.experimentIds = ["autoCondenseContext", "powerSteering"]
exports.experimentIdsSchema = zod_1.z.enum(exports.experimentIds)
/**
 * Experiments
 */
const experimentsSchema = zod_1.z.object({
	autoCondenseContext: zod_1.z.boolean(),
	powerSteering: zod_1.z.boolean(),
})
// Search API Settings Schemas
exports.SearchApiProviderNameSchema = zod_1.z.enum([
	"jina",
	"google_custom_search",
	"serper",
	"brave_search",
	"duckduckgo_fallback",
	"deep_research_fallback",
])
exports.baseSearchApiSettingsSchema = zod_1.z.object({
	isEnabled: zod_1.z.preprocess(
		(val) => (val === undefined ? true : val), // Se undefined, usa true, senão usa o valor fornecido
		zod_1.z.boolean(),
	),
})
exports.jinaSearchApiSchema = exports.baseSearchApiSettingsSchema.extend({
	searchApiProviderName: zod_1.z.literal("jina"),
	apiKey: zod_1.z.string().optional(), // Secret
	searchEndpoint: zod_1.z.string().url().optional().default("https://s.jina.ai/search"),
	enableReranking: zod_1.z.boolean().optional().default(false),
	rerankModel: zod_1.z.string().optional().default("jina-reranker-v2-base-multilingual"),
	rerankEndpoint: zod_1.z.string().url().optional().default("https://s.jina.ai/rerank"),
	enableResultEmbeddings: zod_1.z.boolean().optional().default(false),
	embeddingModel: zod_1.z.string().optional().default("jina-embeddings-v3"),
	embeddingEndpoint: zod_1.z.string().url().optional().default("https://s.jina.ai/embed"),
	embeddingTaskForResult: zod_1.z.string().optional().default("retrieval.passage"),
	embeddingDimensions: zod_1.z.number().int().positive().optional().default(1024),
})
exports.googleCustomSearchApiSchema = exports.baseSearchApiSettingsSchema.extend({
	searchApiProviderName: zod_1.z.literal("google_custom_search"),
	apiKey: zod_1.z.string().optional(), // Secret
	cxId: zod_1.z.string().optional(),
})
exports.serperApiSchema = exports.baseSearchApiSettingsSchema.extend({
	searchApiProviderName: zod_1.z.literal("serper"),
	apiKey: zod_1.z.string().optional(), // Secret
})
exports.braveSearchApiSchema = exports.baseSearchApiSettingsSchema.extend({
	searchApiProviderName: zod_1.z.literal("brave_search"),
	apiKey: zod_1.z.string().optional(), // Secret
})
exports.duckduckgoFallbackSearchApiSchema = exports.baseSearchApiSettingsSchema.extend({
	searchApiProviderName: zod_1.z.literal("duckduckgo_fallback"),
})
exports.deepResearchFallbackSearchApiSchema = exports.baseSearchApiSettingsSchema.extend({
	searchApiProviderName: zod_1.z.literal("deep_research_fallback"),
	endpoint: zod_1.z.string().url().optional().default("http://localhost:3002"),
	timeout: zod_1.z.number().optional().default(30000),
	enableSSE: zod_1.z.boolean().optional().default(true),
})
exports.searchApiSettingsSchemaDiscriminated = zod_1.z.discriminatedUnion("searchApiProviderName", [
	exports.jinaSearchApiSchema,
	exports.googleCustomSearchApiSchema,
	exports.serperApiSchema,
	exports.braveSearchApiSchema,
	exports.duckduckgoFallbackSearchApiSchema,
	exports.deepResearchFallbackSearchApiSchema,
])
exports.SearchApiSettingsMetaSchema = zod_1.z.object({
	id: zod_1.z.string(),
	name: zod_1.z.string(),
	provider: exports.SearchApiProviderNameSchema,
})
// Fim dos Search API Settings Schemas
/**
 * ProviderSettingsEntry
 */
exports.providerSettingsEntrySchema = zod_1.z.object({
	id: zod_1.z.string(),
	name: zod_1.z.string(),
	apiProvider: exports.providerNamesSchema.optional(),
})
/**
 * ProviderSettings
 */
const baseProviderSettingsSchema = zod_1.z.object({
	includeMaxTokens: zod_1.z.boolean().optional(),
	diffEnabled: zod_1.z.boolean().optional(),
	fuzzyMatchThreshold: zod_1.z.number().optional(),
	modelTemperature: zod_1.z.number().nullish(),
	rateLimitSeconds: zod_1.z.number().optional(),
	// Model reasoning.
	enableReasoningEffort: zod_1.z.boolean().optional(),
	reasoningEffort: exports.reasoningEffortsSchema.optional(),
	modelMaxTokens: zod_1.z.number().optional(),
	modelMaxThinkingTokens: zod_1.z.number().optional(),
})
// Several of the providers share common model config properties.
const apiModelIdProviderModelSchema = baseProviderSettingsSchema.extend({
	apiModelId: zod_1.z.string().optional(),
})
const anthropicSchema = apiModelIdProviderModelSchema.extend({
	apiKey: zod_1.z.string().optional(),
	anthropicBaseUrl: zod_1.z.string().optional(),
	anthropicUseAuthToken: zod_1.z.boolean().optional(),
})
const glamaSchema = baseProviderSettingsSchema.extend({
	glamaModelId: zod_1.z.string().optional(),
	glamaApiKey: zod_1.z.string().optional(),
})
const openRouterSchema = baseProviderSettingsSchema.extend({
	openRouterApiKey: zod_1.z.string().optional(),
	openRouterModelId: zod_1.z.string().optional(),
	openRouterBaseUrl: zod_1.z.string().optional(),
	openRouterSpecificProvider: zod_1.z.string().optional(),
	openRouterUseMiddleOutTransform: zod_1.z.boolean().optional(),
})
const bedrockSchema = apiModelIdProviderModelSchema.extend({
	awsAccessKey: zod_1.z.string().optional(),
	awsSecretKey: zod_1.z.string().optional(),
	awsSessionToken: zod_1.z.string().optional(),
	awsRegion: zod_1.z.string().optional(),
	awsUseCrossRegionInference: zod_1.z.boolean().optional(),
	awsUsePromptCache: zod_1.z.boolean().optional(),
	awsProfile: zod_1.z.string().optional(),
	awsUseProfile: zod_1.z.boolean().optional(),
	awsCustomArn: zod_1.z.string().optional(),
})
const vertexSchema = apiModelIdProviderModelSchema.extend({
	vertexKeyFile: zod_1.z.string().optional(),
	vertexJsonCredentials: zod_1.z.string().optional(),
	vertexProjectId: zod_1.z.string().optional(),
	vertexRegion: zod_1.z.string().optional(),
})
const openAiSchema = baseProviderSettingsSchema.extend({
	openAiBaseUrl: zod_1.z.string().optional(),
	openAiApiKey: zod_1.z.string().optional(),
	openAiLegacyFormat: zod_1.z.boolean().optional(),
	openAiR1FormatEnabled: zod_1.z.boolean().optional(),
	openAiModelId: zod_1.z.string().optional(),
	openAiCustomModelInfo: exports.modelInfoSchema.nullish(),
	openAiUseAzure: zod_1.z.boolean().optional(),
	azureApiVersion: zod_1.z.string().optional(),
	openAiStreamingEnabled: zod_1.z.boolean().optional(),
	openAiHostHeader: zod_1.z.string().optional(), // Keep temporarily for backward compatibility during migration.
	openAiHeaders: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
})
const ollamaSchema = baseProviderSettingsSchema.extend({
	ollamaModelId: zod_1.z.string().optional(),
	ollamaBaseUrl: zod_1.z.string().optional(),
})
const vsCodeLmSchema = baseProviderSettingsSchema.extend({
	vsCodeLmModelSelector: zod_1.z
		.object({
			vendor: zod_1.z.string().optional(),
			family: zod_1.z.string().optional(),
			version: zod_1.z.string().optional(),
			id: zod_1.z.string().optional(),
		})
		.optional(),
})
const lmStudioSchema = baseProviderSettingsSchema.extend({
	lmStudioModelId: zod_1.z.string().optional(),
	lmStudioBaseUrl: zod_1.z.string().optional(),
	lmStudioDraftModelId: zod_1.z.string().optional(),
	lmStudioSpeculativeDecodingEnabled: zod_1.z.boolean().optional(),
})
const geminiSchema = apiModelIdProviderModelSchema.extend({
	geminiApiKey: zod_1.z.string().optional(),
	googleGeminiBaseUrl: zod_1.z.string().optional(),
})
const openAiNativeSchema = apiModelIdProviderModelSchema.extend({
	openAiNativeApiKey: zod_1.z.string().optional(),
	openAiNativeBaseUrl: zod_1.z.string().optional(),
})
const mistralSchema = apiModelIdProviderModelSchema.extend({
	mistralApiKey: zod_1.z.string().optional(),
	mistralCodestralUrl: zod_1.z.string().optional(),
})
const deepSeekSchema = apiModelIdProviderModelSchema.extend({
	deepSeekBaseUrl: zod_1.z.string().optional(),
	deepSeekApiKey: zod_1.z.string().optional(),
})
const unboundSchema = baseProviderSettingsSchema.extend({
	unboundApiKey: zod_1.z.string().optional(),
	unboundModelId: zod_1.z.string().optional(),
})
const requestySchema = baseProviderSettingsSchema.extend({
	requestyApiKey: zod_1.z.string().optional(),
	requestyModelId: zod_1.z.string().optional(),
})
const humanRelaySchema = baseProviderSettingsSchema
const fakeAiSchema = baseProviderSettingsSchema.extend({
	fakeAi: zod_1.z.unknown().optional(),
})
const xaiSchema = apiModelIdProviderModelSchema.extend({
	xaiApiKey: zod_1.z.string().optional(),
})
const groqSchema = apiModelIdProviderModelSchema.extend({
	groqApiKey: zod_1.z.string().optional(),
})
const chutesSchema = apiModelIdProviderModelSchema.extend({
	chutesApiKey: zod_1.z.string().optional(),
})
const litellmSchema = baseProviderSettingsSchema.extend({
	litellmBaseUrl: zod_1.z.string().optional(),
	litellmApiKey: zod_1.z.string().optional(),
	litellmModelId: zod_1.z.string().optional(),
})
const defaultSchema = zod_1.z.object({
	apiProvider: zod_1.z.undefined(),
})
exports.providerSettingsSchemaDiscriminated = zod_1.z.discriminatedUnion("apiProvider", [
	anthropicSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("anthropic") })),
	glamaSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("glama") })),
	openRouterSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("openrouter") })),
	bedrockSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("bedrock") })),
	vertexSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("vertex") })),
	openAiSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("openai") })),
	ollamaSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("ollama") })),
	vsCodeLmSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("vscode-lm") })),
	lmStudioSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("lmstudio") })),
	geminiSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("gemini") })),
	openAiNativeSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("openai-native") })),
	mistralSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("mistral") })),
	deepSeekSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("deepseek") })),
	unboundSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("unbound") })),
	requestySchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("requesty") })),
	humanRelaySchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("human-relay") })),
	fakeAiSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("fake-ai") })),
	xaiSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("xai") })),
	groqSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("groq") })),
	chutesSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("chutes") })),
	litellmSchema.merge(zod_1.z.object({ apiProvider: zod_1.z.literal("litellm") })),
	defaultSchema,
])
exports.providerSettingsSchema = zod_1.z.object({
	apiProvider: exports.providerNamesSchema.optional(),
	...anthropicSchema.shape,
	...glamaSchema.shape,
	...openRouterSchema.shape,
	...bedrockSchema.shape,
	...vertexSchema.shape,
	...openAiSchema.shape,
	...ollamaSchema.shape,
	...vsCodeLmSchema.shape,
	...lmStudioSchema.shape,
	...geminiSchema.shape,
	...openAiNativeSchema.shape,
	...mistralSchema.shape,
	...deepSeekSchema.shape,
	...unboundSchema.shape,
	...requestySchema.shape,
	...humanRelaySchema.shape,
	...fakeAiSchema.shape,
	...xaiSchema.shape,
	...groqSchema.shape,
	...chutesSchema.shape,
	...litellmSchema.shape,
})
const providerSettingsRecord = {
	apiProvider: undefined,
	// Anthropic
	apiModelId: undefined,
	apiKey: undefined,
	anthropicBaseUrl: undefined,
	anthropicUseAuthToken: undefined,
	// Glama
	glamaModelId: undefined,
	glamaApiKey: undefined,
	// OpenRouter
	openRouterApiKey: undefined,
	openRouterModelId: undefined,
	openRouterBaseUrl: undefined,
	openRouterSpecificProvider: undefined,
	openRouterUseMiddleOutTransform: undefined,
	// Amazon Bedrock
	awsAccessKey: undefined,
	awsSecretKey: undefined,
	awsSessionToken: undefined,
	awsRegion: undefined,
	awsUseCrossRegionInference: undefined,
	awsUsePromptCache: undefined,
	awsProfile: undefined,
	awsUseProfile: undefined,
	awsCustomArn: undefined,
	// Google Vertex
	vertexKeyFile: undefined,
	vertexJsonCredentials: undefined,
	vertexProjectId: undefined,
	vertexRegion: undefined,
	// OpenAI
	openAiBaseUrl: undefined,
	openAiApiKey: undefined,
	openAiLegacyFormat: undefined,
	openAiR1FormatEnabled: undefined,
	openAiModelId: undefined,
	openAiCustomModelInfo: undefined,
	openAiUseAzure: undefined,
	azureApiVersion: undefined,
	openAiStreamingEnabled: undefined,
	openAiHostHeader: undefined, // Keep temporarily for backward compatibility during migration
	openAiHeaders: undefined,
	// Ollama
	ollamaModelId: undefined,
	ollamaBaseUrl: undefined,
	// VS Code LM
	vsCodeLmModelSelector: undefined,
	lmStudioModelId: undefined,
	lmStudioBaseUrl: undefined,
	lmStudioDraftModelId: undefined,
	lmStudioSpeculativeDecodingEnabled: undefined,
	// Gemini
	geminiApiKey: undefined,
	googleGeminiBaseUrl: undefined,
	// OpenAI Native
	openAiNativeApiKey: undefined,
	openAiNativeBaseUrl: undefined,
	// Mistral
	mistralApiKey: undefined,
	mistralCodestralUrl: undefined,
	// DeepSeek
	deepSeekBaseUrl: undefined,
	deepSeekApiKey: undefined,
	// Unbound
	unboundApiKey: undefined,
	unboundModelId: undefined,
	// Requesty
	requestyApiKey: undefined,
	requestyModelId: undefined,
	// Reasoning
	enableReasoningEffort: undefined,
	reasoningEffort: undefined,
	modelMaxTokens: undefined,
	modelMaxThinkingTokens: undefined,
	// Generic
	includeMaxTokens: undefined,
	diffEnabled: undefined,
	fuzzyMatchThreshold: undefined,
	modelTemperature: undefined,
	rateLimitSeconds: undefined,
	// Fake AI
	fakeAi: undefined,
	// X.AI (Grok)
	xaiApiKey: undefined,
	// Groq
	groqApiKey: undefined,
	// Chutes AI
	chutesApiKey: undefined,
	// LiteLLM
	litellmBaseUrl: undefined,
	litellmApiKey: undefined,
	litellmModelId: undefined,
}
exports.PROVIDER_SETTINGS_KEYS = Object.keys(providerSettingsRecord)
/**
 * GlobalSettings
 */
exports.globalSettingsSchema = zod_1.z.object({
	currentApiConfigName: zod_1.z.string().optional(),
	listApiConfigMeta: zod_1.z.array(exports.providerSettingsEntrySchema).optional(), // Mantido para configurações de provedor de LLM
	pinnedApiConfigs: zod_1.z.record(zod_1.z.string(), zod_1.z.boolean()).optional(),
	// Configurações da API de Busca
	currentSearchApiConfigName: zod_1.z.string().optional(),
	searchApiConfigurations: zod_1.z.array(exports.SearchApiSettingsMetaSchema).optional(),
	activeSearchApiSettings: exports.searchApiSettingsSchemaDiscriminated.optional(),
	lastShownAnnouncementId: zod_1.z.string().optional(),
	customInstructions: zod_1.z.string().optional(),
	taskHistory: zod_1.z.array(exports.historyItemSchema).optional(),
	condensingApiConfigId: zod_1.z.string().optional(),
	customCondensingPrompt: zod_1.z.string().optional(),
	autoApprovalEnabled: zod_1.z.boolean().optional(),
	alwaysAllowReadOnly: zod_1.z.boolean().optional(),
	alwaysAllowReadOnlyOutsideWorkspace: zod_1.z.boolean().optional(),
	alwaysAllowWrite: zod_1.z.boolean().optional(),
	alwaysAllowWriteOutsideWorkspace: zod_1.z.boolean().optional(),
	writeDelayMs: zod_1.z.number().optional(),
	alwaysAllowBrowser: zod_1.z.boolean().optional(),
	alwaysApproveResubmit: zod_1.z.boolean().optional(),
	requestDelaySeconds: zod_1.z.number().optional(),
	alwaysAllowMcp: zod_1.z.boolean().optional(),
	alwaysAllowModeSwitch: zod_1.z.boolean().optional(),
	alwaysAllowSubtasks: zod_1.z.boolean().optional(),
	alwaysAllowExecute: zod_1.z.boolean().optional(),
	allowedCommands: zod_1.z.array(zod_1.z.string()).optional(),
	allowedMaxRequests: zod_1.z.number().nullish(),
	autoCondenseContextPercent: zod_1.z.number().optional(),
	browserToolEnabled: zod_1.z.boolean().optional(),
	browserViewportSize: zod_1.z.string().optional(),
	screenshotQuality: zod_1.z.number().optional(),
	remoteBrowserEnabled: zod_1.z.boolean().optional(),
	remoteBrowserHost: zod_1.z.string().optional(),
	cachedChromeHostUrl: zod_1.z.string().optional(),
	enableCheckpoints: zod_1.z.boolean().optional(),
	ttsEnabled: zod_1.z.boolean().optional(),
	ttsSpeed: zod_1.z.number().optional(),
	soundEnabled: zod_1.z.boolean().optional(),
	soundVolume: zod_1.z.number().optional(),
	maxOpenTabsContext: zod_1.z.number().optional(),
	maxWorkspaceFiles: zod_1.z.number().optional(),
	showRooIgnoredFiles: zod_1.z.boolean().optional(),
	maxReadFileLine: zod_1.z.number().optional(),
	terminalOutputLineLimit: zod_1.z.number().optional(),
	terminalShellIntegrationTimeout: zod_1.z.number().optional(),
	terminalShellIntegrationDisabled: zod_1.z.boolean().optional(),
	terminalCommandDelay: zod_1.z.number().optional(),
	terminalPowershellCounter: zod_1.z.boolean().optional(),
	terminalZshClearEolMark: zod_1.z.boolean().optional(),
	terminalZshOhMy: zod_1.z.boolean().optional(),
	terminalZshP10k: zod_1.z.boolean().optional(),
	terminalZdotdir: zod_1.z.boolean().optional(),
	terminalCompressProgressBar: zod_1.z.boolean().optional(),
	rateLimitSeconds: zod_1.z.number().optional(),
	diffEnabled: zod_1.z.boolean().optional(),
	fuzzyMatchThreshold: zod_1.z.number().optional(),
	experiments: experimentsSchema.optional(),
	language: exports.languagesSchema.optional(),
	telemetrySetting: exports.telemetrySettingsSchema.optional(),
	mcpEnabled: zod_1.z.boolean().optional(),
	enableMcpServerCreation: zod_1.z.boolean().optional(),
	mode: zod_1.z.string().optional(),
	modeApiConfigs: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
	customModes: zod_1.z.array(exports.modeConfigSchema).optional(),
	customModePrompts: exports.customModePromptsSchema.optional(),
	customSupportPrompts: exports.customSupportPromptsSchema.optional(),
	enhancementApiConfigId: zod_1.z.string().optional(),
	historyPreviewCollapsed: zod_1.z.boolean().optional(),
})
const globalSettingsRecord = {
	currentApiConfigName: undefined,
	listApiConfigMeta: undefined,
	pinnedApiConfigs: undefined,
	// Search API Settings
	currentSearchApiConfigName: undefined,
	searchApiConfigurations: undefined,
	activeSearchApiSettings: undefined,
	lastShownAnnouncementId: undefined,
	customInstructions: undefined,
	taskHistory: undefined,
	condensingApiConfigId: undefined,
	customCondensingPrompt: undefined,
	autoApprovalEnabled: undefined,
	alwaysAllowReadOnly: undefined,
	alwaysAllowReadOnlyOutsideWorkspace: undefined,
	alwaysAllowWrite: undefined,
	alwaysAllowWriteOutsideWorkspace: undefined,
	writeDelayMs: undefined,
	alwaysAllowBrowser: undefined,
	alwaysApproveResubmit: undefined,
	requestDelaySeconds: undefined,
	alwaysAllowMcp: undefined,
	alwaysAllowModeSwitch: undefined,
	alwaysAllowSubtasks: undefined,
	alwaysAllowExecute: undefined,
	allowedCommands: undefined,
	allowedMaxRequests: undefined,
	autoCondenseContextPercent: undefined,
	browserToolEnabled: undefined,
	browserViewportSize: undefined,
	screenshotQuality: undefined,
	remoteBrowserEnabled: undefined,
	remoteBrowserHost: undefined,
	enableCheckpoints: undefined,
	ttsEnabled: undefined,
	ttsSpeed: undefined,
	soundEnabled: undefined,
	soundVolume: undefined,
	maxOpenTabsContext: undefined,
	maxWorkspaceFiles: undefined,
	showRooIgnoredFiles: undefined,
	maxReadFileLine: undefined,
	terminalOutputLineLimit: undefined,
	terminalShellIntegrationTimeout: undefined,
	terminalShellIntegrationDisabled: undefined,
	terminalCommandDelay: undefined,
	terminalPowershellCounter: undefined,
	terminalZshClearEolMark: undefined,
	terminalZshOhMy: undefined,
	terminalZshP10k: undefined,
	terminalZdotdir: undefined,
	terminalCompressProgressBar: undefined,
	rateLimitSeconds: undefined,
	diffEnabled: undefined,
	fuzzyMatchThreshold: undefined,
	experiments: undefined,
	language: undefined,
	telemetrySetting: undefined,
	mcpEnabled: undefined,
	enableMcpServerCreation: undefined,
	mode: undefined,
	modeApiConfigs: undefined,
	customModes: undefined,
	customModePrompts: undefined,
	customSupportPrompts: undefined,
	enhancementApiConfigId: undefined,
	cachedChromeHostUrl: undefined,
	historyPreviewCollapsed: undefined,
}
exports.GLOBAL_SETTINGS_KEYS = Object.keys(globalSettingsRecord)
/**
 * RooCodeSettings
 */
exports.rooCodeSettingsSchema = exports.providerSettingsSchema.merge(exports.globalSettingsSchema)
const secretStateRecord = {
	apiKey: undefined,
	glamaApiKey: undefined,
	openRouterApiKey: undefined,
	awsAccessKey: undefined,
	awsSecretKey: undefined,
	awsSessionToken: undefined,
	openAiApiKey: undefined,
	geminiApiKey: undefined,
	openAiNativeApiKey: undefined,
	deepSeekApiKey: undefined,
	mistralApiKey: undefined,
	unboundApiKey: undefined,
	requestyApiKey: undefined,
	xaiApiKey: undefined,
	groqApiKey: undefined,
	chutesApiKey: undefined,
	litellmApiKey: undefined,
}
exports.SECRET_STATE_KEYS = Object.keys(secretStateRecord)
const isSecretStateKey = (key) => exports.SECRET_STATE_KEYS.includes(key)
exports.isSecretStateKey = isSecretStateKey
exports.GLOBAL_STATE_KEYS = [...exports.GLOBAL_SETTINGS_KEYS, ...exports.PROVIDER_SETTINGS_KEYS].filter(
	(key) => !exports.SECRET_STATE_KEYS.includes(key),
)
const isGlobalStateKey = (key) => exports.GLOBAL_STATE_KEYS.includes(key)
exports.isGlobalStateKey = isGlobalStateKey
/**
 * SearchAPISettings Keys
 */
exports.SEARCH_API_SECRET_STATE_KEYS = [
	"jina.apiKey",
	"google_custom_search.apiKey",
	"serper.apiKey",
	"brave_search.apiKey",
]
const isSearchApiSecretStateKey = (key) => exports.SEARCH_API_SECRET_STATE_KEYS.includes(key)
exports.isSearchApiSecretStateKey = isSearchApiSecretStateKey
exports.SEARCH_API_GLOBAL_STATE_KEYS = [
	"jina.isEnabled",
	"jina.searchEndpoint",
	"jina.enableReranking",
	"jina.rerankModel",
	"jina.rerankEndpoint",
	"jina.enableResultEmbeddings",
	"jina.embeddingModel",
	"jina.embeddingEndpoint",
	"jina.embeddingTaskForResult",
	"jina.embeddingDimensions",
	"google_custom_search.isEnabled",
	"google_custom_search.cxId",
	"serper.isEnabled",
	"brave_search.isEnabled",
	"duckduckgo_fallback.isEnabled",
]
const isSearchApiGlobalStateKey = (key) => exports.SEARCH_API_GLOBAL_STATE_KEYS.includes(key)
exports.isSearchApiGlobalStateKey = isSearchApiGlobalStateKey
/**
 * ClineAsk
 */
exports.clineAsks = [
	"followup",
	"command",
	"command_output",
	"completion_result",
	"tool",
	"api_req_failed",
	"resume_task",
	"resume_completed_task",
	"mistake_limit_reached",
	"browser_action_launch",
	"use_mcp_server",
	"auto_approval_max_req_reached",
]
exports.clineAskSchema = zod_1.z.enum(exports.clineAsks)
// ClineSay
exports.clineSays = [
	"error",
	"api_req_started",
	"api_req_finished",
	"api_req_retried",
	"api_req_retry_delayed",
	"api_req_deleted",
	"text",
	"reasoning",
	"completion_result",
	"user_feedback",
	"user_feedback_diff",
	"command_output",
	"shell_integration_warning",
	"browser_action",
	"browser_action_result",
	"mcp_server_request_started",
	"mcp_server_response",
	"subtask_result",
	"checkpoint_saved",
	"rooignore_error",
	"diff_error",
	"condense_context",
]
exports.clineSaySchema = zod_1.z.enum(exports.clineSays)
/**
 * ToolProgressStatus
 */
exports.toolProgressStatusSchema = zod_1.z.object({
	icon: zod_1.z.string().optional(),
	text: zod_1.z.string().optional(),
})
/**
 * ContextCondense
 */
exports.contextCondenseSchema = zod_1.z.object({
	cost: zod_1.z.number(),
	prevContextTokens: zod_1.z.number(),
	newContextTokens: zod_1.z.number(),
	summary: zod_1.z.string(),
})
/**
 * ClineMessage
 */
exports.clineMessageSchema = zod_1.z.object({
	ts: zod_1.z.number(),
	type: zod_1.z.union([zod_1.z.literal("ask"), zod_1.z.literal("say")]),
	ask: exports.clineAskSchema.optional(),
	say: exports.clineSaySchema.optional(),
	text: zod_1.z.string().optional(),
	images: zod_1.z.array(zod_1.z.string()).optional(),
	partial: zod_1.z.boolean().optional(),
	reasoning: zod_1.z.string().optional(),
	conversationHistoryIndex: zod_1.z.number().optional(),
	checkpoint: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
	progressStatus: exports.toolProgressStatusSchema.optional(),
	contextCondense: exports.contextCondenseSchema.optional(),
})
/**
 * TokenUsage
 */
exports.tokenUsageSchema = zod_1.z.object({
	totalTokensIn: zod_1.z.number(),
	totalTokensOut: zod_1.z.number(),
	totalCacheWrites: zod_1.z.number().optional(),
	totalCacheReads: zod_1.z.number().optional(),
	totalCost: zod_1.z.number(),
	contextTokens: zod_1.z.number(),
})
/**
 * ToolName
 */
exports.toolNames = [
	"execute_command",
	"read_file",
	"write_to_file",
	"apply_diff",
	"insert_content",
	"search_and_replace",
	"search_files",
	"list_files",
	"list_code_definition_names",
	"browser_action",
	"use_mcp_tool",
	"access_mcp_resource",
	"ask_followup_question",
	"attempt_completion",
	"switch_mode",
	"new_task",
	"fetch_instructions",
	"web_search",
	"extract_page_content",
	"extract_document_content",
	"search_structured_data",
	"search_code_repositories",
	"get_repository_file_content",
	"process_text_content",
]
exports.toolNamesSchema = zod_1.z.enum(exports.toolNames)
/**
 * WebSearchParams
 */
exports.webSearchParamsSchema = zod_1.z.object({
	tool_name: zod_1.z.literal("web_search"),
	query: zod_1.z.string(),
	engine: zod_1.z.string().optional(),
	num_results: zod_1.z.number().optional(),
})
/**
 * WebSearchResult
 */
exports.webSearchResultSchema = zod_1.z.object({
	title: zod_1.z.string(),
	link: zod_1.z.string().url(),
	snippet: zod_1.z.string(),
})
/**
 * ToolUsage
 */
exports.toolUsageSchema = zod_1.z.record(
	exports.toolNamesSchema,
	zod_1.z.object({
		attempts: zod_1.z.number(),
		failures: zod_1.z.number(),
	}),
)
/**
 * RooCodeEvent
 */
var RooCodeEventName
;(function (RooCodeEventName) {
	RooCodeEventName["Message"] = "message"
	RooCodeEventName["TaskCreated"] = "taskCreated"
	RooCodeEventName["TaskStarted"] = "taskStarted"
	RooCodeEventName["TaskModeSwitched"] = "taskModeSwitched"
	RooCodeEventName["TaskPaused"] = "taskPaused"
	RooCodeEventName["TaskUnpaused"] = "taskUnpaused"
	RooCodeEventName["TaskAskResponded"] = "taskAskResponded"
	RooCodeEventName["TaskAborted"] = "taskAborted"
	RooCodeEventName["TaskSpawned"] = "taskSpawned"
	RooCodeEventName["TaskCompleted"] = "taskCompleted"
	RooCodeEventName["TaskTokenUsageUpdated"] = "taskTokenUsageUpdated"
	RooCodeEventName["TaskToolFailed"] = "taskToolFailed"
})(RooCodeEventName || (exports.RooCodeEventName = RooCodeEventName = {}))
exports.rooCodeEventsSchema = zod_1.z.object({
	[RooCodeEventName.Message]: zod_1.z.tuple([
		zod_1.z.object({
			taskId: zod_1.z.string(),
			action: zod_1.z.union([zod_1.z.literal("created"), zod_1.z.literal("updated")]),
			message: exports.clineMessageSchema,
		}),
	]),
	[RooCodeEventName.TaskCreated]: zod_1.z.tuple([zod_1.z.string()]),
	[RooCodeEventName.TaskStarted]: zod_1.z.tuple([zod_1.z.string()]),
	[RooCodeEventName.TaskModeSwitched]: zod_1.z.tuple([zod_1.z.string(), zod_1.z.string()]),
	[RooCodeEventName.TaskPaused]: zod_1.z.tuple([zod_1.z.string()]),
	[RooCodeEventName.TaskUnpaused]: zod_1.z.tuple([zod_1.z.string()]),
	[RooCodeEventName.TaskAskResponded]: zod_1.z.tuple([zod_1.z.string()]),
	[RooCodeEventName.TaskAborted]: zod_1.z.tuple([zod_1.z.string()]),
	[RooCodeEventName.TaskSpawned]: zod_1.z.tuple([zod_1.z.string(), zod_1.z.string()]),
	[RooCodeEventName.TaskCompleted]: zod_1.z.tuple([
		zod_1.z.string(),
		exports.tokenUsageSchema,
		exports.toolUsageSchema,
	]),
	[RooCodeEventName.TaskTokenUsageUpdated]: zod_1.z.tuple([zod_1.z.string(), exports.tokenUsageSchema]),
	[RooCodeEventName.TaskToolFailed]: zod_1.z.tuple([zod_1.z.string(), exports.toolNamesSchema, zod_1.z.string()]),
})
/**
 * Ack
 */
exports.ackSchema = zod_1.z.object({
	clientId: zod_1.z.string(),
	pid: zod_1.z.number(),
	ppid: zod_1.z.number(),
})
/**
 * TaskCommand
 */
var TaskCommandName
;(function (TaskCommandName) {
	TaskCommandName["StartNewTask"] = "StartNewTask"
	TaskCommandName["CancelTask"] = "CancelTask"
	TaskCommandName["CloseTask"] = "CloseTask"
})(TaskCommandName || (exports.TaskCommandName = TaskCommandName = {}))
exports.taskCommandSchema = zod_1.z.discriminatedUnion("commandName", [
	zod_1.z.object({
		commandName: zod_1.z.literal(TaskCommandName.StartNewTask),
		data: zod_1.z.object({
			configuration: exports.rooCodeSettingsSchema,
			text: zod_1.z.string(),
			images: zod_1.z.array(zod_1.z.string()).optional(),
			newTab: zod_1.z.boolean().optional(),
		}),
	}),
	zod_1.z.object({
		commandName: zod_1.z.literal(TaskCommandName.CancelTask),
		data: zod_1.z.string(),
	}),
	zod_1.z.object({
		commandName: zod_1.z.literal(TaskCommandName.CloseTask),
		data: zod_1.z.string(),
	}),
])
/**
 * TaskEvent
 */
exports.taskEventSchema = zod_1.z.discriminatedUnion("eventName", [
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.Message),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.Message],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskCreated),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskCreated],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskStarted),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskStarted],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskModeSwitched),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskModeSwitched],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskPaused),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskPaused],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskUnpaused),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskUnpaused],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskAskResponded),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskAskResponded],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskAborted),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskAborted],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskSpawned),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskSpawned],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskCompleted),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskCompleted],
	}),
	zod_1.z.object({
		eventName: zod_1.z.literal(RooCodeEventName.TaskTokenUsageUpdated),
		payload: exports.rooCodeEventsSchema.shape[RooCodeEventName.TaskTokenUsageUpdated],
	}),
])
/**
 * IpcMessage
 */
var IpcMessageType
;(function (IpcMessageType) {
	IpcMessageType["Connect"] = "Connect"
	IpcMessageType["Disconnect"] = "Disconnect"
	IpcMessageType["Ack"] = "Ack"
	IpcMessageType["TaskCommand"] = "TaskCommand"
	IpcMessageType["TaskEvent"] = "TaskEvent"
})(IpcMessageType || (exports.IpcMessageType = IpcMessageType = {}))
var IpcOrigin
;(function (IpcOrigin) {
	IpcOrigin["Client"] = "client"
	IpcOrigin["Server"] = "server"
})(IpcOrigin || (exports.IpcOrigin = IpcOrigin = {}))
exports.ipcMessageSchema = zod_1.z.discriminatedUnion("type", [
	zod_1.z.object({
		type: zod_1.z.literal(IpcMessageType.Ack),
		origin: zod_1.z.literal(IpcOrigin.Server),
		data: exports.ackSchema,
	}),
	zod_1.z.object({
		type: zod_1.z.literal(IpcMessageType.TaskCommand),
		origin: zod_1.z.literal(IpcOrigin.Client),
		clientId: zod_1.z.string(),
		data: exports.taskCommandSchema,
	}),
	zod_1.z.object({
		type: zod_1.z.literal(IpcMessageType.TaskEvent),
		origin: zod_1.z.literal(IpcOrigin.Server),
		relayClientId: zod_1.z.string().optional(),
		data: exports.taskEventSchema,
	}),
])
/**
 * ExtractPageContentParams
 */
exports.extractPageContentParamsSchema = zod_1.z.object({
	url: zod_1.z.string(), // Intenção de ser uma URL
	clean_html: zod_1.z.boolean().optional().default(true),
})
/**
 * ExtractDocumentContentParams
 */
exports.extractDocumentContentParamsSchema = zod_1.z.object({
	source: zod_1.z.string(), // Pode ser uma URL ou um caminho de arquivo local.
	document_type: zod_1.z.string().optional(), // Ex: "pdf", "docx", "txt".
})
/**
 * SearchStructuredDataParams
 */
exports.searchStructuredDataParamsSchema = zod_1.z.object({
	file_path: zod_1.z.string(),
	query: zod_1.z.string(),
	criteria: zod_1.z.string().optional(),
	file_type: zod_1.z.string().optional(),
})
/**
 * SearchCodeRepositoriesParams
 */
exports.searchCodeRepositoriesParamsSchema = zod_1.z.object({
	query: zod_1.z.string(),
	platform: zod_1.z.string().optional().default("github"),
	repository: zod_1.z.string().optional(),
	organization: zod_1.z.string().optional(),
	user: zod_1.z.string().optional(),
	per_page: zod_1.z.number().optional(),
	page: zod_1.z.number().optional(),
})
/**
 * ProcessTextContentParams
 */
exports.processTextContentParamsSchema = zod_1.z.object({
	text_content: zod_1.z.string(),
	operation: zod_1.z.string(), // Ex: "fix_markdown", "summarize"
	options: zod_1.z.string().optional(),
})
/**
 * GetRepositoryFileContentParams
 */
exports.getRepositoryFileContentParamsSchema = zod_1.z.object({
	repository_url: zod_1.z.string(),
	file_path: zod_1.z.string(),
	ref: zod_1.z.string().optional(),
	platform: zod_1.z.string().optional().default("github"),
})
exports.typeDefinitions = [
	{ schema: exports.globalSettingsSchema, identifier: "GlobalSettings" },
	{ schema: exports.providerNamesSchema, identifier: "ProviderName" },
	{ schema: exports.providerSettingsSchema, identifier: "ProviderSettings" },
	{ schema: exports.providerSettingsEntrySchema, identifier: "ProviderSettingsEntry" },
	{ schema: exports.clineMessageSchema, identifier: "ClineMessage" },
	{ schema: exports.tokenUsageSchema, identifier: "TokenUsage" },
	{ schema: exports.rooCodeEventsSchema, identifier: "RooCodeEvents" },
	{ schema: exports.ipcMessageSchema, identifier: "IpcMessage" },
	{ schema: exports.taskCommandSchema, identifier: "TaskCommand" },
	{ schema: exports.taskEventSchema, identifier: "TaskEvent" },
	{ schema: exports.processTextContentParamsSchema, identifier: "ProcessTextContentParams" },
	{ schema: exports.SearchApiProviderNameSchema, identifier: "SearchApiProviderName" },
	{ schema: exports.baseSearchApiSettingsSchema, identifier: "BaseSearchApiSettings" },
	{ schema: exports.jinaSearchApiSchema, identifier: "JinaSearchApiSettings" },
	{ schema: exports.googleCustomSearchApiSchema, identifier: "GoogleCustomSearchApiSettings" },
	{ schema: exports.serperApiSchema, identifier: "SerperApiSettings" },
	{ schema: exports.braveSearchApiSchema, identifier: "BraveSearchApiSettings" },
	{ schema: exports.duckduckgoFallbackSearchApiSchema, identifier: "DuckDuckGoFallbackSearchApiSettings" },
	{ schema: exports.searchApiSettingsSchemaDiscriminated, identifier: "SearchApiSettingsDiscriminated" },
	// O tipo SearchApiSettings é inferido, então não adicionamos o schema diretamente,
	// mas sim o schema do qual ele é inferido para que o tipo seja gerado.
]
// Also export as default for ESM compatibility.
exports.default = { typeDefinitions: exports.typeDefinitions }
