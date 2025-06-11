import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { WebSearchResultsBlock } from "../WebSearchResultsBlock"

// Mock para o MarkdownBlock, que é uma dependência direta e causa problemas com módulos ESM.
jest.mock("../../common/MarkdownBlock", () => ({
	__esModule: true,
	default: ({ markdown }: { markdown: string }) => <div>{markdown}</div>,
}))

// Mock para o hook de tradução, para que o componente possa renderizar o texto do cabeçalho.
jest.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string) => key, // Retorna a própria chave para simplificar a verificação
	}),
}))

describe("WebSearchResultsBlock", () => {
	const mockResults = [
		{
			title: "Resultado de Teste 1",
			url: "https://example.com/1",
			snippet: "Este é o primeiro snippet de exemplo.",
			score: 0.9,
		},
		{
			title: "Resultado de Teste 2",
			url: "https://example.com/2",
			snippet: "Este é o segundo snippet de exemplo.",
			score: 0.8,
		},
	]

	it("deve renderizar os resultados da busca corretamente", () => {
		render(<WebSearchResultsBlock results={mockResults} />)

		// Verifica se os títulos estão na tela
		expect(screen.getByText("Resultado de Teste 1")).toBeInTheDocument()
		expect(screen.getByText("Resultado de Teste 2")).toBeInTheDocument()

		// Verifica se os snippets (renderizados pelo nosso dublê) estão na tela
		expect(screen.getByText("Este é o primeiro snippet de exemplo.")).toBeInTheDocument()
		expect(screen.getByText("Este é o segundo snippet de exemplo.")).toBeInTheDocument()

		// Verifica se os links estão corretos
		expect(screen.getByText("Resultado de Teste 1").closest("a")).toHaveAttribute("href", "https://example.com/1")
		expect(screen.getByText("Resultado de Teste 2").closest("a")).toHaveAttribute("href", "https://example.com/2")

		// Verifica se o favicon do domínio está presente
		const images = screen.getAllByRole("img")
		expect(images[0]).toHaveAttribute("alt", "example.com favicon")
	})

	it("deve estar recolhido se a propriedade isCollapsed for verdadeira", () => {
		render(<WebSearchResultsBlock results={mockResults} isCollapsed={true} />)

		// O conteúdo principal não deve estar visível
		expect(screen.queryByText("Resultado de Teste 1")).not.toBeInTheDocument()
		expect(screen.queryByText("example.com")).not.toBeInTheDocument()

		// Mas o cabeçalho deve estar visível
		expect(screen.getByText("chat:web_search.results")).toBeInTheDocument()
	})

	it("deve chamar onToggleCollapse quando o cabeçalho for clicado", () => {
		const handleToggle = jest.fn()
		render(<WebSearchResultsBlock results={mockResults} onToggleCollapse={handleToggle} />)

		// O componente aninha o evento de clique, então pegamos o elemento pai do texto
		const header = screen.getByText("chat:web_search.results").parentElement?.parentElement
		expect(header).toBeInTheDocument()

		if (header) {
			fireEvent.click(header)
		}

		expect(handleToggle).toHaveBeenCalledTimes(1)
	})
})
