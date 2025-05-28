import React from "react"
import { t } from "i18next" // Agora será usado
import type { SearchApiSettings } from "@roo-code/types"

interface DuckDuckGoFallbackProviderSettingsProps {
	searchApiConfiguration: SearchApiSettings | undefined
	setSearchApiConfigurationField?: (fieldName: string, value: any) => void // Tornando opcional
	disabled?: boolean
}

const GlobeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		style={{ width: "48px", height: "48px", marginBottom: "10px" }}>
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93L15 8h-3V4.07zm0 5.86h3l.87.93c.13.87.45 1.84.93 2.87H13V9.93zm0 5.86h3c-.48.93-1.07 1.8-1.8 2.45l-.93.55V15.79zm8 .93c-.49 3.95-3.85 7-7.93 7s-7.44-3.05-7.93-7H4.07c.13-1.03.45-2 .93-2.87L8 13v-2L5 8.13c.87-.48 1.84-1.07 2.87-1.8L11 5V2.07c3.95.49 7 3.85 7 7.93s-3.05 7.44-7 7.93z" />
	</svg>
)

const DuckDuckGoFallbackProviderSettings: React.FC<DuckDuckGoFallbackProviderSettingsProps> = ({
	searchApiConfiguration,
	// setSearchApiConfigurationField, // Não usado
	// disabled, // Não usado
}) => {
	const isDuckDuckGo = searchApiConfiguration?.searchApiProviderName === "duckduckgo_fallback"

	if (!isDuckDuckGo) {
		return null
	}

	return (
		<div
			style={{
				border: "1px solid var(--vscode-settings-textInputBorder, var(--vscode-input-border, #ced4da))",
				borderRadius: "16px",
				padding: "20px",
				textAlign: "center",
				marginTop: "10px",
				backgroundColor: "var(--vscode-editorWidget-background, var(--vscode-sideBar-background, #f3f3f3))",
			}}>
			<GlobeIcon />
			<p style={{ fontSize: "var(--vscode-font-size)", color: "var(--vscode-descriptionForeground)", margin: 0 }}>
				{t(
					"webview.settings.searchProviders.duckduckgo.info",
					"DuckDuckGo (Fallback) is enabled as a search option and does not require additional API key configuration.",
				)}
			</p>
		</div>
	)
}

export default DuckDuckGoFallbackProviderSettings
