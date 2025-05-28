import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import SerperProviderSettings from "../SerperProviderSettings" // Assumindo que o caminho está correto
import { serperApiSchema } from "@roo-code/types" // Caminho corrigido para schemas
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

type SerperConfigType = z.infer<typeof serperApiSchema>

describe("SerperProviderSettings", () => {
	const mockOnConfigChange = jest.fn()
	const baseConfig: SerperConfigType = {
		searchApiProviderName: "serper",
		isEnabled: true,
		apiKey: "test-serper-api-key",
	}

	beforeEach(() => {
		mockOnConfigChange.mockClear()
	})

	it("renders API key field with initial value", () => {
		render(
			(
				<SerperProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)
		// O label correto é "Serper API Key" conforme o componente
		const apiKeyInput = screen.getByLabelText("Serper API Key")
		expect(apiKeyInput).toBeInTheDocument()
		expect(apiKeyInput).toHaveValue("test-serper-api-key")
		// O checkbox de isEnabled não é renderizado por este componente específico
	})

	it("calls setSearchApiConfigurationField with updated API key", () => {
		render(
			(
				<SerperProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)
		const apiKeyInput = screen.getByLabelText("Serper API Key")
		fireEvent.input(apiKeyInput, { target: { value: "new-serper-api-key" } }) // Usar fireEvent.input para VSCodeTextField

		expect(mockOnConfigChange).toHaveBeenCalledWith("apiKey", "new-serper-api-key")
	})

	// O teste para isEnabled não é mais relevante aqui, pois o componente
	// SerperProviderSettings não gerencia diretamente o estado de isEnabled.
	it("disables field when disabled prop is true", () => {
		render(
			(
				<SerperProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
					disabled
				/>
			) as any,
		)
		expect(screen.getByLabelText("Serper API Key")).toBeDisabled()
	})
})
