import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import SearchApiOptions from "../SearchApiOptions" // Assumindo que o caminho está correto
import { SearchApiSettings } from "../../../../../src/schemas" // Caminho corrigido

// Mock dos componentes de provedor específicos
jest.mock("../search-providers/JinaSearchProviderSettings", () => ({
	__esModule: true,
	default: jest.fn(({ searchApiConfiguration, setSearchApiConfigurationField }) => (
		<div data-testid="jina-settings">
			<label htmlFor="jina-apiKey">Jina API Key</label>
			<input
				id="jina-apiKey"
				type="text"
				value={searchApiConfiguration?.apiKey || ""}
				onChange={(e) => setSearchApiConfigurationField("apiKey", e.target.value)}
			/>
		</div>
	)),
}))

jest.mock("../search-providers/GoogleCustomSearchProviderSettings", () => ({
	__esModule: true,
	default: jest.fn(({ config, onConfigChange }) => (
		<div data-testid="google-settings">
			<label htmlFor="google-apiKey">Google API Key</label>
			<input
				id="google-apiKey"
				type="text"
				value={config.apiKey || ""}
				onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
			/>
			<label htmlFor="google-cxId">Google CX ID</label>
			<input
				id="google-cxId"
				type="text"
				value={config.cxId || ""}
				onChange={(e) => onConfigChange({ ...config, cxId: e.target.value })}
			/>
		</div>
	)),
}))

jest.mock("../search-providers/SerperProviderSettings", () => ({
	__esModule: true,
	default: jest.fn(({ config, onConfigChange }) => (
		<div data-testid="serper-settings">
			<label htmlFor="serper-apiKey">Serper API Key</label>
			<input
				id="serper-apiKey"
				type="text"
				value={config.apiKey || ""}
				onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
			/>
		</div>
	)),
}))

jest.mock("../search-providers/BraveSearchProviderSettings", () => ({
	__esModule: true,
	default: jest.fn(({ config, onConfigChange }) => (
		<div data-testid="brave-settings">
			<label htmlFor="brave-apiKey">Brave API Key</label>
			<input
				id="brave-apiKey"
				type="text"
				value={config.apiKey || ""}
				onChange={(e) => onConfigChange({ ...config, apiKey: e.target.value })}
			/>
		</div>
	)),
}))

jest.mock("../search-providers/DuckDuckGoFallbackProviderSettings", () => ({
	__esModule: true,
	default: jest.fn(() => <div data-testid="duckduckgo-settings">No settings for DuckDuckGo.</div>),
}))

describe("SearchApiOptions", () => {
	const mockOnConfigChange = jest.fn()

	beforeEach(() => {
		mockOnConfigChange.mockClear()
		// Limpar mocks dos componentes de provedor
		require("../search-providers/JinaSearchProviderSettings").default.mockClear()
		require("../search-providers/GoogleCustomSearchProviderSettings").default.mockClear()
		// Adicione outros provedores aqui se necessário
	})

	it("renders nothing if no config is provided", () => {
		render(
			<SearchApiOptions searchApiConfiguration={undefined} setSearchApiConfigurationField={mockOnConfigChange} />,
		)
		expect(screen.queryByTestId("jina-settings")).not.toBeInTheDocument()
		expect(screen.queryByTestId("google-settings")).not.toBeInTheDocument()
	})

	it("renders Jina settings when Jina provider is selected", () => {
		const jinaConfig: SearchApiSettings = {
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
		}
		render(
			<SearchApiOptions
				searchApiConfiguration={jinaConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)
		expect(screen.getByTestId("jina-settings")).toBeInTheDocument()
		expect(screen.getByLabelText("Jina API Key")).toHaveValue(
			"jina_cf9ea209bc9c4304acdb46536a8de134inoM3wimxNP77Cu0CegxfHUeC0Dp",
		)
		expect(screen.queryByTestId("google-settings")).not.toBeInTheDocument()
	})

	it("renders Google settings when Google Custom Search provider is selected", () => {
		const googleConfig: SearchApiSettings = {
			searchApiProviderName: "google_custom_search",
			apiKey: "test-google-key",
			cxId: "test-cx-id",
			isEnabled: true,
		}
		render(
			<SearchApiOptions
				searchApiConfiguration={googleConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)
		expect(screen.getByTestId("google-settings")).toBeInTheDocument()
		expect(screen.getByLabelText("Google API Key")).toHaveValue("test-google-key")
		expect(screen.getByLabelText("Google CX ID")).toHaveValue("test-cx-id")
		expect(screen.queryByTestId("jina-settings")).not.toBeInTheDocument()
	})

	it("calls onConfigChange with updated Jina apiKey", () => {
		const jinaConfig: SearchApiSettings = {
			searchApiProviderName: "jina",
			apiKey: "old-jina-key",
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
		}
		render(
			<SearchApiOptions
				searchApiConfiguration={jinaConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)

		const apiKeyInput = screen.getByLabelText("Jina API Key")
		fireEvent.change(apiKeyInput, { target: { value: "new-jina-key" } })

		expect(mockOnConfigChange).toHaveBeenCalledWith({
			...jinaConfig,
			apiKey: "new-jina-key",
		})
	})

	it("calls onConfigChange with updated Google apiKey and cxId", () => {
		const googleConfig: SearchApiSettings = {
			searchApiProviderName: "google_custom_search",
			apiKey: "old-google-key",
			cxId: "old-cx-id",
			isEnabled: true,
		}
		render(
			<SearchApiOptions
				searchApiConfiguration={googleConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)

		const apiKeyInput = screen.getByLabelText("Google API Key")
		fireEvent.change(apiKeyInput, { target: { value: "new-google-key" } })

		expect(mockOnConfigChange).toHaveBeenCalledWith({
			...googleConfig,
			apiKey: "new-google-key",
		})
		mockOnConfigChange.mockClear() // Limpar para o próximo fireEvent

		const cxIdInput = screen.getByLabelText("Google CX ID")
		fireEvent.change(cxIdInput, { target: { value: "new-cx-id" } })

		expect(mockOnConfigChange).toHaveBeenCalledWith({
			...googleConfig,
			// apiKey ainda será "old-google-key" aqui porque o estado do componente mockado não é atualizado entre chamadas de onConfigChange
			// Para um teste mais robusto, o componente SearchApiOptions real gerenciaria seu estado interno.
			// No contexto deste mock, cada change chama onConfigChange com o estado original + a mudança específica.
			apiKey: "old-google-key", // Ou o valor que o componente mockado passou para onConfigChange
			cxId: "new-cx-id",
		})
	})

	it("renders DuckDuckGo settings (which is just a message)", () => {
		const ddgConfig: SearchApiSettings = {
			searchApiProviderName: "duckduckgo_fallback",
			isEnabled: true,
		}
		render(
			<SearchApiOptions searchApiConfiguration={ddgConfig} setSearchApiConfigurationField={mockOnConfigChange} />,
		)
		expect(screen.getByTestId("duckduckgo-settings")).toBeInTheDocument()
		expect(screen.getByText("No settings for DuckDuckGo.")).toBeInTheDocument()
	})
})
