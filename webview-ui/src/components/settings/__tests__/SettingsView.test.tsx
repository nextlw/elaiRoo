import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { vscode } from "@/utils/vscode"
import { ExtensionStateContextProvider } from "@/context/ExtensionStateContext"

import SettingsView from "../SettingsView"

// Mock vscode API
jest.mock("@src/utils/vscode", () => ({ vscode: { postMessage: jest.fn() } }))

// Mock all lucide-react icons with a proxy to handle any icon requested
jest.mock("lucide-react", () => {
	return new Proxy(
		{},
		{
			get: function (_obj, prop) {
				// Return a component factory for any icon that's requested
				if (prop === "__esModule") {
					return true
				}
				return () => <div data-testid={`${String(prop)}-icon`}>{String(prop)}</div>
			},
		},
	)
})

// Mock ApiConfigManager component
jest.mock("../ApiConfigManager", () => ({
	__esModule: true,
	default: ({ currentApiConfigName }: any) => (
		<div data-testid="api-config-management">
			<span>Current config: {currentApiConfigName}</span>
		</div>
	),
}))

// Mock SearchApiOptions component
jest.mock("../SearchApiOptions", () => ({
	__esModule: true,
	default: jest.fn(({ searchApiConfiguration, setSearchApiConfigurationField, disabled }) => (
		<div data-testid="search-api-options">
			<span>Provider: {searchApiConfiguration?.searchApiProviderName}</span>
			<input
				type="text"
				aria-label="API Key"
				value={searchApiConfiguration?.apiKey || ""}
				onChange={(e) => setSearchApiConfigurationField("apiKey", e.target.value)}
				disabled={disabled}
			/>
			{/* Adicionar outros campos mockados conforme necessário para o teste */}
			{searchApiConfiguration?.searchApiProviderName === "google_custom_search" && (
				<input
					type="text"
					aria-label="CX ID"
					value={searchApiConfiguration?.cxId || ""}
					onChange={(e) => setSearchApiConfigurationField("cxId", e.target.value)}
					disabled={disabled}
				/>
			)}
			{/* Mock para o Select de provedores, se necessário para outros testes */}
			<select
				aria-label="Provider select"
				value={searchApiConfiguration?.searchApiProviderName}
				onChange={(e) => setSearchApiConfigurationField("searchApiProviderName", e.target.value)}
				disabled={disabled}>
				{/* Renderizar opções mockadas se necessário */}
				<option value="jina">Jina AI</option>
				<option value="google_custom_search">Google Custom Search</option>
			</select>
		</div>
	)),
}))

// Mock VSCode components
jest.mock("@vscode/webview-ui-toolkit/react", () => ({
	VSCodeButton: ({ children, onClick, appearance, "data-testid": dataTestId }: any) =>
		appearance === "icon" ? (
			<button
				onClick={onClick}
				className="codicon codicon-close"
				aria-label="Remove command"
				data-testid={dataTestId}>
				<span className="codicon codicon-close" />
			</button>
		) : (
			<button onClick={onClick} data-appearance={appearance} data-testid={dataTestId}>
				{children}
			</button>
		),
	VSCodeCheckbox: ({ children, onChange, checked, "data-testid": dataTestId }: any) => (
		<label>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange({ target: { checked: e.target.checked } })}
				aria-label={typeof children === "string" ? children : undefined}
				data-testid={dataTestId}
			/>
			{children}
		</label>
	),
	VSCodeTextField: ({ value, onInput, placeholder, "data-testid": dataTestId }: any) => (
		<input
			type="text"
			value={value}
			onChange={(e) => onInput({ target: { value: e.target.value } })}
			placeholder={placeholder}
			data-testid={dataTestId}
		/>
	),
	VSCodeLink: ({ children, href }: any) => <a href={href || "#"}>{children}</a>,
	VSCodeRadio: ({ value, checked, onChange }: any) => (
		<input type="radio" value={value} checked={checked} onChange={onChange} />
	),
	VSCodeRadioGroup: ({ children, onChange }: any) => <div onChange={onChange}>{children}</div>,
}))

