import { useCallback, useEffect, useRef, useState } from "react"
import { MagnifyingGlassIcon, ReloadIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import { useTranslation } from "react-i18next"
import MarkdownBlock from "../common/MarkdownBlock"
import { vscode } from "../../utils/vscode"

interface SearchResult {
	title: string
	url: string
	snippet?: string
	favicon?: string
	isReading?: boolean
	isRead?: boolean
}

interface WebSearchBlockProps {
	query: string
	results?: SearchResult[]
	status?: "searching" | "reading" | "completed" | "error"
	error?: string
	currentReadingUrl?: string
}

export const WebSearchBlock = ({
	query,
	results = [],
	status = "searching",
	error,
	currentReadingUrl,
}: WebSearchBlockProps) => {
	const { t } = useTranslation("chat")
	const [isExpanded, setIsExpanded] = useState(true)

	const getStatusIcon = () => {
		switch (status) {
			case "searching":
			case "reading":
				return <ReloadIcon className="animate-spin" />
			case "completed":
				return <CheckIcon />
			case "error":
				return <Cross2Icon />
			default:
				return <MagnifyingGlassIcon />
		}
	}

	const getStatusText = () => {
		switch (status) {
			case "searching":
				return t("webSearch.searching", { query })
			case "reading":
				return t("webSearch.readingContent")
			case "completed":
				return t("webSearch.completed", { count: results.length })
			case "error":
				return t("webSearch.error")
			default:
				return t("webSearch.preparing")
		}
	}

	const getFaviconUrl = (url: string) => {
		try {
			const domain = new URL(url).hostname
			return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
		} catch {
			return null
		}
	}

	return (
		<div className="bg-vscode-editor-background border border-vscode-border rounded-lg overflow-hidden mb-2">
			{/* Header */}
			<div
				className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-vscode-list-hoverBackground transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}>
				<div className="flex items-center gap-2 flex-1">
					<div className="flex items-center gap-1 text-vscode-foreground">{getStatusIcon()}</div>
					<span className="text-sm font-medium truncate">{getStatusText()}</span>
				</div>
				<span className={`codicon codicon-chevron-${isExpanded ? "up" : "down"}`} />
			</div>

			{/* Content */}
			{isExpanded && (
				<div className="border-t border-vscode-border">
					{/* Query Display */}
					<div className="px-3 py-2 bg-vscode-editor-inactiveSelectionBackground">
						<div className="flex items-center gap-2">
							<MagnifyingGlassIcon className="text-vscode-descriptionForeground" />
							<span className="text-sm text-vscode-descriptionForeground">Query:</span>
							<span className="text-sm font-medium">{query}</span>
						</div>
					</div>

					{/* Error Display */}
					{error && (
						<div className="px-3 py-2 bg-vscode-inputValidation-errorBackground text-vscode-errorForeground">
							<p className="text-sm">{error}</p>
						</div>
					)}

					{/* Results List */}
					{results.length > 0 && (
						<div className="max-h-96 overflow-y-auto">
							{results.map((result, index) => {
								const isCurrentlyReading = currentReadingUrl === result.url
								const favicon = result.favicon || getFaviconUrl(result.url)

								return (
									<div
										key={index}
										className={`px-3 py-2 border-b border-vscode-border last:border-b-0 transition-all duration-300 ${
											isCurrentlyReading
												? "bg-vscode-list-activeSelectionBackground"
												: result.isRead
													? "opacity-60"
													: "hover:bg-vscode-list-hoverBackground"
										}`}>
										<div className="flex items-start gap-2">
											{/* Favicon and Status */}
											<div className="flex items-center mt-0.5 relative">
												{favicon && (
													<img
														src={favicon}
														alt=""
														className="w-4 h-4"
														onError={(e) => {
															e.currentTarget.style.display = "none"
														}}
													/>
												)}
												{!favicon && <span className="codicon codicon-globe w-4 h-4" />}

												{/* Reading indicator overlay */}
												{isCurrentlyReading && (
													<div className="absolute inset-0 flex items-center justify-center">
														<div className="w-4 h-4 bg-vscode-progressBar-background rounded-full animate-ping" />
													</div>
												)}

												{/* Read checkmark */}
												{result.isRead && !isCurrentlyReading && (
													<CheckIcon className="absolute -right-1 -bottom-1 w-3 h-3 text-vscode-testing-iconPassed bg-vscode-editor-background rounded-full" />
												)}
											</div>

											{/* Content */}
											<div className="flex-1 min-w-0">
												<a
													href={result.url}
													className="text-sm font-medium text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground hover:underline block truncate"
													onClick={(e) => {
														e.preventDefault()
														// Open URL in browser
														window.open(result.url, "_blank")
													}}>
													{result.title}
												</a>
												{result.snippet && (
													<p className="text-xs text-vscode-descriptionForeground mt-1 line-clamp-2">
														{result.snippet}
													</p>
												)}
												<p className="text-xs text-vscode-descriptionForeground opacity-60 mt-1 truncate">
													{result.url}
												</p>
											</div>

											{/* Reading animation */}
											{isCurrentlyReading && (
												<div className="flex items-center gap-1 text-xs text-vscode-descriptionForeground">
													<ReloadIcon className="animate-spin" />
													<span>{t("webSearch.reading")}</span>
												</div>
											)}
										</div>
									</div>
								)
							})}
						</div>
					)}

					{/* Loading State */}
					{status === "searching" && results.length === 0 && (
						<div className="px-3 py-8 text-center">
							<ReloadIcon className="animate-spin mx-auto mb-2" />
							<p className="text-sm text-vscode-descriptionForeground">{t("webSearch.searchingWeb")}</p>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
