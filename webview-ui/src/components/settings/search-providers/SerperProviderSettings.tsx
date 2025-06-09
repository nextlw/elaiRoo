import React from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { t } from "i18next"
import type { SearchApiSettings } from "@roo-code/types"

// Definindo os campos específicos para Serper
interface SerperSpecificSettings {
	apiKey?: string
}

interface SerperProviderSettingsProps {
	searchApiConfiguration: SearchApiSettings | undefined
	setSearchApiConfigurationField: (fieldName: string, value: any) => void
	disabled?: boolean
}

const SerperProviderSettings: React.FC<SerperProviderSettingsProps> = ({
	searchApiConfiguration,
	setSearchApiConfigurationField,
	disabled,
}) => {
	const serperConfig =
		searchApiConfiguration?.searchApiProviderName === "serper"
			? (searchApiConfiguration as SerperSpecificSettings)
			: undefined

	const handleFieldChange = (field: keyof SerperSpecificSettings, value: string) => {
		setSearchApiConfigurationField(field, value)
	}

	if (!serperConfig) {
		return null // Não renderiza nada se a configuração não for para Serper
	}

	return (
		<>
			<VSCodeTextField
				type="password"
				value={serperConfig?.apiKey || ""}
				onInput={(e: any) => handleFieldChange("apiKey", e.target.value)}
				disabled={disabled}
				style={{ width: "100%", marginBottom: "10px" }}>
				{t("webview.settings.searchProviders.serper.apiKeyLabel", "Serper API Key")}
			</VSCodeTextField>
		</>
	)
}

export default SerperProviderSettings
