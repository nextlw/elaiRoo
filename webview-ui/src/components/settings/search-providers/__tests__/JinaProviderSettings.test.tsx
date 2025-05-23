import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import JinaProviderSettings from "../JinaSearchProviderSettings"
import { jinaSearchApiSchema } from "../../../../../../src/schemas"
import { z } from "zod"

// Mock VSCodeTextField e outros componentes UI se necessário
jest.mock("@vscode/webview-ui-toolkit/react", () => ({
	VSCodeTextField: ({ label, value, onInput, type, "data-testid": dataTestId }: any) => (
		<div>
			<label htmlFor={dataTestId}>{label}</label>
			<input
				id={dataTestId}
				type={type || "text"}
				value={value}
				onChange={(e) => onInput({ target: { value: e.target.value } })}
				data-testid={dataTestId}
			/>
		</div>
	),
	VSCodeCheckbox: ({ children, checked, onChange, "data-testid": dataTestId }: any) => (
		<label>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange({ target: { checked: e.target.checked } })}
				data-testid={dataTestId}
			/>
			{children}
		</label>
	),
}))

type JinaConfigType = z.infer<typeof jinaSearchApiSchema>

describe("JinaProviderSettings", () => {
	const mockOnConfigChange = jest.fn()
	const baseConfig: JinaConfigType = {
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
	}

	beforeEach(() => {
		mockOnConfigChange.mockClear()
	})

	it("renders all Jina specific fields with initial values", () => {
		render(
			<JinaProviderSettings
				searchApiConfiguration={baseConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)

		expect(screen.getByLabelText("API Key")).toHaveValue(baseConfig.apiKey)
		expect(screen.getByLabelText("Search Endpoint")).toHaveValue(baseConfig.searchEndpoint)
		expect(screen.getByLabelText("Enable Reranking")).not.toBeChecked()
		// Não vamos testar o valor de inputs que só aparecem condicionalmente se o checkbox não estiver marcado
		expect(screen.getByLabelText("Enable Result Embeddings")).not.toBeChecked()
		expect(screen.getByLabelText("settings:searchProviders.enable")).toBeChecked() // isEnabled
	})

	it("shows reranking fields when 'Enable Reranking' is checked", () => {
		const configWithReranking = { ...baseConfig, enableReranking: true }
		render(
			<JinaProviderSettings
				searchApiConfiguration={configWithReranking}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)

		expect(screen.getByLabelText("Enable Reranking")).toBeChecked()
		expect(screen.getByLabelText("Rerank Model")).toHaveValue(baseConfig.rerankModel)
		expect(screen.getByLabelText("Rerank Endpoint")).toHaveValue(baseConfig.rerankEndpoint)
	})

	it("shows embedding fields when 'Enable Result Embeddings' is checked", () => {
		const configWithEmbeddings = { ...baseConfig, enableResultEmbeddings: true }
		render(
			<JinaProviderSettings
				searchApiConfiguration={configWithEmbeddings}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)

		expect(screen.getByLabelText("Enable Result Embeddings")).toBeChecked()
		expect(screen.getByLabelText("Embedding Model")).toHaveValue(baseConfig.embeddingModel)
		expect(screen.getByLabelText("Embedding Endpoint")).toHaveValue(baseConfig.embeddingEndpoint)
		expect(screen.getByLabelText("Embedding Task For Result")).toHaveValue(baseConfig.embeddingTaskForResult)
		// O input para embeddingDimensions pode ser do tipo 'number'
		const dimensionsInput = screen.getByLabelText("Embedding Dimensions") as HTMLInputElement
		expect(dimensionsInput.value).toBe(String(baseConfig.embeddingDimensions))
	})

	it("calls onConfigChange with updated apiKey", () => {
		render(
			<JinaProviderSettings
				searchApiConfiguration={baseConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)
		fireEvent.change(screen.getByLabelText("API Key"), { target: { value: "new-jina-key" } })
		expect(mockOnConfigChange).toHaveBeenCalledWith({ ...baseConfig, apiKey: "new-jina-key" })
	})

	it("calls onConfigChange when 'Enable Reranking' is toggled", () => {
		render(
			<JinaProviderSettings
				searchApiConfiguration={baseConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)
		fireEvent.click(screen.getByLabelText("Enable Reranking"))
		expect(mockOnConfigChange).toHaveBeenCalledWith({ ...baseConfig, enableReranking: true })
	})

	it("calls onConfigChange when 'Rerank Model' is changed (if reranking enabled)", () => {
		const configWithReranking = { ...baseConfig, enableReranking: true }
		render(
			<JinaProviderSettings
				searchApiConfiguration={configWithReranking}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)
		fireEvent.change(screen.getByLabelText("Rerank Model"), { target: { value: "new-rerank-model" } })
		expect(mockOnConfigChange).toHaveBeenCalledWith({ ...configWithReranking, rerankModel: "new-rerank-model" })
	})

	it("calls onConfigChange when 'isEnabled' is toggled", () => {
		render(
			<JinaProviderSettings
				searchApiConfiguration={baseConfig}
				setSearchApiConfigurationField={mockOnConfigChange}
			/>,
		)
		fireEvent.click(screen.getByLabelText("settings:searchProviders.enable")) // Assume que o valor inicial é true
		expect(mockOnConfigChange).toHaveBeenCalledWith({ ...baseConfig, isEnabled: false })
	})
})
