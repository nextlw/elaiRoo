import { useEffect, useRef, useState } from "react"
import { CaretDownIcon, CaretUpIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { useTranslation } from "react-i18next"

interface SearchResult {
	title: string
	url: string
	snippet?: string
	favicon?: string
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

	const getStatusMessage = () => {
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
			<div
				className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-vscode-list-hoverBackground transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}>
				<div className="flex items-center gap-2 flex-1">
					<MagnifyingGlassIcon
						className={`text-muted-foreground ${status === "searching" ? "animate-pulse" : ""}`}
					/>
					<span className="text-sm truncate">{getStatusMessage()}</span>
				</div>
				<div className="flex items-center gap-2">
					{status === "searching" && (
						<div className="flex space-x-1">
							<div className="w-1 h-1 bg-vscode-foreground rounded-full animate-pulse" />
							<div className="w-1 h-1 bg-vscode-foreground rounded-full animate-pulse [animation-delay:200ms]" />
							<div className="w-1 h-1 bg-vscode-foreground rounded-full animate-pulse [animation-delay:400ms]" />
						</div>
					)}
					{isExpanded ? <CaretUpIcon /> : <CaretDownIcon />}
				</div>
			</div>

			{isExpanded && (
				<div
					className={`border-t border-vscode-border transition-all duration-200 ${
						!isExpanded ? "max-h-0 opacity-0" : "max-h-[300px] opacity-100"
					}`}>
					{error ? (
						<div className="px-3 py-2 text-sm text-red-500">{error}</div>
					) : (
						<div className="max-h-[240px] overflow-y-auto">
							{results.length === 0 && status === "searching" && (
								<div className="px-3 py-4 text-center text-sm text-muted-foreground">
									{t("webSearch.searchingWeb")}
								</div>
							)}
							{results.map((result, index) => {
								const isCurrentlyReading = currentReadingUrl === result.url
								const favicon = result.favicon || getFaviconUrl(result.url)

								return (
									<div
										key={result.url}
										className={`px-3 py-2 border-b border-vscode-border last:border-b-0 transition-all duration-300 ${
											isCurrentlyReading
												? "bg-vscode-list-activeSelectionBackground"
												: result.isRead
													? "opacity-60"
													: "hover:bg-vscode-list-hoverBackground"
										} animate-in slide-in-from-left-5 fade-in duration-300`}
										style={{ animationDelay: `${index * 100}ms` }}>
										<div className="flex items-start gap-2">
											{favicon ? (
												<img
													src={favicon}
													alt=""
													className="w-4 h-4 mt-0.5"
													onError={(e) => {
														// Fallback to Google favicon service
														const target = e.currentTarget as HTMLImageElement
														if (!target.dataset.fallback) {
															target.dataset.fallback = "true"
															target.src = getFaviconUrl(result.url) || ""
														} else {
															target.style.display = "none"
														}
													}}
												/>
											) : (
												<div className="w-4 h-4 mt-0.5 bg-vscode-foreground opacity-20 rounded-sm" />
											)}
											<div className="flex-1 min-w-0">
												<a
													href={result.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm font-medium text-vscode-textLink-foreground hover:underline block truncate">
													{result.title || "Untitled"}
												</a>
												{result.snippet && (
													<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
														{result.snippet}
													</p>
												)}
											</div>
											{isCurrentlyReading && (
												<div className="ml-2 flex items-center gap-1 text-xs text-vscode-descriptionForeground">
													<MagnifyingGlassIcon className="w-4 h-4 animate-spin" />
													<span>{t("webSearch.reading")}</span>
												</div>
											)}
											{status === "completed" && result.isRead && !isCurrentlyReading && (
												<div className="w-2 h-2 bg-green-500 rounded-full ml-2 mt-1.5" />
											)}
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