// Mock Tab components
jest.mock("../../../components/common/Tab", () => ({
	...jest.requireActual("../../../components/common/Tab"),
	Tab: ({ children }: any) => <div data-testid="tab-container">{children}</div>,
	TabHeader: ({ children }: any) => <div data-testid="tab-header">{children}</div>,
	TabContent: ({ children }: any) => <div data-testid="tab-content">{children}</div>,
	TabList: ({ children, value, onValueChange, "data-testid": dataTestId }: any) => {
		// Store onValueChange in a global variable so TabTrigger can access it
		;(window as any).__onValueChange = onValueChange
		return (
			<div data-testid={dataTestId} data-value={value}>
				{children}
			</div>
		)
	},
	TabTrigger: ({ children, value, "data-testid": dataTestId, onClick, isSelected }: any) => {
		// This function simulates clicking on a tab and making its content visible
		const handleClick = () => {
			if (onClick) onClick()
			// Access onValueChange from the global variable
			const onValueChange = (window as any).__onValueChange
			if (onValueChange) onValueChange(value)
			// Make all tab contents invisible
			document.querySelectorAll("[data-tab-content]").forEach((el) => {
				;(el as HTMLElement).style.display = "none"
			})
			// Make this tab's content visible
			const tabContent = document.querySelector(`[data-tab-content="${value}"]`)
			if (tabContent) {
				;(tabContent as HTMLElement).style.display = "block"
			}
		}

		return (
			<button data-testid={dataTestId} data-value={value} data-selected={isSelected} onClick={handleClick}>
				{children}
			</button>
		)
	},
}))

// Mock Slider component
jest.mock("@/components/ui", () => ({
	...jest.requireActual("@/components/ui"),
	Slider: ({ value, onValueChange, "data-testid": dataTestId }: any) => (
		<input
			type="range"
			value={value[0]}
			onChange={(e) => onValueChange([parseFloat(e.target.value)])}
			data-testid={dataTestId}
		/>
	),
}))

// Mock window.postMessage to trigger state hydration
const mockPostMessage = (state: any) => {
	window.postMessage(
		{
			type: "state",
			state: {
				version: "1.0.0",
				clineMessages: [],
				taskHistory: [],
				shouldShowAnnouncement: false,
				allowedCommands: [],
				alwaysAllowExecute: false,
				ttsEnabled: false,
				ttsSpeed: 1,
				soundEnabled: false,
				soundVolume: 0.5,
				currentSearchApiConfigName: "default-jina",
				searchApiConfigurations: [
					{
						id: "jina-1",
						name: "default-jina",
						provider: "jina",
						searchApiProviderName: "jina",
						apiKey: "jina_cf9ea209bc9c4304acdb46536a8de134inoM3wimxNP77Cu0CegxfHUeC0Dp",
						isEnabled: true,
						searchEndpoint: "https://s.jina.ai/",
						enableReranking: false,
						rerankModel: "jina-reranker-v2-base-multilingual",
						rerankEndpoint: "https://api.jina.ai/v1/rerank",
						enableResultEmbeddings: false,
						embeddingModel: "jina-embeddings-v3",
						embeddingEndpoint: "https://api.jina.ai/v1/embeddings",
						embeddingTaskForResult: "retrieval.passage",
						embeddingDimensions: 1024,
					},
					{
						id: "google-1",
						name: "google-config",
						provider: "google_custom_search",
						searchApiProviderName: "google_custom_search",
						apiKey: "test-google-key",
						cxId: "test-cx",
						isEnabled: true,
					},
				],
				activeSearchApiSettings: {
					searchApiProviderName: "jina",
					isEnabled: true,
					apiKey: "jina_cf9ea209bc9c4304acdb46536a8de134inoM3wimxNP77Cu0CegxfHUeC0Dp",
					searchEndpoint: "https://s.jina.ai/",
					enableReranking: false,
					rerankModel: "jina-reranker-v2-base-multilingual",
					rerankEndpoint: "https://api.jina.ai/v1/rerank",
					enableResultEmbeddings: false,
					embeddingModel: "jina-embeddings-v3",
					embeddingEndpoint: "https://api.jina.ai/v1/embeddings",
					embeddingTaskForResult: "retrieval.passage",
					embeddingDimensions: 1024,
				},
				...state,
			},
		},
		"*",
	)
}

class MockResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

global.ResizeObserver = MockResizeObserver

