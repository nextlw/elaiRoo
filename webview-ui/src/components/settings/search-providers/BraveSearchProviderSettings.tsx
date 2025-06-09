import React from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { t } from "i18next"
import type { SearchApiSettings } from "@roo-code/types"

// Definindo os campos específicos para Brave Search
interface BraveSpecificSettings {
	apiKey?: string
}

interface BraveSearchProviderSettingsProps {
	searchApiConfiguration: SearchApiSettings | undefined
	setSearchApiConfigurationField: (fieldName: string, value: any) => void
	disabled?: boolean
}

const BraveSearchProviderSettings: React.FC<BraveSearchProviderSettingsProps> = ({
	searchApiConfiguration,
	setSearchApiConfigurationField,
	disabled,
}) => {
	const braveConfig =
		searchApiConfiguration?.searchApiProviderName === "brave_search"
			? (searchApiConfiguration as BraveSpecificSettings)
			: undefined

	const handleFieldChange = (field: keyof BraveSpecificSettings, value: string) => {
		setSearchApiConfigurationField(field, value)
	}

	if (!braveConfig) {
		return null // Não renderiza nada se a configuração não for para Brave Search
	}

	return (
		<>
			<VSCodeTextField
				type="password"
				value={braveConfig?.apiKey || ""}
				onInput={(e: any) => handleFieldChange("apiKey", e.target.value)}
				disabled={disabled}
				style={{ width: "100%", marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.brave.apiKeyLabel", "Brave Search API Key")}
			</VSCodeTextField>
		</>
	)
}

export default BraveSearchProviderSettings
