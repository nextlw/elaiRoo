import { useMemo, useState } from "react"
import { CaretDownIcon, CaretUpIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import { useTranslation } from "react-i18next"
import MarkdownBlock from "../common/MarkdownBlock"

interface WebSearchResult {
	url: string
	title: string
	snippet: string
	score?: number
	boosts?: Record<string, number>
}

interface WebSearchResultsBlockProps {
	results: WebSearchResult[]
	isCollapsed?: boolean
	onToggleCollapse?: () => void
}

export const WebSearchResultsBlock = ({
	results,
	isCollapsed = false,
	onToggleCollapse,
}: WebSearchResultsBlockProps) => {
	const { t } = useTranslation("chat")
	const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)

	const groupedResults = useMemo(() => {
		const groups: Record<string, WebSearchResult[]> = {}

		results.forEach((result) => {
			let domain = ""
			try {
				domain = new URL(result.url).hostname
			} catch {
				domain = "invalid-url"
			}
			if (!groups[domain]) {
				groups[domain] = []
			}
			groups[domain].push(result)
		})

		return Object.entries(groups)
	}, [results])

	return (
		<div className="bg-vscode-editor-background border border-vscode-border rounded-lg overflow-hidden">
			<div
				className="flex items-center justify-between gap-1 px-3 py-2 cursor-pointer text-muted-foreground"
				onClick={onToggleCollapse}>
				<div className="flex items-center gap-2 flex-1">
					<span>{t("chat:web_search.results")}</span>
					<button
						className="hover:bg-vscode-button-secondaryHoverBackground px-2 py-1 rounded"
						onClick={(e) => {
							e.stopPropagation()
							setShowTechnicalDetails(!showTechnicalDetails)
						}}
						title={t("chat:web_search.toggleDetails")}>
						<InfoCircledIcon className="w-4 h-4" />
					</button>
				</div>
				<div className="flex items-center gap-1">{isCollapsed ? <CaretDownIcon /> : <CaretUpIcon />}</div>
			</div>

			{!isCollapsed && (
				<div className="px-3 max-h-[320px] overflow-y-auto">
					{groupedResults.map(([domain, items]) => (
						<div key={domain} className="mb-4">
							<div className="flex items-center gap-2 mb-2">
								<img
									src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
									alt={`${domain} favicon`}
									className="w-4 h-4"
								/>
								<span className="text-sm font-medium text-vscode-descriptionForeground">{domain}</span>
							</div>

							{items.map((result, index) => (
								<div key={`${domain}-${index}`} className="ml-2 mb-3">
									<a
										href={result.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-vscode-textLink-foreground hover:underline block text-sm font-medium">
										{result.title}
									</a>
									<MarkdownBlock markdown={result.snippet} />
									{showTechnicalDetails && result.score && (
										<div className="mt-1 text-xs text-vscode-disabledForeground">
											Score: {result.score.toFixed(2)}
											{result.boosts &&
												Object.entries(result.boosts).map(([key, value]) => (
													<div key={key}>
														{key}: {value.toFixed(2)}
													</div>
												))}
										</div>
									)}
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