const renderSettingsView = () => {
	const onDone = jest.fn()
	const queryClient = new QueryClient()

	const result = render(
		<ExtensionStateContextProvider>
			<QueryClientProvider client={queryClient}>
				<SettingsView onDone={onDone} />
			</QueryClientProvider>
		</ExtensionStateContextProvider>,
	)

	// Hydrate initial state.
	mockPostMessage({})

	// Helper function to activate a tab and ensure its content is visible
	const activateTab = (tabId: string) => {
		// Skip trying to find and click the tab, just directly render with the target section
		// This bypasses the actual tab clicking mechanism but ensures the content is shown
		result.rerender(
			<ExtensionStateContextProvider>
				<QueryClientProvider client={queryClient}>
					<SettingsView onDone={onDone} targetSection={tabId} />
				</QueryClientProvider>
			</ExtensionStateContextProvider>,
		)
	}

	return { onDone, activateTab }
}

describe("SettingsView - Sound Settings", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("initializes with tts disabled by default", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		const ttsCheckbox = screen.getByTestId("tts-enabled-checkbox")
		expect(ttsCheckbox).not.toBeChecked()

		// Speed slider should not be visible when tts is disabled
		expect(screen.queryByTestId("tts-speed-slider")).not.toBeInTheDocument()
	})

	it("initializes with sound disabled by default", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		const soundCheckbox = screen.getByTestId("sound-enabled-checkbox")
		expect(soundCheckbox).not.toBeChecked()

		// Volume slider should not be visible when sound is disabled
		expect(screen.queryByTestId("sound-volume-slider")).not.toBeInTheDocument()
	})

	it("toggles tts setting and sends message to VSCode", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		const ttsCheckbox = screen.getByTestId("tts-enabled-checkbox")

		// Enable tts
		fireEvent.click(ttsCheckbox)
		expect(ttsCheckbox).toBeChecked()

		// Click Save to save settings
		const saveButton = screen.getByTestId("save-button")
		fireEvent.click(saveButton)

		expect(vscode.postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "ttsEnabled",
				bool: true,
			}),
		)
	})

	it("toggles sound setting and sends message to VSCode", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		const soundCheckbox = screen.getByTestId("sound-enabled-checkbox")

		// Enable sound
		fireEvent.click(soundCheckbox)
		expect(soundCheckbox).toBeChecked()

		// Click Save to save settings
		const saveButton = screen.getByTestId("save-button")
		fireEvent.click(saveButton)

		expect(vscode.postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "soundEnabled",
				bool: true,
			}),
		)
	})

	it("shows tts slider when sound is enabled", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		// Enable tts
		const ttsCheckbox = screen.getByTestId("tts-enabled-checkbox")
		fireEvent.click(ttsCheckbox)

		// Speed slider should be visible
		const speedSlider = screen.getByTestId("tts-speed-slider")
		expect(speedSlider).toBeInTheDocument()
		expect(speedSlider).toHaveValue("1")
	})

	// --- TESTES DE PAYLOAD PARA TODOS OS PROVIDERS ---

	describe("SettingsView - Search API Configuration (Google Custom Search)", () => {
		beforeEach(() => {
			jest.clearAllMocks()
			const SearchApiOptionsMock = jest.requireMock("../SearchApiOptions").default
			SearchApiOptionsMock.mockClear()
		})

		it("envia o payload correto ao salvar alterações", () => {
			mockPostMessage({
				currentSearchApiConfigName: "google-config",
				searchApiConfigurations: [
					{
						id: "google-1",
						name: "google-config",
						provider: "google_custom_search",
						searchApiProviderName: "google_custom_search",
						apiKey: "test-google-key",
						cxId: "test-cx",
						isEnabled: true,
					},
				],
				activeSearchApiSettings: {
					searchApiProviderName: "google_custom_search",
					isEnabled: true,
					apiKey: "test-google-key",
					cxId: "test-cx",
				},
			})
			const { activateTab } = renderSettingsView()
			activateTab("search-api")
			const apiKeyInput = screen.getByLabelText("API Key")
			fireEvent.change(apiKeyInput, { target: { value: "new_google_key" } })
			const cxIdInput = screen.getByLabelText("CX ID")
			fireEvent.change(cxIdInput, { target: { value: "new_cx_id" } })
			const saveButton = screen.getByTestId("save-button")
			fireEvent.click(saveButton)
			expect(vscode.postMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "upsertSearchApiConfiguration",
					payload: expect.objectContaining({
						name: "google-config",
						provider: "google_custom_search",
						searchApiProviderName: "google_custom_search",
						apiKey: "new_google_key",
						cxId: "new_cx_id",
						isEnabled: true,
					}),
				}),
			)
		})
	})

	describe("SettingsView - Search API Configuration (Serper)", () => {
		beforeEach(() => {
			jest.clearAllMocks()
			const SearchApiOptionsMock = jest.requireMock("../SearchApiOptions").default
			SearchApiOptionsMock.mockClear()
		})

		it("envia o payload correto ao salvar alterações", () => {
			mockPostMessage({
				currentSearchApiConfigName: "serper-config",
				searchApiConfigurations: [
					{
						id: "serper-1",
						name: "serper-config",
						provider: "serper",
						searchApiProviderName: "serper",
						apiKey: "test-serper-key",
						isEnabled: true,
					},
				],
				activeSearchApiSettings: {
					searchApiProviderName: "serper",
					isEnabled: true,
					apiKey: "test-serper-key",
				},
			})
			const { activateTab } = renderSettingsView()
			activateTab("search-api")
			const apiKeyInput = screen.getByLabelText("API Key")
			fireEvent.change(apiKeyInput, { target: { value: "new_serper_key" } })
			const saveButton = screen.getByTestId("save-button")
			fireEvent.click(saveButton)
			expect(vscode.postMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "upsertSearchApiConfiguration",
					payload: expect.objectContaining({
						name: "serper-config",
						provider: "serper",
						searchApiProviderName: "serper",
						apiKey: "new_serper_key",
						isEnabled: true,
					}),
				}),
			)
		})
	})

	describe("SettingsView - Search API Configuration (Brave Search)", () => {
		beforeEach(() => {
			jest.clearAllMocks()
			const SearchApiOptionsMock = jest.requireMock("../SearchApiOptions").default
			SearchApiOptionsMock.mockClear()
		})

		it("envia o payload correto ao salvar alterações", () => {
			mockPostMessage({
				currentSearchApiConfigName: "brave-config",
				searchApiConfigurations: [
					{
						id: "brave-1",
						name: "brave-config",
						provider: "brave_search",
						searchApiProviderName: "brave_search",
						apiKey: "test-brave-key",
						isEnabled: true,
					},
				],
				activeSearchApiSettings: {
					searchApiProviderName: "brave_search",
					isEnabled: true,
					apiKey: "test-brave-key",
				},
			})
			const { activateTab } = renderSettingsView()
			activateTab("search-api")
			const apiKeyInput = screen.getByLabelText("API Key")
			fireEvent.change(apiKeyInput, { target: { value: "new_brave_key" } })
			const saveButton = screen.getByTestId("save-button")
			fireEvent.click(saveButton)
			expect(vscode.postMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "upsertSearchApiConfiguration",
					payload: expect.objectContaining({
						name: "brave-config",
						provider: "brave_search",
						searchApiProviderName: "brave_search",
						apiKey: "new_brave_key",
						isEnabled: true,
					}),
				}),
			)
		})
	})

	describe("SettingsView - Search API Configuration (DuckDuckGo Fallback)", () => {
		beforeEach(() => {
			jest.clearAllMocks()
			const SearchApiOptionsMock = jest.requireMock("../SearchApiOptions").default
			SearchApiOptionsMock.mockClear()
		})

		it("envia o payload correto ao salvar alterações", () => {
			mockPostMessage({
				currentSearchApiConfigName: "ddg-config",
				searchApiConfigurations: [
					{
						id: "ddg-1",
						name: "ddg-config",
						provider: "duckduckgo_fallback",
						searchApiProviderName: "duckduckgo_fallback",
						isEnabled: true,
					},
				],
				activeSearchApiSettings: {
					searchApiProviderName: "duckduckgo_fallback",
					isEnabled: true,
				},
			})
			const { activateTab } = renderSettingsView()
			activateTab("search-api")
			const saveButton = screen.getByTestId("save-button")
			fireEvent.click(saveButton)
			expect(vscode.postMessage).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "upsertSearchApiConfiguration",
					payload: expect.objectContaining({
						name: "ddg-config",
						provider: "duckduckgo_fallback",
						searchApiProviderName: "duckduckgo_fallback",
						isEnabled: true,
					}),
				}),
			)
		})
	})

	it("shows volume slider when sound is enabled", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		// Enable sound
		const soundCheckbox = screen.getByTestId("sound-enabled-checkbox")
		fireEvent.click(soundCheckbox)

		// Volume slider should be visible
		const volumeSlider = screen.getByTestId("sound-volume-slider")
		expect(volumeSlider).toBeInTheDocument()
		expect(volumeSlider).toHaveValue("0.5")
	})

	it("updates speed and sends message to VSCode when slider changes", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		// Enable tts
		const ttsCheckbox = screen.getByTestId("tts-enabled-checkbox")
		fireEvent.click(ttsCheckbox)

		// Change speed
		const speedSlider = screen.getByTestId("tts-speed-slider")
		fireEvent.change(speedSlider, { target: { value: "0.75" } })

		// Click Save to save settings
		const saveButton = screen.getByTestId("save-button")
		fireEvent.click(saveButton)

		// Verify message sent to VSCode
		expect(vscode.postMessage).toHaveBeenCalledWith({
			type: "ttsSpeed",
			value: 0.75,
		})
	})

	it("updates volume and sends message to VSCode when slider changes", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the notifications tab
		activateTab("notifications")

		// Enable sound
		const soundCheckbox = screen.getByTestId("sound-enabled-checkbox")
		fireEvent.click(soundCheckbox)

		// Change volume
		const volumeSlider = screen.getByTestId("sound-volume-slider")
		fireEvent.change(volumeSlider, { target: { value: "0.75" } })

		// Click Save to save settings - use getAllByTestId to handle multiple elements
		const saveButtons = screen.getAllByTestId("save-button")
		fireEvent.click(saveButtons[0])

		// Verify message sent to VSCode
		expect(vscode.postMessage).toHaveBeenCalledWith({
			type: "soundVolume",
			value: 0.75,
		})
	})
})

