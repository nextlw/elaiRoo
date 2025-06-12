const { webSearchTool } = require("./src/core/tools/webSearchTool.ts")

async function testDeepResearchIntegration() {
	console.log("🚀 Testando integração completa com Deep Research...\n")

	// Query complexa que requer reasoning avançado
	const complexQuery =
		"Quais são as principais diferenças entre BERT e GPT em termos de arquitetura, casos de uso e performance para análise de texto em português?"

	const params = {
		tool_name: "web_search",
		query: complexQuery,
		search_provider: "deep_research_fallback",
		num_results: 5,
	}

	try {
		console.log("📝 Query:", complexQuery)
		console.log("⚙️ Parâmetros:", JSON.stringify(params, null, 2))
		console.log("\n⏳ Executando busca...\n")

		const result = await webSearchTool(
			params,
			{},
			() => {},
			() => {},
		)

		console.log("✅ Busca concluída!")
		console.log("📊 Resultados:", JSON.stringify(result, null, 2))

		// Verificar se tem dados do Deep Research
		if (result && result.results && result.results[0] && result.results[0].deepResearchData) {
			console.log("\n🧠 Dados Deep Research encontrados:")
			console.log("💭 Think:", result.results[0].deepResearchData.think)
			console.log("📝 Answer:", result.results[0].deepResearchData.answer)
			console.log("🔗 Referencias:", result.results[0].deepResearchData.references?.length || 0)
			console.log("🌐 URLs visitadas:", result.results[0].deepResearchData.visitedURLs?.length || 0)
		}
	} catch (error) {
		console.error("❌ Erro na integração:", error.message)
		console.error("📋 Stack:", error.stack)
	}
}

testDeepResearchIntegration()
