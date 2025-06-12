/**
 * Configurações e timeouts para a ferramenta web_search
 */
export const WEB_SEARCH_CONFIG = {
	// Timeouts de requisições (em ms)
	TIMEOUTS: {
		JINA_SEARCH: 8000, // Timeout para busca inicial Jina
		JINA_RERANK: 6000, // Timeout para reranking Jina
		JINA_EMBEDDING: 6000, // Timeout para embeddings Jina
		SETTINGS_INIT: 3000, // Timeout para inicialização de settings
		DEEP_RESEARCH_CHECK: 2000, // Timeout para verificar disponibilidade Deep Research
		BROWSER_PAGE_LOAD: 15000, // Timeout para carregamento de página (DuckDuckGo)
	},

	// Configurações de fallback
	FALLBACK: {
		ENABLE_QUICK_FAIL: true, // Habilita fallback rápido em caso de erro
		MAX_RETRIES: 1, // Máximo de tentativas antes de fallback
		ENABLE_DEEP_RESEARCH: false, // Desabilitar Deep Research por padrão para evitar delays
	},

	// Configurações de logging
	LOGGING: {
		ENABLE_DEBUG: true, // Habilita logs detalhados
		LOG_REQUEST_DETAILS: true, // Log detalhes das requisições
	},
}

/**
 * Função para atualizar configurações dinamicamente
 */
export function updateWebSearchConfig(updates: Partial<typeof WEB_SEARCH_CONFIG>) {
	Object.assign(WEB_SEARCH_CONFIG, updates)
}