describe("SettingsView - API Configuration", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("renders ApiConfigManagement with correct props", () => {
		renderSettingsView()

		expect(screen.getByTestId("api-config-management")).toBeInTheDocument()
	})
})

describe("SettingsView - Allowed Commands", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("shows allowed commands section when alwaysAllowExecute is enabled", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the autoApprove tab
		activateTab("autoApprove")

		// Enable always allow execute
		const executeCheckbox = screen.getByTestId("always-allow-execute-toggle")
		fireEvent.click(executeCheckbox)
		// Verify allowed commands section appears
		expect(screen.getByTestId("allowed-commands-heading")).toBeInTheDocument()
		expect(screen.getByTestId("command-input")).toBeInTheDocument()
	})

	it("adds new command to the list", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the autoApprove tab
		activateTab("autoApprove")

		// Enable always allow execute
		const executeCheckbox = screen.getByTestId("always-allow-execute-toggle")
		fireEvent.click(executeCheckbox)

		// Add a new command
		const input = screen.getByTestId("command-input")
		fireEvent.change(input, { target: { value: "npm test" } })

		const addButton = screen.getByTestId("add-command-button")
		fireEvent.click(addButton)

		// Verify command was added
		expect(screen.getByText("npm test")).toBeInTheDocument()

		// Verify VSCode message was sent
		expect(vscode.postMessage).toHaveBeenCalledWith({
			type: "allowedCommands",
			commands: ["npm test"],
		})
	})

	it("removes command from the list", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the autoApprove tab
		activateTab("autoApprove")

		// Enable always allow execute
		const executeCheckbox = screen.getByTestId("always-allow-execute-toggle")
		fireEvent.click(executeCheckbox)

		// Add a command
		const input = screen.getByTestId("command-input")
		fireEvent.change(input, { target: { value: "npm test" } })
		const addButton = screen.getByTestId("add-command-button")
		fireEvent.click(addButton)

		// Remove the command
		const removeButton = screen.getByTestId("remove-command-0")
		fireEvent.click(removeButton)

		// Verify command was removed
		expect(screen.queryByText("npm test")).not.toBeInTheDocument()

		// Verify VSCode message was sent
		expect(vscode.postMessage).toHaveBeenLastCalledWith({
			type: "allowedCommands",
			commands: [],
		})
	})

	describe("SettingsView - Tab Navigation", () => {
		beforeEach(() => {
			jest.clearAllMocks()
		})

		it("renders with providers tab active by default", () => {
			renderSettingsView()

			// Check that the tab list is rendered
			const tabList = screen.getByTestId("settings-tab-list")
			expect(tabList).toBeInTheDocument()

			// Check that providers content is visible
			expect(screen.getByTestId("api-config-management")).toBeInTheDocument()
		})

		it("shows unsaved changes dialog when clicking Done with unsaved changes", () => {
			// Render once and get the activateTab helper
			const { activateTab } = renderSettingsView()

			// Activate the notifications tab
			activateTab("notifications")

			// Make a change to create unsaved changes
			const soundCheckbox = screen.getByTestId("sound-enabled-checkbox")
			fireEvent.click(soundCheckbox)

			// Click the Done button
			const doneButton = screen.getByText("settings:common.done")
			fireEvent.click(doneButton)

			// Check that unsaved changes dialog is shown
			expect(screen.getByText("settings:unsavedChangesDialog.title")).toBeInTheDocument()
		})

		it("renders with targetSection prop", () => {
			// Render with a specific target section
			render(
				<ExtensionStateContextProvider>
					<QueryClientProvider client={new QueryClient()}>
						<SettingsView onDone={jest.fn()} targetSection="browser" />
					</QueryClientProvider>
				</ExtensionStateContextProvider>,
			)

			// Hydrate initial state
			mockPostMessage({})

			// Verify browser-related content is visible and API config is not
			expect(screen.queryByTestId("api-config-management")).not.toBeInTheDocument()
		})
	})
})

