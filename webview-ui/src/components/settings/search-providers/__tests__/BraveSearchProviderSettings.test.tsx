import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import BraveSearchProviderSettings from "../BraveSearchProviderSettings" // Assumindo que o caminho está correto
import { braveSearchApiSchema } from "../../../../../../src/schemas" // Caminho corrigido para schemas
import { z } from "zod"

// Mock VSCodeTextField e outros componentes UI se necessário
jest.mock("@vscode/webview-ui-toolkit/react", () => ({
	VSCodeTextField: ({ label, value, onInput, "data-testid": dataTestId }: any) => (
		<div>
			<label htmlFor={dataTestId}>{label}</label>
			<input
				id={dataTestId}
				type="text"
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

type BraveConfigType = z.infer<typeof braveSearchApiSchema>

describe("BraveSearchProviderSettings", () => {
	const mockOnConfigChange = jest.fn()
	const baseConfig: BraveConfigType = {
		searchApiProviderName: "brave_search",
		isEnabled: true,
		apiKey: "test-brave-api-key",
	}

	beforeEach(() => {
		mockOnConfigChange.mockClear()
	})

	it("renders API key field with initial value", () => {
		render(
			(
				<BraveSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)
		const apiKeyInput = screen.getByLabelText("Brave Search API Key")
		expect(apiKeyInput).toBeInTheDocument()
		expect(apiKeyInput).toHaveValue("test-brave-api-key")
	})

	it("calls setSearchApiConfigurationField with updated API key", () => {
		render(
			(
				<BraveSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)
		const apiKeyInput = screen.getByLabelText("Brave Search API Key")
		fireEvent.input(apiKeyInput, { target: { value: "new-brave-api-key" } }) // Usar fireEvent.input
		expect(mockOnConfigChange).toHaveBeenCalledWith("apiKey", "new-brave-api-key")
	})

	// O teste para isEnabled não é mais relevante aqui
	it("disables field when disabled prop is true", () => {
		render(
			(
				<BraveSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
					disabled
				/>
			) as any,
		)
		expect(screen.getByLabelText("Brave Search API Key")).toBeDisabled()
	})
})
