import { webSearchTool } from "../webSearchTool"

const mockPerformWebSearch = jest.fn()

jest.mock("../webSearchUtils", () => ({
	performWebSearch: mockPerformWebSearch,
}))

describe("WebSearchTool", () => {
	beforeEach(() => {
		mockPerformWebSearch.mockClear()
	})

	it("deve chamar pushToolResult com os resultados", async () => {
		const mockResults = "Resultados"
		mockPerformWebSearch.mockResolvedValue(mockResults)
		const mockTask = {} as any
		const mockToolUse: any = { id: "1", type: "tool", name: "web_search", parameters: { query: "teste" } }
		const mockCallbacks = { pushToolResult: jest.fn(), pushToolError: jest.fn() } as any
		await webSearchTool(mockTask, mockToolUse, mockCallbacks)
		expect(mockCallbacks.pushToolResult).toHaveBeenCalledTimes(1)
		expect(mockCallbacks.pushToolResult).toHaveBeenCalledWith(mockResults)
		expect(mockCallbacks.pushToolError).not.toHaveBeenCalled()
	})
})
