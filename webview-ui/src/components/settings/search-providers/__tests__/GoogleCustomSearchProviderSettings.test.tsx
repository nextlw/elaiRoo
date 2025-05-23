import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import GoogleCustomSearchProviderSettings from "../GoogleCustomSearchProviderSettings" // Assumindo que o caminho está correto
import { googleCustomSearchApiSchema } from "../../../../../../src/schemas" // Caminho corrigido para schemas
import { z } from "zod"

// Mock VSCodeTextField e outros componentes UI se necessário, similar a SettingsView.test.tsx
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

type GoogleConfigType = z.infer<typeof googleCustomSearchApiSchema>

describe("GoogleCustomSearchProviderSettings", () => {
	const mockOnConfigChange = jest.fn()
	const baseConfig: GoogleConfigType = {
		searchApiProviderName: "google_custom_search",
		isEnabled: true,
		apiKey: "test-api-key",
		cxId: "test-cx-id",
	}

	beforeEach(() => {
		mockOnConfigChange.mockClear()
	})

	it("renders API Key and CX ID fields with initial values", () => {
		render(
			(
				<GoogleCustomSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)

		const apiKeyInput = screen.getByLabelText("Google API Key")
		expect(apiKeyInput).toBeInTheDocument()
		expect(apiKeyInput).toHaveValue("test-api-key")

		const cxIdInput = screen.getByLabelText("Google Programmable Search Engine ID (cx)")
		expect(cxIdInput).toBeInTheDocument()
		expect(cxIdInput).toHaveValue("test-cx-id")
	})

	it("calls setSearchApiConfigurationField with updated apiKey", () => {
		render(
			(
				<GoogleCustomSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)
		const apiKeyInput = screen.getByLabelText("Google API Key")
		fireEvent.input(apiKeyInput, { target: { value: "new-api-key" } })

		expect(mockOnConfigChange).toHaveBeenCalledWith("apiKey", "new-api-key")
	})

	it("calls setSearchApiConfigurationField with updated cxId", () => {
		render(
			(
				<GoogleCustomSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
				/>
			) as any,
		)
		const cxIdInput = screen.getByLabelText("Google Programmable Search Engine ID (cx)")
		fireEvent.input(cxIdInput, { target: { value: "new-cx-id" } })

		expect(mockOnConfigChange).toHaveBeenCalledWith("cxId", "new-cx-id")
	})

	// O teste para isEnabled não é mais relevante aqui, pois o componente
	// GoogleCustomSearchProviderSettings não gerencia diretamente o estado de isEnabled.
	// Esse estado é gerenciado pelo componente pai (SettingsView ou SearchApiOptions).
	// Se precisar testar a desabilitação dos campos, adicione um teste que passe a prop `disabled`.
	it("disables fields when disabled prop is true", () => {
		render(
			(
				<GoogleCustomSearchProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
					disabled
				/>
			) as any,
		)
		expect(screen.getByLabelText("Google API Key")).toBeDisabled()
		expect(screen.getByLabelText("Google Programmable Search Engine ID (cx)")).toBeDisabled()
	})
})