describe("SettingsView - Duplicate Commands", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("prevents duplicate commands", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the autoApprove tab
		activateTab("autoApprove")

		// Enable always allow execute
		const executeCheckbox = screen.getByTestId("always-allow-execute-toggle")
		fireEvent.click(executeCheckbox)

		// Add a command twice
		const input = screen.getByTestId("command-input")
		const addButton = screen.getByTestId("add-command-button")

		// First addition
		fireEvent.change(input, { target: { value: "npm test" } })
		fireEvent.click(addButton)

		// Second addition attempt
		fireEvent.change(input, { target: { value: "npm test" } })
		fireEvent.click(addButton)

		// Verify command appears only once
		const commands = screen.getAllByText("npm test")
		expect(commands).toHaveLength(1)
	})

	it("saves allowed commands when clicking Save", () => {
		// Render once and get the activateTab helper
		const { activateTab } = renderSettingsView()

		// Activate the autoApprove tab
		activateTab("autoApprove")

		// Enable always allow execute
		const executeCheckbox = screen.getByTestId("always-allow-execute-toggle")
		fireEvent.click(executeCheckbox)

		// Add a command
		const input = screen.getByTestId("command-input")
		fireEvent.change(input, { target: { value: "npm test" } })
		const addButton = screen.getByTestId("add-command-button")
		fireEvent.click(addButton)

		// Click Save - use getAllByTestId to handle multiple elements
		const saveButtons = screen.getAllByTestId("save-button")
		fireEvent.click(saveButtons[0])

		// Verify VSCode messages were sent
		expect(vscode.postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "allowedCommands",
				commands: ["npm test"],
			}),
		)
	})
})

