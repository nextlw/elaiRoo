import React from "react"
import { render, screen } from "@testing-library/react"
import DuckDuckGoFallbackProviderSettings from "../DuckDuckGoFallbackProviderSettings" // Assumindo que o caminho está correto
import { duckduckgoFallbackSearchApiSchema } from "@roo-code/types" // Caminho corrigido para schemas
import { z } from "zod"

// Mock VSCodeCheckbox, pois é o único controle esperado aqui
jest.mock("@vscode/webview-ui-toolkit/react", () => ({
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

type DuckDuckGoConfigType = z.infer<typeof duckduckgoFallbackSearchApiSchema>

describe("DuckDuckGoFallbackProviderSettings", () => {
	const mockOnConfigChange = jest.fn()
	const baseConfig: DuckDuckGoConfigType = {
		searchApiProviderName: "duckduckgo_fallback",
		isEnabled: true,
	}

	beforeEach(() => {
		mockOnConfigChange.mockClear()
	})

	it("renders informational message when searchApiConfiguration is for DuckDuckGo", () => {
		render(
			(
				<DuckDuckGoFallbackProviderSettings
					searchApiConfiguration={baseConfig}
					setSearchApiConfigurationField={mockOnConfigChange}
					// setSearchApiConfigurationField e disabled não são usados por este componente
					// A prop onConfigChange também não é usada, então pode ser omitida se não for necessária para o mock
				/>
			) as any,
		)
		expect(
			screen.getByText(
				"DuckDuckGo (Fallback) is enabled as a search option and does not require additional API key configuration.",
			),
		).toBeInTheDocument()
		// O componente não renderiza um checkbox "isEnabled", então o teste anterior para isso foi removido.
	})

	it("renders nothing if searchApiConfiguration is not for DuckDuckGo", () => {
		const otherConfig: DuckDuckGoConfigType = {
			...baseConfig,
			searchApiProviderName: "duckduckgo_fallback", // Outro provedor
		}
		render((<DuckDuckGoFallbackProviderSettings searchApiConfiguration={otherConfig} />) as any)
		expect(
			screen.queryByText(
				"DuckDuckGo (Fallback) is enabled as a search option and does not require additional API key configuration.",
			),
		).not.toBeInTheDocument()
	})

	// Testes para 'disabled' ou 'setSearchApiConfigurationField' não são necessários
	// pois o componente é puramente informativo e não usa essas props.
	// O mock de VSCodeCheckbox também não é estritamente necessário, pois o componente não o utiliza.
	// No entanto, mantê-lo não prejudica, caso futuras alterações o utilizem.
	it("renders correctly even if disabled prop was passed (should still show message)", () => {
		render(
			(
				<DuckDuckGoFallbackProviderSettings
					searchApiConfiguration={baseConfig}
					disabled // A prop é ignorada pelo componente
				/>
			) as any,
		)
		expect(
			screen.getByText(
				"DuckDuckGo (Fallback) is enabled as a search option and does not require additional API key configuration.",
			),
		).toBeInTheDocument()
	})
})
