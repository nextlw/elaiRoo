import React from "react"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
import { t } from "i18next"
import type { SearchApiSettings } from "@roo-code/types"

// Definindo os campos específicos para Google Custom Search
interface GoogleCustomSearchSpecificSettings {
	apiKey?: string
	cxId?: string
}

interface GoogleCustomSearchProviderSettingsProps {
	searchApiConfiguration: SearchApiSettings | undefined
	setSearchApiConfigurationField: (fieldName: string, value: any) => void
	disabled?: boolean
}

const GoogleCustomSearchProviderSettings: React.FC<GoogleCustomSearchProviderSettingsProps> = ({
	searchApiConfiguration,
	setSearchApiConfigurationField,
	disabled,
}) => {
	const googleConfig =
		searchApiConfiguration?.searchApiProviderName === "google_custom_search"
			? (searchApiConfiguration as GoogleCustomSearchSpecificSettings)
			: undefined

	const handleFieldChange = (field: keyof GoogleCustomSearchSpecificSettings, value: string) => {
		// As propriedades são de primeiro nível para este provedor no schema unificado
		setSearchApiConfigurationField(field, value)
	}

	if (!googleConfig) {
		return null // Não renderiza nada se a configuração não for para Google Custom Search
	}

	return (
		<>
			<VSCodeTextField
				aria-label={t("webview.settings.searchProviders.google.apiKeyLabel", "Google API Key")}
				type="password"
				value={googleConfig?.apiKey || ""}
				onInput={(e: any) => handleFieldChange("apiKey", e.target.value)}
				disabled={disabled}
				className="mb-3"
			/>

			<VSCodeTextField
				aria-label={t(
					"webview.settings.searchProviders.google.cxIdLabel",
					"Google Programmable Search Engine ID (cx)",
				)}
				value={googleConfig?.cxId || ""}
				onInput={(e: any) => handleFieldChange("cxId", e.target.value)}
				disabled={disabled}
				className="mb-3"
			/>
		</>
	)
}

export default GoogleCustomSearchProviderSettings
