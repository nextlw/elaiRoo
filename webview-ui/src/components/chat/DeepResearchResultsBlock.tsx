import { useCallback, useEffect, useRef, useState } from "react"
import { CaretDownIcon, CaretUpIcon, InfoCircledIcon, LightningBoltIcon } from "@radix-ui/react-icons"
import { useTranslation } from "react-i18next"
import MarkdownBlock from "../common/MarkdownBlock"

interface DeepResearchReference {
	exactQuote: string
	url: string
	dateTime?: string
}

interface DeepResearchData {
	think?: string
	reasoning?: string
	references?: DeepResearchReference[]
	visitedURLs?: string[]
	readURLs?: string[]
	allURLs?: string[]
}

interface WebSearchResult {
	url: string
	title: string
	snippet: string
	score?: number
	provider?: string
	deepResearchData?: DeepResearchData
}

interface DeepResearchResultsBlockProps {
	results: WebSearchResult[]
	provider: string
	query: string
	isCollapsed?: boolean
	onToggleCollapse?: () => void
}

export const DeepResearchResultsBlock = ({
	results,
	provider,
	query,
	isCollapsed = false,
	onToggleCollapse,
}: DeepResearchResultsBlockProps) => {
	const contentRef = useRef<HTMLDivElement>(null)
	const { t } = useTranslation("chat")
	const [showTechnicalDetails, setShowTechnicalDetails] = useState(false)
	const [showThinking, setShowThinking] = useState(true)
	const [showReferences, setShowReferences] = useState(true)

	const deepResearchData = results.find((r) => r.deepResearchData)?.deepResearchData
	const isDeepResearch = provider === "deep_research_fallback"

	useEffect(() => {
		if (contentRef.current && !isCollapsed) {
			contentRef.current.scrollTop = contentRef.current.scrollHeight
		}
	}, [results, isCollapsed])

	const handleToggleTechnicalDetails = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			setShowTechnicalDetails(!showTechnicalDetails)
		},
		[showTechnicalDetails],
	)

	const handleToggleThinking = useCallback(() => {
		setShowThinking(!showThinking)
	}, [showThinking])

	const handleToggleReferences = useCallback(() => {
		setShowReferences(!showReferences)
	}, [showReferences])

	return (
		<div className="bg-vscode-editor-background border border-vscode-border rounded-lg overflow-hidden">
			<div
				className="flex items-center justify-between gap-1 px-3 py-2 cursor-pointer text-muted-foreground"
				onClick={onToggleCollapse}>
				<div className="flex items-center gap-2 flex-1">
					{isDeepResearch && <LightningBoltIcon className="w-4 h-4 text-blue-400" />}
					<span className="font-medium">
						{isDeepResearch
							? `🧠 ${t("chat:web_search.deepResearchResults")}`
							: t("chat:web_search.results")}
					</span>
					<span className="text-xs opacity-70">({results.length} resultados)</span>
					<span className="text-xs opacity-60 ml-2 max-w-[200px] truncate" title={`Busca: ${query}`}>
						"{query}"
					</span>

					{isDeepResearch && (
						<button
							className="hover:bg-vscode-button-secondaryHoverBackground px-2 py-1 rounded"
							onClick={handleToggleTechnicalDetails}
							title={t("chat:web_search.toggleDetails")}>
							<InfoCircledIcon className="w-4 h-4" />
						</button>
					)}
				</div>
				<div className="flex items-center gap-1">{isCollapsed ? <CaretDownIcon /> : <CaretUpIcon />}</div>
			</div>

			{!isCollapsed && (
				<div ref={contentRef} className="px-3 pb-3 max-h-[500px] overflow-y-auto">
					{isDeepResearch && deepResearchData?.think && (
						<div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
							<div className="flex items-center justify-between mb-2">
								<h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
									🧠 Processo de Raciocínio para: "{query}"
								</h4>
								<button
									className="text-xs hover:bg-blue-100 dark:hover:bg-blue-800 px-2 py-1 rounded"
									onClick={handleToggleThinking}>
									{showThinking ? "Ocultar" : "Mostrar"}
								</button>
							</div>
							{showThinking && (
								<div className="text-xs text-blue-700 dark:text-blue-300">
									<MarkdownBlock markdown={deepResearchData.think} />
								</div>
							)}
						</div>
					)}

					{isDeepResearch && deepResearchData?.reasoning && (
						<div className="mb-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
							<h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
								📝 Análise Detalhada: "{query}"
							</h4>
							<div className="text-xs text-purple-700 dark:text-purple-300">
								<MarkdownBlock markdown={deepResearchData.reasoning} />
							</div>
						</div>
					)}

					<div className="space-y-3">
						{results.map((result, index) => (
							<div key={index} className="border border-vscode-border rounded-lg p-3">
								<div className="flex items-start gap-3">
									<img
										src={
											result.url.startsWith("deep-research://")
												? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM0LjY4NjMgMiAyIDQuNjg2MyAyIDhTNC42ODYzIDE0IDggMTRTMTQgMTEuMzEzNyAxNCA4UzExLjMxMzcgMiA4IDJaTTggMTJDNS43OTA5IDEyIDQgMTAuMjA5MSA0IDhTNS43OTA5IDQgOCA0UzEyIDUuNzkwOSAxMiA4UzEwLjIwOTEgMTIgOCAxMloiIGZpbGw9IiM0Qjc2ODgiLz4KPC9zdmc+"
												: `https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=16`
										}
										alt="favicon"
										className="w-4 h-4 mt-1"
									/>
									<div className="flex-1">
										<a
											href={result.url.startsWith("deep-research://") ? "#" : result.url}
											target={result.url.startsWith("deep-research://") ? "_self" : "_blank"}
											rel="noopener noreferrer"
											className="text-vscode-textLink-foreground hover:underline block text-sm font-medium">
											{result.title}
										</a>
										<MarkdownBlock markdown={result.snippet} />
										{showTechnicalDetails && result.score && (
											<div className="mt-1 text-xs text-vscode-disabledForeground">
												Score: {result.score.toFixed(2)} | Provider: {result.provider}
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					{isDeepResearch && deepResearchData?.references && deepResearchData.references.length > 0 && (
						<div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
							<div className="flex items-center justify-between mb-2">
								<h4 className="text-sm font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
									📚 Referências ({deepResearchData.references.length})
								</h4>
								<button
									className="text-xs hover:bg-green-100 dark:hover:bg-green-800 px-2 py-1 rounded"
									onClick={handleToggleReferences}>
									{showReferences ? "Ocultar" : "Mostrar"}
								</button>
							</div>
							{showReferences && (
								<div className="space-y-2">
									{deepResearchData.references.map((ref, index) => (
										<div key={index} className="text-xs border-l-2 border-green-300 pl-2">
											<div className="text-green-700 dark:text-green-300 mb-1 italic">
												&quot;{ref.exactQuote}&quot;
											</div>
											<a
												href={ref.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-green-600 dark:text-green-400 hover:underline">
												{ref.url}
											</a>
											{ref.dateTime && (
												<div className="text-green-500 text-xs mt-1">{ref.dateTime}</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{isDeepResearch && showTechnicalDetails && deepResearchData && (
						<div className="mt-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
							<h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
								🔍 Estatísticas de Busca
							</h4>
							<div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
								{deepResearchData.visitedURLs && (
									<div>URLs visitadas: {deepResearchData.visitedURLs.length}</div>
								)}
								{deepResearchData.readURLs && <div>URLs lidas: {deepResearchData.readURLs.length}</div>}
								{deepResearchData.allURLs && (
									<div>Total URLs encontradas: {deepResearchData.allURLs.length}</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
