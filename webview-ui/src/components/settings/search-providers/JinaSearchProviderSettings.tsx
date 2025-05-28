import React from "react"
import { VSCodeTextField, VSCodeCheckbox, VSCodeDivider } from "@vscode/webview-ui-toolkit/react"
import { t } from "i18next"
import { SearchApiSettings } from "@roo-code/types"

interface JinaSpecificSettings {
	apiKey?: string
	searchEndpoint?: string
	enableReranking?: boolean
	rerankModel?: string
	rerankEndpoint?: string
	enableResultEmbeddings?: boolean
	embeddingModel?: string
	embeddingEndpoint?: string
	embeddingTaskForResult?: string
	embeddingDimensions?: number
}

interface JinaSearchProviderSettingsProps {
	searchApiConfiguration: SearchApiSettings | undefined
	setSearchApiConfigurationField: (fieldName: string, value: any) => void
	disabled?: boolean
}

const JinaSearchProviderSettings: React.FC<JinaSearchProviderSettingsProps> = ({
	searchApiConfiguration,
	setSearchApiConfigurationField,
	disabled,
}) => {
	// As propriedades do Jina estão diretamente no objeto searchApiConfiguration
	// quando searchApiProviderName é "jina".
	const jinaConfig =
		searchApiConfiguration?.searchApiProviderName === "jina"
			? (searchApiConfiguration as JinaSpecificSettings) // Cast para o tipo específico do Jina
			: undefined

	const handleFieldChange = (field: keyof JinaSpecificSettings, value: any, isNumeric: boolean = false) => {
		// Não prefixar com "jina." pois as propriedades são de primeiro nível
		console.log(`[JinaSearchProviderSettings] handleFieldChange - field: ${field}, raw value:`, value)
		// Adicionar um log para o evento completo se o valor for um objeto (para inspecionar e.target)
		if (typeof value === "object" && value !== null) {
			console.log(
				`[JinaSearchProviderSettings] handleFieldChange - field: ${field}, event object received as value:`,
				value,
			)
		}
		setSearchApiConfigurationField(
			field,
			isNumeric ? (value === "" ? undefined : Number(value)) : value === "" ? "" : value,
		)
	}

	const handleCheckboxChange = (field: keyof JinaSpecificSettings, checked: boolean) => {
		// Não prefixar com "jina."
		setSearchApiConfigurationField(field, checked)
	}

	if (!jinaConfig) {
		// Renderiza nada ou uma mensagem de erro/carregamento se a configuração não for para Jina
		// ou não estiver disponível. Isso evita erros ao tentar acessar jinaConfig?.propriedade.
		return null
	}

	return (
		<>
			<VSCodeTextField
				type="password"
				value={jinaConfig?.apiKey || ""}
				onInput={(e: any) => handleFieldChange("apiKey", e.target.value)}
				disabled={disabled}
				style={{ width: "100%", marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.jina.apiKeyLabel", "Jina API Key")}
			</VSCodeTextField>

			<VSCodeTextField
				value={
					jinaConfig?.searchEndpoint === undefined ? "https://s.jina.ai/search" : jinaConfig.searchEndpoint
				}
				onInput={(e: any) => handleFieldChange("searchEndpoint", e.target.value)}
				disabled={disabled}
				style={{ width: "100%", marginBottom: "20px" }}>
				{t("webview.settings.searchProviders.jina.searchEndpointLabel", "Search Endpoint")}
			</VSCodeTextField>

			<VSCodeDivider style={{ marginBottom: "20px" }} />

			<h4 style={{ marginTop: "0", marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.jina.rerankingTitle", "Reranking")}
			</h4>
			<VSCodeCheckbox
				checked={jinaConfig?.enableReranking === undefined ? false : jinaConfig.enableReranking}
				onChange={(e: any) => handleCheckboxChange("enableReranking", e.target.checked)}
				disabled={disabled}
				style={{ marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.jina.enableRerankingLabel", "Enable Reranking")}
			</VSCodeCheckbox>

			{jinaConfig?.enableReranking && (
				<>
					<VSCodeTextField
						value={
							jinaConfig?.rerankModel === undefined ? "jina-reranker-v1-turbo-en" : jinaConfig.rerankModel
						}
						onInput={(e: any) => handleFieldChange("rerankModel", e.target.value)}
						disabled={disabled}
						style={{ width: "100%", marginBottom: "10px", marginLeft: "20px" }}>
						{t("webview.settings.searchProviders.jina.rerankModelLabel", "Rerank Model")}
					</VSCodeTextField>
					<VSCodeTextField
						value={
							jinaConfig?.rerankEndpoint === undefined
								? "https://s.jina.ai/rerank"
								: jinaConfig.rerankEndpoint
						}
						onInput={(e: any) => handleFieldChange("rerankEndpoint", e.target.value)}
						disabled={disabled}
						style={{ width: "100%", marginBottom: "20px", marginLeft: "20px" }}>
						{t("webview.settings.searchProviders.jina.rerankEndpointLabel", "Rerank Endpoint")}
					</VSCodeTextField>
				</>
			)}

			<VSCodeDivider style={{ marginBottom: "20px" }} />

			<h4 style={{ marginTop: "0", marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.jina.resultEmbeddingsTitle", "Result Embeddings")}
			</h4>
			<VSCodeCheckbox
				checked={jinaConfig?.enableResultEmbeddings === undefined ? false : jinaConfig.enableResultEmbeddings}
				onChange={(e: any) => handleCheckboxChange("enableResultEmbeddings", e.target.checked)}
				disabled={disabled}
				style={{ marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.jina.enableResultEmbeddingsLabel", "Enable Result Embeddings")}
			</VSCodeCheckbox>

			{jinaConfig?.enableResultEmbeddings && (
				<>
					<VSCodeTextField
						value={
							jinaConfig?.embeddingModel === undefined
								? "jina-embeddings-v2-base-en"
								: jinaConfig.embeddingModel
						}
						onInput={(e: any) => handleFieldChange("embeddingModel", e.target.value)}
						disabled={disabled}
						style={{ width: "100%", marginBottom: "10px", marginLeft: "20px" }}>
						{t("webview.settings.searchProviders.jina.embeddingModelLabel", "Embedding Model")}
					</VSCodeTextField>
					<VSCodeTextField
						value={
							jinaConfig?.embeddingEndpoint === undefined
								? "https://s.jina.ai/embed"
								: jinaConfig.embeddingEndpoint
						}
						onInput={(e: any) => handleFieldChange("embeddingEndpoint", e.target.value)}
						disabled={disabled}
						style={{ width: "100%", marginBottom: "10px", marginLeft: "20px" }}>
						{t("webview.settings.searchProviders.jina.embeddingEndpointLabel", "Embedding Endpoint")}
					</VSCodeTextField>
					<VSCodeTextField
						value={
							jinaConfig?.embeddingTaskForResult === undefined
								? "search_document"
								: jinaConfig.embeddingTaskForResult
						}
						onInput={(e: any) => handleFieldChange("embeddingTaskForResult", e.target.value)}
						disabled={disabled}
						style={{ width: "100%", marginBottom: "10px", marginLeft: "20px" }}>
						{t(
							"webview.settings.searchProviders.jina.embeddingTaskForResultLabel",
							"Embedding Task for Results",
						)}
					</VSCodeTextField>
					<VSCodeTextField
						value={
							jinaConfig?.embeddingDimensions === undefined
								? "768"
								: String(jinaConfig.embeddingDimensions)
						}
						onInput={(e: any) => handleFieldChange("embeddingDimensions", e.target.value, true)}
						disabled={disabled}
						style={{ width: "100%", marginBottom: "10px", marginLeft: "20px" }}>
						{t("webview.settings.searchProviders.jina.embeddingDimensionsLabel", "Embedding Dimensions")}
					</VSCodeTextField>
				</>
			)}
		</>
	)
}

export default JinaSearchProviderSettings
