import React, {
	forwardRef,
	memo,
	useCallback,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import {
	CheckCheck,
	SquareMousePointer,
	Webhook,
	GitBranch,
	Bell,
	Database,
	SquareTerminal,
	FlaskConical,
	AlertTriangle,
	Globe,
	Info,
	MessageSquare,
	LucideIcon,
	Search, // Adicionado ícone de busca
} from "lucide-react"

import type { ProviderSettings, ExperimentId, SearchApiSettings, SearchApiSettingsMeta } from "@roo-code/types"

import { TelemetrySetting } from "@roo/TelemetrySetting"

import { vscode } from "@src/utils/vscode"
import { useAppTranslation } from "@src/i18n/TranslationContext"
import { ExtensionStateContextType, useExtensionState } from "@src/context/ExtensionStateContext"
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogHeader,
	AlertDialogFooter,
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@src/components/ui"

import { Tab, TabContent, TabHeader, TabList, TabTrigger } from "../common/Tab"
import { SetExperimentEnabled } from "./types"
import { SectionHeader } from "./SectionHeader"
import ApiConfigManager from "./ApiConfigManager"
import ApiOptions from "./ApiOptions"
import { AutoApproveSettings } from "./AutoApproveSettings"
import { BrowserSettings } from "./BrowserSettings"
import { CheckpointSettings } from "./CheckpointSettings"
import { NotificationSettings } from "./NotificationSettings"
import { ContextManagementSettings } from "./ContextManagementSettings"
import { TerminalSettings } from "./TerminalSettings"
import { ExperimentalSettings } from "./ExperimentalSettings"
import { LanguageSettings } from "./LanguageSettings"
import { About } from "./About"
import { Section } from "./Section"
import PromptsSettings from "./PromptsSettings"
import { cn } from "@/lib/utils"
import SearchApiOptions from "./SearchApiOptions"

export const settingsTabsContainer = "flex flex-1 overflow-hidden [&.narrow_.tab-label]:hidden"
export const settingsTabList =
	"w-48 data-[compact=true]:w-12 flex-shrink-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-vscode-sideBar-background"
export const settingsTabTrigger =
	"whitespace-nowrap overflow-hidden min-w-0 h-12 px-4 py-3 box-border flex items-center border-l-2 border-transparent text-vscode-foreground opacity-70 hover:bg-vscode-list-hoverBackground data-[compact=true]:w-12 data-[compact=true]:p-4"
export const settingsTabTriggerActive = "opacity-100 border-vscode-focusBorder bg-vscode-list-activeSelectionBackground"

export interface SettingsViewRef {
	checkUnsaveChanges: (then: () => void) => void
}

const sectionNames = [
	"providers",
	"search-api", // Adicionada nova seção
	"autoApprove",
	"browser",
	"checkpoints",
	"notifications",
	"contextManagement",
	"terminal",
	"prompts",
	"experimental",
	"language",
	"about",
] as const

type SectionName = (typeof sectionNames)[number]

type SettingsViewProps = {
	onDone: () => void
	targetSection?: string
}

const SettingsView = forwardRef<SettingsViewRef, SettingsViewProps>(({ onDone, targetSection }, ref) => {
	const { t } = useAppTranslation()

	const extensionState = useExtensionState() as ExtensionStateContextType & {
		listSearchApiConfigMeta?: SearchApiSettingsMeta[]
		currentSearchApiConfigName?: string
		searchApiConfiguration?: SearchApiSettings
	}
	const {
		currentApiConfigName,
		listApiConfigMeta,
		uriScheme,
		version,
		settingsImportedAt,
		listSearchApiConfigMeta: initialListSearchApiConfigMeta,
		currentSearchApiConfigName: initialCurrentSearchApiConfigName,
		searchApiConfiguration: initialSearchApiConfiguration,
	} = extensionState

	const [isDiscardDialogShow, setDiscardDialogShow] = useState(false)
	const [isChangeDetected, setChangeDetected] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
	const [activeTab, setActiveTab] = useState<SectionName>(
		targetSection && sectionNames.includes(targetSection as SectionName)
			? (targetSection as SectionName)
			: "providers",
	)

	const prevApiConfigName = useRef(currentApiConfigName)
	const confirmDialogHandler = useRef<() => void>()

	// SearchApiSettings e SearchApiSettingsMeta são importados de @roo/schemas
	// A interface local SearchApiConfigMeta foi removida nas etapas anteriores ou será implicitamente sobrescrita.

	const [cachedState, setCachedState] = useState(() => {
		const initialSearchConfig = initialSearchApiConfiguration // Pode ser SearchApiSettings | undefined
		const initialSearchList = initialListSearchApiConfigMeta ?? [] // Garante que seja um array
		const initialSearchName = initialCurrentSearchApiConfigName ?? "default"

		return {
			...extensionState,
			searchApiConfiguration: initialSearchConfig, // Tipo já é SearchApiSettings | undefined
			listSearchApiConfigMeta: initialSearchList, // Tipo já é SearchApiSettingsMeta[]
			currentSearchApiConfigName: initialSearchName,
		}
	})

	const {
		alwaysAllowReadOnly,
		alwaysAllowReadOnlyOutsideWorkspace,
		allowedCommands,
		allowedMaxRequests,
		language,
		alwaysAllowBrowser,
		alwaysAllowExecute,
		alwaysAllowMcp,
		alwaysAllowModeSwitch,
		alwaysAllowSubtasks,
		alwaysAllowWrite,
		alwaysAllowWriteOutsideWorkspace,
		alwaysApproveResubmit,
		autoCondenseContext,
		autoCondenseContextPercent,
		browserToolEnabled,
		browserViewportSize,
		enableCheckpoints,
		diffEnabled,
		experiments,
		fuzzyMatchThreshold,
		maxOpenTabsContext,
		maxWorkspaceFiles,
		mcpEnabled,
		requestDelaySeconds,
		remoteBrowserHost,
		screenshotQuality,
		soundEnabled,
		ttsEnabled,
		ttsSpeed,
		soundVolume,
		telemetrySetting,
		terminalOutputLineLimit,
		terminalShellIntegrationTimeout,
		terminalShellIntegrationDisabled, // Added from upstream
		terminalCommandDelay,
		terminalPowershellCounter,
		terminalZshClearEolMark,
		terminalZshOhMy,
		terminalZshP10k,
		terminalZdotdir,
		writeDelayMs,
		showRooIgnoredFiles,
		remoteBrowserEnabled,
		maxReadFileLine,
		terminalCompressProgressBar,
		maxConcurrentFileReads,
		condensingApiConfigId,
		customCondensingPrompt,
		codebaseIndexConfig,
		codebaseIndexModels,
		// Campos da API de Busca
		listSearchApiConfigMeta,
		currentSearchApiConfigName,
	} = cachedState

	const apiConfiguration = useMemo(() => cachedState.apiConfiguration ?? {}, [cachedState.apiConfiguration])
	const searchApiConfiguration = useMemo(
		() => cachedState.searchApiConfiguration, // Permitir que seja undefined
		[cachedState.searchApiConfiguration],
	)

	useEffect(() => {
		// Update only when currentApiConfigName is changed.
		// Expected to be triggered by loadApiConfiguration/upsertApiConfiguration.
		if (prevApiConfigName.current === currentApiConfigName) {
			return
		}

		setCachedState((prevCachedState) => ({
			...prevCachedState,
			...extensionState,
			// Garantir que os campos da API de busca sejam mantidos ou atualizados se presentes no extensionState
			searchApiConfiguration: extensionState.searchApiConfiguration ?? prevCachedState.searchApiConfiguration,
			listSearchApiConfigMeta: extensionState.listSearchApiConfigMeta ?? prevCachedState.listSearchApiConfigMeta,
			currentSearchApiConfigName:
				extensionState.currentSearchApiConfigName ?? prevCachedState.currentSearchApiConfigName,
		}))
		prevApiConfigName.current = currentApiConfigName
		setChangeDetected(false)
	}, [currentApiConfigName, extensionState, isChangeDetected])

	// Bust the cache when settings are imported.
	useEffect(() => {
		if (settingsImportedAt) {
			setCachedState((prevCachedState) => ({
				...prevCachedState,
				...extensionState,
				// Garantir que os campos da API de busca sejam mantidos ou atualizados se presentes no extensionState
				searchApiConfiguration: extensionState.searchApiConfiguration ?? prevCachedState.searchApiConfiguration,
				listSearchApiConfigMeta:
					extensionState.listSearchApiConfigMeta ?? prevCachedState.listSearchApiConfigMeta,
				currentSearchApiConfigName:
					extensionState.currentSearchApiConfigName ?? prevCachedState.currentSearchApiConfigName,
			}))
			setChangeDetected(false)
		}
	}, [settingsImportedAt, extensionState])

	// Efeito para sincronizar currentSearchApiConfigName e searchApiConfiguration do extensionState para o cachedState
	useEffect(() => {
		if (
			extensionState.currentSearchApiConfigName &&
			extensionState.currentSearchApiConfigName !== cachedState.currentSearchApiConfigName
		) {
			setCachedState((prevState) => ({
				...prevState,
				currentSearchApiConfigName: extensionState.currentSearchApiConfigName ?? "default",
				searchApiConfiguration: extensionState.searchApiConfiguration, // Atualiza também a configuração ativa
				listSearchApiConfigMeta: extensionState.listSearchApiConfigMeta ?? prevState.listSearchApiConfigMeta,
			}))
			setChangeDetected(false) // Resetar flag de alteração pois isso é uma sincronização
		}
	}, [
		extensionState.currentSearchApiConfigName,
		extensionState.searchApiConfiguration,
		extensionState.listSearchApiConfigMeta,
		cachedState.currentSearchApiConfigName,
	])

	const setCachedStateField = useCallback(
		<K extends keyof typeof cachedState>(field: K, value: (typeof cachedState)[K]) => {
			setCachedState((prevState) => {
				if (prevState[field] === value) {
					return prevState
				}

				setChangeDetected(true)
				return { ...prevState, [field]: value }
			})
		},
		[],
	)

	const setApiConfigurationField = useCallback(
		<K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => {
			setCachedState((prevState) => {
				if (prevState.apiConfiguration?.[field] === value) {
					return prevState
				}

				setChangeDetected(true)
				return { ...prevState, apiConfiguration: { ...prevState.apiConfiguration, [field]: value } }
			})
		},
		[],
	)

	const setSearchApiConfigurationField = useCallback((field: string, value: any) => {
		console.log(`[SettingsView] setSearchApiConfigurationField - field: ${field}, value:`, value)
		// Assinatura alterada para corresponder ao esperado por SearchApiOptions
		setCachedState((prevState) => {
			console.log(
				"[SettingsView] setSearchApiConfigurationField - prevState.searchApiConfiguration:",
				prevState.searchApiConfiguration,
			)
			const baseConfig = prevState.searchApiConfiguration ?? ({} as SearchApiSettings)

			// Verifica se o valor realmente mudou para evitar re-renderizações desnecessárias
			// e para garantir que setChangeDetected só seja chamado quando houver uma mudança real.
			// Usamos 'field as keyof SearchApiSettings' para acessar o campo,
			// assumindo que 'field' será uma chave válida de SearchApiSettings.
			if (prevState.searchApiConfiguration && baseConfig[field as keyof SearchApiSettings] === value) {
				console.log("[SettingsView] setSearchApiConfigurationField - valor não mudou, retornando prevState")
				return prevState
			}

			console.log("[SettingsView] setSearchApiConfigurationField - valor mudou, atualizando estado.")
			setChangeDetected(true)
			const newSearchConfig = { ...baseConfig, [field]: value }
			console.log("[SettingsView] setSearchApiConfigurationField - newSearchConfig:", newSearchConfig)
			return {
				...prevState,
				// Fazemos um cast para SearchApiSettings para manter a consistência do tipo no estado.
				searchApiConfiguration: newSearchConfig as SearchApiSettings,
			}
		})
	}, [])

	const setExperimentEnabled: SetExperimentEnabled = useCallback((id: ExperimentId, enabled: boolean) => {
		setCachedState((prevState) => {
			if (prevState.experiments?.[id] === enabled) {
				return prevState
			}

			setChangeDetected(true)
			return { ...prevState, experiments: { ...prevState.experiments, [id]: enabled } }
		})
	}, [])

	const setTelemetrySetting = useCallback((setting: TelemetrySetting) => {
		setCachedState((prevState) => {
			if (prevState.telemetrySetting === setting) {
				return prevState
			}

			setChangeDetected(true)
			return { ...prevState, telemetrySetting: setting }
		})
	}, [])

	const isSettingValid = !errorMessage

	const handleSubmit = () => {
		if (isSettingValid) {
			vscode.postMessage({ type: "language", text: language })
			vscode.postMessage({ type: "alwaysAllowReadOnly", bool: alwaysAllowReadOnly })
			vscode.postMessage({
				type: "alwaysAllowReadOnlyOutsideWorkspace",
				bool: alwaysAllowReadOnlyOutsideWorkspace,
			})
			vscode.postMessage({ type: "alwaysAllowWrite", bool: alwaysAllowWrite })
			vscode.postMessage({ type: "alwaysAllowWriteOutsideWorkspace", bool: alwaysAllowWriteOutsideWorkspace })
			vscode.postMessage({ type: "alwaysAllowExecute", bool: alwaysAllowExecute })
			vscode.postMessage({ type: "alwaysAllowBrowser", bool: alwaysAllowBrowser })
			vscode.postMessage({ type: "alwaysAllowMcp", bool: alwaysAllowMcp })
			vscode.postMessage({ type: "allowedCommands", commands: allowedCommands ?? [] })
			vscode.postMessage({ type: "allowedMaxRequests", value: allowedMaxRequests ?? undefined })
			vscode.postMessage({ type: "autoCondenseContext", bool: autoCondenseContext })
			vscode.postMessage({ type: "autoCondenseContextPercent", value: autoCondenseContextPercent })
			vscode.postMessage({ type: "browserToolEnabled", bool: browserToolEnabled })
			vscode.postMessage({ type: "soundEnabled", bool: soundEnabled })
			vscode.postMessage({ type: "ttsEnabled", bool: ttsEnabled })
			vscode.postMessage({ type: "ttsSpeed", value: ttsSpeed })
			vscode.postMessage({ type: "soundVolume", value: soundVolume })
			vscode.postMessage({ type: "diffEnabled", bool: diffEnabled })
			vscode.postMessage({ type: "enableCheckpoints", bool: enableCheckpoints })
			vscode.postMessage({ type: "browserViewportSize", text: browserViewportSize })
			vscode.postMessage({ type: "remoteBrowserHost", text: remoteBrowserHost })
			vscode.postMessage({ type: "remoteBrowserEnabled", bool: remoteBrowserEnabled })
			vscode.postMessage({ type: "fuzzyMatchThreshold", value: fuzzyMatchThreshold ?? 1.0 })
			vscode.postMessage({ type: "writeDelayMs", value: writeDelayMs })
			vscode.postMessage({ type: "screenshotQuality", value: screenshotQuality ?? 75 })
			vscode.postMessage({ type: "terminalOutputLineLimit", value: terminalOutputLineLimit ?? 500 })
			vscode.postMessage({ type: "terminalShellIntegrationTimeout", value: terminalShellIntegrationTimeout })
			vscode.postMessage({ type: "terminalShellIntegrationDisabled", bool: terminalShellIntegrationDisabled })
			vscode.postMessage({ type: "terminalCommandDelay", value: terminalCommandDelay })
			vscode.postMessage({ type: "terminalPowershellCounter", bool: terminalPowershellCounter })
			vscode.postMessage({ type: "terminalZshClearEolMark", bool: terminalZshClearEolMark })
			vscode.postMessage({ type: "terminalZshOhMy", bool: terminalZshOhMy })
			vscode.postMessage({ type: "terminalZshP10k", bool: terminalZshP10k })
			vscode.postMessage({ type: "terminalZdotdir", bool: terminalZdotdir })
			vscode.postMessage({ type: "terminalCompressProgressBar", bool: terminalCompressProgressBar })
			vscode.postMessage({ type: "mcpEnabled", bool: mcpEnabled })
			vscode.postMessage({ type: "alwaysApproveResubmit", bool: alwaysApproveResubmit })
			vscode.postMessage({ type: "requestDelaySeconds", value: requestDelaySeconds })
			vscode.postMessage({ type: "maxOpenTabsContext", value: maxOpenTabsContext })
			vscode.postMessage({ type: "maxWorkspaceFiles", value: maxWorkspaceFiles ?? 200 })
			vscode.postMessage({ type: "showRooIgnoredFiles", bool: showRooIgnoredFiles })
			vscode.postMessage({ type: "maxReadFileLine", value: maxReadFileLine ?? -1 })
			vscode.postMessage({ type: "maxConcurrentFileReads", value: cachedState.maxConcurrentFileReads ?? 15 })
			vscode.postMessage({ type: "currentApiConfigName", text: currentApiConfigName })
			vscode.postMessage({ type: "updateExperimental", values: experiments })
			vscode.postMessage({ type: "alwaysAllowModeSwitch", bool: alwaysAllowModeSwitch })
			vscode.postMessage({ type: "alwaysAllowSubtasks", bool: alwaysAllowSubtasks })
			vscode.postMessage({ type: "condensingApiConfigId", text: condensingApiConfigId || "" })
			vscode.postMessage({ type: "updateCondensingPrompt", text: customCondensingPrompt || "" })
			vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
			// Salvar configurações da API de Busca
			// Removida a condição if (activeTab === "search-api") para garantir que sempre salve
			console.log("Salvando configurações da API de Busca:")
			console.log("currentSearchApiConfigName:", currentSearchApiConfigName)
			console.log("searchApiConfiguration:", searchApiConfiguration)
			vscode.postMessage({
				type: "upsertSearchApiConfiguration",
				name: currentSearchApiConfigName, // Usar 'name' conforme WebviewMessage
				searchApiConfiguration: searchApiConfiguration, // searchApiConfiguration é SearchApiSettings | undefined
				activate: true, // Assumindo que salvar o perfil ativo deve mantê-lo ativo ou reativá-lo
			})
			vscode.postMessage({ type: "telemetrySetting", text: telemetrySetting })
			vscode.postMessage({ type: "codebaseIndexConfig", values: codebaseIndexConfig })
			setChangeDetected(false)
		}
	}

	const checkUnsaveChanges = useCallback(
		(then: () => void) => {
			if (isChangeDetected) {
				confirmDialogHandler.current = then
				setDiscardDialogShow(true)
			} else {
				then()
			}
		},
		[isChangeDetected],
	)

	useImperativeHandle(ref, () => ({ checkUnsaveChanges }), [checkUnsaveChanges])

	const onConfirmDialogResult = useCallback(
		(confirm: boolean) => {
			if (confirm) {
				// Discard changes: Reset state and flag
				const initialSearchConfig = extensionState.searchApiConfiguration
				const initialSearchList = extensionState.listSearchApiConfigMeta ?? []
				const initialSearchName = extensionState.currentSearchApiConfigName ?? "default"
				setCachedState({
					...extensionState,
					searchApiConfiguration: initialSearchConfig as SearchApiSettings | undefined, // Cast para garantir o tipo esperado pelo estado
					listSearchApiConfigMeta: initialSearchList as SearchApiSettingsMeta[], // Cast para garantir o tipo
					currentSearchApiConfigName: initialSearchName,
				})
				setChangeDetected(false) // Reset change flag
				confirmDialogHandler.current?.() // Execute the pending action (e.g., tab switch)
			}
			// If confirm is false (Cancel), do nothing, dialog closes automatically
		},
		[extensionState], // Depend on extensionState to get the latest original state
	)

	// Handle tab changes with unsaved changes check
	const handleTabChange = useCallback(
		(newTab: SectionName) => {
			// Directly switch tab without checking for unsaved changes
			setActiveTab(newTab)
		},
		[], // No dependency on isChangeDetected needed anymore
	)

	// Store direct DOM element refs for each tab
	const tabRefs = useRef<Record<SectionName, HTMLButtonElement | null>>(
		Object.fromEntries(sectionNames.map((name) => [name, null])) as Record<SectionName, HTMLButtonElement | null>,
	)

	// Track whether we're in compact mode
	const [isCompactMode, setIsCompactMode] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Setup resize observer to detect when we should switch to compact mode
	useEffect(() => {
		if (!containerRef.current) return

		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				// If container width is less than 500px, switch to compact mode
				setIsCompactMode(entry.contentRect.width < 500)
			}
		})

		observer.observe(containerRef.current)

		return () => {
			observer?.disconnect()
		}
	}, [])

	const sections: { id: SectionName; icon: LucideIcon }[] = useMemo(
		() => [
			{ id: "providers", icon: Webhook },
			{ id: "search-api", icon: Search }, // Nova aba API Search
			{ id: "autoApprove", icon: CheckCheck },
			{ id: "browser", icon: SquareMousePointer },
			{ id: "checkpoints", icon: GitBranch },
			{ id: "notifications", icon: Bell },
			{ id: "contextManagement", icon: Database },
			{ id: "terminal", icon: SquareTerminal },
			{ id: "prompts", icon: MessageSquare },
			{ id: "experimental", icon: FlaskConical },
			{ id: "language", icon: Globe },
			{ id: "about", icon: Info },
		],
		[], // No dependencies needed now
	)

	// Update target section logic to set active tab
	useEffect(() => {
		if (targetSection && sectionNames.includes(targetSection as SectionName)) {
			setActiveTab(targetSection as SectionName)
		}
	}, [targetSection])

	// Function to scroll the active tab into view for vertical layout
	const scrollToActiveTab = useCallback(() => {
		const activeTabElement = tabRefs.current[activeTab]

		if (activeTabElement) {
			activeTabElement.scrollIntoView({
				behavior: "auto",
				block: "nearest",
			})
		}
	}, [activeTab])

	// Effect to scroll when the active tab changes
	useEffect(() => {
		scrollToActiveTab()
	}, [activeTab, scrollToActiveTab])

	// Effect to scroll when the webview becomes visible
	useLayoutEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			if (message.type === "action" && message.action === "didBecomeVisible") {
				scrollToActiveTab()
			}
		}

		window.addEventListener("message", handleMessage)

		return () => {
			window.removeEventListener("message", handleMessage)
		}
	}, [scrollToActiveTab])

	return (
		<Tab>
			<TabHeader className="flex justify-between items-center gap-2">
				<div className="flex items-center gap-1">
					<h3 className="text-vscode-foreground m-0">{t("settings:header.title")}</h3>
				</div>
				<div className="flex gap-2">
					<Button
						variant={isSettingValid ? "default" : "secondary"}
						className={!isSettingValid ? "!border-vscode-errorForeground" : ""}
						title={
							!isSettingValid
								? errorMessage
								: isChangeDetected
									? t("settings:header.saveButtonTooltip")
									: t("settings:header.nothingChangedTooltip")
						}
						onClick={handleSubmit}
						disabled={!isChangeDetected || !isSettingValid}
						data-testid="save-button">
						{t("settings:common.save")}
					</Button>
					<Button
						variant="secondary"
						title={t("settings:header.doneButtonTooltip")}
						onClick={() => checkUnsaveChanges(onDone)}>
						{t("settings:common.done")}
					</Button>
				</div>
			</TabHeader>

			{/* Vertical tabs layout */}
			<div ref={containerRef} className={cn(settingsTabsContainer, isCompactMode && "narrow")}>
				{/* Tab sidebar */}
				<TabList
					value={activeTab}
					onValueChange={(value) => handleTabChange(value as SectionName)}
					className={cn(settingsTabList)}
					data-compact={isCompactMode}
					data-testid="settings-tab-list">
					{sections.map(({ id, icon: Icon }) => {
						const isSelected = id === activeTab
						const onSelect = () => handleTabChange(id)

						// Base TabTrigger component definition
						// We pass isSelected manually for styling, but onSelect is handled conditionally
						const triggerComponent = (
							<TabTrigger
								ref={(element) => (tabRefs.current[id] = element)}
								value={id}
								isSelected={isSelected} // Pass manually for styling state
								className={cn(
									isSelected // Use manual isSelected for styling
										? `${settingsTabTrigger} ${settingsTabTriggerActive}`
										: settingsTabTrigger,
									"focus:ring-0", // Remove the focus ring styling
								)}
								data-testid={`tab-${id}`}
								data-compact={isCompactMode}>
								<div className={cn("flex items-center gap-2", isCompactMode && "justify-center")}>
									<Icon className="w-4 h-4" />
									<span className="tab-label">{t(`settings:sections.${id}`)}</span>
								</div>
							</TabTrigger>
						)

						if (isCompactMode) {
							// Wrap in Tooltip and manually add onClick to the trigger
							return (
								<TooltipProvider key={id} delayDuration={0}>
									<Tooltip>
										<TooltipTrigger asChild onClick={onSelect}>
											{/* Clone to avoid ref issues if triggerComponent itself had a key */}
											{React.cloneElement(triggerComponent)}
										</TooltipTrigger>
										<TooltipContent side="right" className="text-base">
											<p className="m-0">{t(`settings:sections.${id}`)}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)
						} else {
							// Render trigger directly; TabList will inject onSelect via cloning
							// Ensure the element passed to TabList has the key
							return React.cloneElement(triggerComponent, { key: id })
						}
					})}
				</TabList>

				{/* Content area */}
				<TabContent className="p-0 flex-1 overflow-auto">
					{/* Providers Section */}
					{activeTab === "providers" && (
						<div>
							<SectionHeader>
								<div className="flex items-center gap-2">
									<Webhook className="w-4" />
									<div>{t("settings:sections.providers")}</div>
								</div>
							</SectionHeader>

							<Section>
								<ApiConfigManager
									currentApiConfigName={currentApiConfigName}
									listApiConfigMeta={listApiConfigMeta}
									onSelectConfig={(configName: string) =>
										checkUnsaveChanges(() =>
											vscode.postMessage({ type: "loadApiConfiguration", text: configName }),
										)
									}
									onDeleteConfig={(configName: string) =>
										vscode.postMessage({ type: "deleteApiConfiguration", text: configName })
									}
									onRenameConfig={(oldName: string, newName: string) => {
										vscode.postMessage({
											type: "renameApiConfiguration",
											values: { oldName, newName },
											apiConfiguration,
										})
										prevApiConfigName.current = newName
									}}
									onUpsertConfig={(configName: string) =>
										vscode.postMessage({
											type: "upsertApiConfiguration",
											text: configName,
											apiConfiguration,
										})
									}
									// As props de tradução para o ApiConfigManager de LLMs serão adicionadas em outra tarefa, se necessário.
								/>
								<ApiOptions
									uriScheme={uriScheme}
									apiConfiguration={apiConfiguration}
									setApiConfigurationField={setApiConfigurationField}
									errorMessage={errorMessage}
									setErrorMessage={setErrorMessage}
								/>
							</Section>
						</div>
					)}
					{/* Search API Section */}
					{activeTab === "search-api" && (
						<div>
							<SectionHeader>
								<div className="flex items-center gap-2">
									<Search className="w-4" />
									<div>{t("settings:sections.search-api")}</div>
								</div>
							</SectionHeader>
							<Section>
								<ApiConfigManager
									// Renomeando para listApiConfigMeta para corresponder à prop esperada pelo componente
									listApiConfigMeta={listSearchApiConfigMeta} // Removido 'as any'
									currentApiConfigName={currentSearchApiConfigName}
									onSelectConfig={(configName: string) => {
										// Quando um perfil é selecionado, ativamos ele
										vscode.postMessage({ type: "activateSearchApiConfiguration", name: configName })
										// O estado local será atualizado via postStateToWebview do backend
									}}
									onDeleteConfig={(configName: string) => {
										vscode.postMessage({ type: "deleteSearchApiConfiguration", name: configName })
										// O estado local será atualizado via postStateToWebview
									}}
									onRenameConfig={(oldName: string, newName: string) => {
										// Renomear: Upsert com novo nome + configurações atuais, depois deletar o antigo
										// Ou idealmente, o backend lida com a renomeação atômica.
										// Por agora, vamos fazer um upsert. O usuário precisaria deletar o antigo manualmente.
										if (searchApiConfiguration) {
											// Só faz sentido se houver uma config ativa para copiar
											// Para renomear: criar o novo perfil com as configurações do antigo e depois deletar o antigo.
											vscode.postMessage({
												type: "upsertSearchApiConfiguration",
												name: newName,
												searchApiConfiguration: searchApiConfiguration, // Passa a configuração existente
												activate: currentSearchApiConfigName === oldName,
											})
											vscode.postMessage({
												type: "deleteSearchApiConfiguration",
												name: oldName,
											})
											// Se o perfil ativo foi renomeado, atualiza o nome no estado local para o novo nome.
											if (currentSearchApiConfigName === oldName) {
												setCachedStateField("currentSearchApiConfigName", newName)
											}
										}
									}}
									onUpsertConfig={(configName: string) => {
										// Ao criar/salvar (upsert), envia a configuração atual do cache
										// e ativa o perfil.
										vscode.postMessage({
											type: "upsertSearchApiConfiguration",
											name: configName,
											searchApiConfiguration: searchApiConfiguration, // Envia a config atual (pode ser undefined se for um perfil totalmente novo)
											activate: true,
										})
									}}
									// As props de tradução (configManagerTitle, etc.) foram removidas temporariamente
									// pois não existem na definição de ApiConfigManagerProps.
								/>
								{/* Placeholder para o futuro componente SearchApiOptions */}
								{
									<SearchApiOptions
										searchApiConfiguration={searchApiConfiguration}
										setSearchApiConfigurationField={setSearchApiConfigurationField}
									/>
								}
								<div className="p-2 border border-vscode-input-border rounded-md bg-vscode-input-background">
									<h5 className="font-semibold mb-1">
										{t("settings:searchApi.currentSettingsTitle")}
									</h5>
									<pre className="text-xs bg-vscode-editorWidget-background p-2 rounded">
										{JSON.stringify(searchApiConfiguration, null, 2)}
									</pre>
								</div>
							</Section>
						</div>
					)}

					{/* Auto-Approve Section */}
					{activeTab === "autoApprove" && (
						<AutoApproveSettings
							alwaysAllowReadOnly={alwaysAllowReadOnly}
							alwaysAllowReadOnlyOutsideWorkspace={alwaysAllowReadOnlyOutsideWorkspace}
							alwaysAllowWrite={alwaysAllowWrite}
							alwaysAllowWriteOutsideWorkspace={alwaysAllowWriteOutsideWorkspace}
							writeDelayMs={writeDelayMs}
							alwaysAllowBrowser={alwaysAllowBrowser}
							alwaysApproveResubmit={alwaysApproveResubmit}
							requestDelaySeconds={requestDelaySeconds}
							alwaysAllowMcp={alwaysAllowMcp}
							alwaysAllowModeSwitch={alwaysAllowModeSwitch}
							alwaysAllowSubtasks={alwaysAllowSubtasks}
							alwaysAllowExecute={alwaysAllowExecute}
							allowedCommands={allowedCommands}
							setCachedStateField={setCachedStateField}
						/>
					)}

					{/* Browser Section */}
					{activeTab === "browser" && (
						<BrowserSettings
							browserToolEnabled={browserToolEnabled}
							browserViewportSize={browserViewportSize}
							screenshotQuality={screenshotQuality}
							remoteBrowserHost={remoteBrowserHost}
							remoteBrowserEnabled={remoteBrowserEnabled}
							setCachedStateField={setCachedStateField}
						/>
					)}

					{/* Checkpoints Section */}
					{activeTab === "checkpoints" && (
						<CheckpointSettings
							enableCheckpoints={enableCheckpoints}
							setCachedStateField={setCachedStateField}
						/>
					)}

					{/* Notifications Section */}
					{activeTab === "notifications" && (
						<NotificationSettings
							ttsEnabled={ttsEnabled}
							ttsSpeed={ttsSpeed}
							soundEnabled={soundEnabled}
							soundVolume={soundVolume}
							setCachedStateField={setCachedStateField}
						/>
					)}

					{/* Context Management Section */}
					{activeTab === "contextManagement" && (
						<ContextManagementSettings
							autoCondenseContext={autoCondenseContext}
							autoCondenseContextPercent={autoCondenseContextPercent}
							condensingApiConfigId={condensingApiConfigId}
							customCondensingPrompt={customCondensingPrompt}
							listApiConfigMeta={listApiConfigMeta ?? []}
							maxOpenTabsContext={maxOpenTabsContext}
							maxWorkspaceFiles={maxWorkspaceFiles ?? 200}
							showRooIgnoredFiles={showRooIgnoredFiles}
							maxReadFileLine={maxReadFileLine}
							setCachedStateField={setCachedStateField}
						/>
					)}

					{/* Terminal Section */}
					{activeTab === "terminal" && (
						<TerminalSettings
							terminalOutputLineLimit={terminalOutputLineLimit}
							terminalShellIntegrationTimeout={terminalShellIntegrationTimeout}
							terminalShellIntegrationDisabled={terminalShellIntegrationDisabled}
							terminalCommandDelay={terminalCommandDelay}
							terminalPowershellCounter={terminalPowershellCounter}
							terminalZshClearEolMark={terminalZshClearEolMark}
							terminalZshOhMy={terminalZshOhMy}
							terminalZshP10k={terminalZshP10k}
							terminalZdotdir={terminalZdotdir}
							terminalCompressProgressBar={terminalCompressProgressBar}
							setCachedStateField={setCachedStateField}
						/>
					)}

					{/* Prompts Section */}
					{activeTab === "prompts" && <PromptsSettings />}

					{/* Experimental Section */}
					{activeTab === "experimental" && (
						<ExperimentalSettings
							setExperimentEnabled={setExperimentEnabled}
							experiments={experiments}
							maxConcurrentFileReads={maxConcurrentFileReads}
							setCachedStateField={setCachedStateField}
							codebaseIndexModels={codebaseIndexModels}
							codebaseIndexConfig={codebaseIndexConfig}
							apiConfiguration={apiConfiguration}
							setApiConfigurationField={setApiConfigurationField}
							areSettingsCommitted={!isChangeDetected}
						/>
					)}

					{/* Language Section */}
					{activeTab === "language" && (
						<LanguageSettings language={language || "en"} setCachedStateField={setCachedStateField} />
					)}

					{/* About Section */}
					{activeTab === "about" && (
						<About telemetrySetting={telemetrySetting} setTelemetrySetting={setTelemetrySetting} />
					)}
				</TabContent>
			</div>

			<AlertDialog open={isDiscardDialogShow} onOpenChange={setDiscardDialogShow}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<AlertTriangle className="w-5 h-5 text-yellow-500" />
							{t("settings:unsavedChangesDialog.title")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("settings:unsavedChangesDialog.description")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => onConfirmDialogResult(false)}>
							{t("settings:unsavedChangesDialog.cancelButton")}
						</AlertDialogCancel>
						<AlertDialogAction onClick={() => onConfirmDialogResult(true)}>
							{t("settings:unsavedChangesDialog.discardButton")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Tab>
	)
})

export default memo(SettingsView)
