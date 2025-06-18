import React, { memo, useCallback, useEffect } from "react"
// import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react" // Usaremos VSCodeDropdown diretamente por enquanto

import type {
	SearchApiSettings,
	SearchApiProviderName,
	jinaSearchApiSchema,
	googleCustomSearchApiSchema,
	serperApiSchema,
	braveSearchApiSchema,
	duckduckgoFallbackSearchApiSchema,
} from "@roo-code/types"
import JinaSearchProviderSettings from "./search-providers/JinaSearchProviderSettings"
import GoogleCustomSearchProviderSettings from "./search-providers/GoogleCustomSearchProviderSettings"
import SerperProviderSettings from "./search-providers/SerperProviderSettings"
import BraveSearchProviderSettings from "./search-providers/BraveSearchProviderSettings"
import DuckDuckGoFallbackProviderSettings from "./search-providers/DuckDuckGoFallbackProviderSettings"
import type { z } from "zod"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui"

export interface SearchApiOptionsProps {
	searchApiConfiguration: SearchApiSettings | undefined
	setSearchApiConfigurationField: (fieldName: keyof SearchApiSettings | string, value: any) => void
	disabled?: boolean
}

const SEARCH_API_PROVIDERS: { value: SearchApiProviderName; label: string }[] = [
	{ value: "jina", label: "Jina AI" },
	{ value: "google_custom_search", label: "Google Custom Search" },
	{ value: "serper", label: "Serper" },
	{ value: "brave_search", label: "Brave Search" },
	{ value: "duckduckgo_fallback", label: "DuckDuckGo (Fallback)" },
]

const SearchApiOptions = ({
	searchApiConfiguration,
	setSearchApiConfigurationField,
	disabled,
}: SearchApiOptionsProps) => {
	const { t } = useAppTranslation()

	const selectedProvider = searchApiConfiguration?.searchApiProviderName
	//"O provedor de API de busca selecionado, é obtido da configuração
	// da API de busca, se essa configuração existir."

	const onProviderChange = useCallback(
		(value: string | SearchApiProviderName) => {
			setSearchApiConfigurationField("searchApiProviderName", value as SearchApiProviderName)
			// Poderíamos adicionar lógica aqui para definir configurações padrão para o novo provedor, se necessário.
		},
		[setSearchApiConfigurationField],
	)

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1 relative">
				<label className="block font-medium mb-1">{t("settings:searchApiOptions.apiProviderLabel")}</label>
				<Select
					value={selectedProvider}
					onValueChange={(value) => onProviderChange(value as SearchApiProviderName)}
					disabled={disabled}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={t("settings:common.select")} />
					</SelectTrigger>
					<SelectContent>
						{SEARCH_API_PROVIDERS.map(({ value, label }) => (
							<SelectItem key={value} value={value} disabled={disabled}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Renderização condicional dos componentes de configuração do provedor */}
			{selectedProvider === "jina" && (
				<JinaSearchProviderSettings
					searchApiConfiguration={searchApiConfiguration as z.infer<typeof jinaSearchApiSchema>}
					setSearchApiConfigurationField={setSearchApiConfigurationField}
					disabled={disabled}
				/>
			)}
			{selectedProvider === "google_custom_search" && (
				<GoogleCustomSearchProviderSettings
					searchApiConfiguration={searchApiConfiguration as z.infer<typeof googleCustomSearchApiSchema>}
					setSearchApiConfigurationField={setSearchApiConfigurationField}
					disabled={disabled}
				/>
			)}
			{selectedProvider === "serper" && (
				<SerperProviderSettings
					searchApiConfiguration={searchApiConfiguration as z.infer<typeof serperApiSchema>}
					setSearchApiConfigurationField={setSearchApiConfigurationField}
					disabled={disabled}
				/>
			)}
			{selectedProvider === "brave_search" && (
				<BraveSearchProviderSettings
					searchApiConfiguration={searchApiConfiguration as z.infer<typeof braveSearchApiSchema>}
					setSearchApiConfigurationField={setSearchApiConfigurationField}
					disabled={disabled}
				/>
			)}
			{selectedProvider === "duckduckgo_fallback" && (
				<DuckDuckGoFallbackProviderSettings
					searchApiConfiguration={searchApiConfiguration as z.infer<typeof duckduckgoFallbackSearchApiSchema>}
					setSearchApiConfigurationField={setSearchApiConfigurationField}
					disabled={disabled}
				/>
			)}
		</div>
	)
}

export default memo(SearchApiOptions)
