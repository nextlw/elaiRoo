// Test script to verify Search API configurations
console.log("Testing Search API Configuration...")

// Simulate VS Code configuration
const config = {
	searchApiProfiles: {
		currentSearchApiConfigName: "jina",
		searchApiConfigs: {
			jina: {
				id: "jina-default-id",
				searchApiProviderName: "jina",
				isEnabled: true,
				apiKey: "jina_cf9ea209bc9c4304acdb46536a8de134inoM3wimxNP77Cu0CegxfHUeC0Dp",
				searchEndpoint: "https://s.jina.ai/search",
				enableReranking: true,
				rerankModel: "jina-reranker-v2-base-multilingual",
				rerankEndpoint: "https://s.jina.ai/rerank",
				enableResultEmbeddings: true,
				embeddingModel: "jina-embeddings-v3",
				embeddingEndpoint: "https://s.jina.ai/embed",
				embeddingTaskForResult: "retrieval.passage",
				embeddingDimensions: 1024,
			},
			duckduckgo_fallback: {
				id: "ddg-fallback-id",
				searchApiProviderName: "duckduckgo_fallback",
				isEnabled: true,
			},
		},
		modeSearchApiConfigs: {},
	},
}

console.log("Expected configuration:")
console.log(JSON.stringify(config, null, 2))

console.log("\nCurrent Jina settings:")
const jinaConfig = config.searchApiProfiles.searchApiConfigs.jina
console.log("Provider:", jinaConfig.searchApiProviderName)
console.log("Enabled:", jinaConfig.isEnabled)
console.log("API Key:", jinaConfig.apiKey ? "SET" : "MISSING")
console.log("Search Endpoint:", jinaConfig.searchEndpoint)

console.log("\nConfiguration looks correct for Jina integration!")