describe("SettingsView - Search API Configuration", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		// Limpar o mock de SearchApiOptions para cada teste, se necessário, ou reconfigurá-lo.
		const SearchApiOptionsMock = jest.requireMock("../SearchApiOptions").default
		SearchApiOptionsMock.mockClear()
	})

	it("renders ApiConfigManager and SearchApiOptions for search-api tab", () => {
		const { activateTab } = renderSettingsView()
		activateTab("search-api")

		expect(screen.getByTestId("api-config-management")).toBeInTheDocument()
		// O mock de ApiConfigManager já exibe o currentApiConfigName, que para Search API será currentSearchApiConfigName
		// O estado inicial mockado tem "default-jina"
		expect(screen.getByText("Current config: default-jina")).toBeInTheDocument()
		expect(screen.getByTestId("search-api-options")).toBeInTheDocument()
	})

	it("updates SearchApiOptions when a different search API profile is selected via ApiConfigManager", async () => {
		const { activateTab } = renderSettingsView()
		activateTab("search-api")

		// Simular a seleção de um novo perfil através do ApiConfigManager
		// Isso é um pouco abstrato porque ApiConfigManager é mockado.
		// Vamos simular o efeito: o estado da extensão é atualizado com o novo perfil ativo.
		mockPostMessage({
			currentSearchApiConfigName: "google-config",
			activeSearchApiSettings: {
				searchApiProviderName: "google_custom_search",
				isEnabled: true,
				apiKey: "test-google-key",
				cxId: "test-cx",
			},
		})

		// Re-render ou esperar que o contexto atualize o componente SearchApiOptions
		// No nosso mock de SearchApiOptions, ele recebe 'config' que reflete activeSearchApiSettings
		// A ativação da aba já causa um re-render que deve pegar o novo estado.
		// Se SearchApiOptions fosse mais complexo, poderíamos precisar de waitFor.

		// Verificar se SearchApiOptions reflete a nova configuração
		// O mock de SearchApiOptions mostra o provedor e um input para apiKey
		expect(screen.getByText("Current config: google-config")).toBeInTheDocument()
		expect(screen.getByTestId("search-api-options")).toHaveTextContent(/Provider:\s*google_custom_search/)
		const apiKeyInput = screen.getByLabelText("API Key") as HTMLInputElement
		expect(apiKeyInput.value).toBe("test-google-key")
		const cxIdInput = await screen.findByLabelText("CX ID")
		expect((cxIdInput as HTMLInputElement).value).toBe("test-cx")
	})

	it("sends upsertSearchApiConfiguration message when saving changes in SearchApiOptions (Jina)", () => {
		const { activateTab } = renderSettingsView()
		activateTab("search-api")

		// Simular mudança no SearchApiOptions (ex: mudar apiKey)
		const apiKeyInput = screen.getByLabelText("API Key")
		fireEvent.change(apiKeyInput, { target: { value: "new_jina_key" } })

		// Clicar em Salvar (o botão de salvar é global para as configurações)
		const saveButton = screen.getByTestId("save-button")
		fireEvent.click(saveButton)

		// Verificar se a mensagem correta foi enviada para o VSCode
		// O payload deve ser a configuração completa, incluindo campos não alterados e os padrões do provedor.
		expect(vscode.postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "upsertSearchApiConfiguration",
				payload: expect.objectContaining({
					name: "default-jina", // Nome da configuração ativa
					provider: "jina",
					searchApiProviderName: "jina",
					apiKey: "new_jina_key", // Valor alterado
					isEnabled: true,
					searchEndpoint: "https://s.jina.ai/",
					enableReranking: false,
					rerankModel: "jina-reranker-v2-base-multilingual",
					rerankEndpoint: "https://api.jina.ai/v1/rerank",
					enableResultEmbeddings: false,
					embeddingModel: "jina-embeddings-v3",
					embeddingEndpoint: "https://api.jina.ai/v1/embeddings",
					embeddingTaskForResult: "retrieval.passage",
					embeddingDimensions: 1024,
				}),
			}),
		)
	})

	it("sends upsertSearchApiConfiguration message when saving changes in SearchApiOptions (Google Custom Search)", () => {
		const { activateTab } = renderSettingsView()
		// Simular seleção do perfil Google
		mockPostMessage({
			currentSearchApiConfigName: "google-config",
			activeSearchApiSettings: {
				searchApiProviderName: "google_custom_search",
				isEnabled: true,
				apiKey: "test-google-key",
				cxId: "test-cx",
			},
		})
		activateTab("search-api")

		// Simular mudança no SearchApiOptions (ex: mudar apiKey e cxId)
		const apiKeyInput = screen.getByLabelText("API Key")
		fireEvent.change(apiKeyInput, { target: { value: "new_google_key" } })
		const cxIdInput = screen.getByLabelText("CX ID")
		fireEvent.change(cxIdInput, { target: { value: "new_cx_id" } })

		// Clicar em Salvar
		const saveButton = screen.getByTestId("save-button")
		fireEvent.click(saveButton)

		// Verificar se a mensagem correta foi enviada para o VSCode
		expect(vscode.postMessage).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "upsertSearchApiConfiguration",
				payload: expect.objectContaining({
					name: "google-config",
					provider: "google_custom_search",
					searchApiProviderName: "google_custom_search",
					apiKey: "new_google_key",
					cxId: "new_cx_id",
					isEnabled: true,
				}),
			}),
		)
	})
})
