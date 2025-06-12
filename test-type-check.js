"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const index_1 = require("./src/schemas/index")
// Teste se deep_research_fallback é aceito
const providerName = "deep_research_fallback"
// Teste se o schema aceita o valor
const result = index_1.SearchApiProviderNameSchema.safeParse("deep_research_fallback")
console.log("✅ deep_research_fallback type check:", result.success)
console.log("✅ Provider name type:", providerName)
// Teste switch statement
function testSwitch(provider) {
	switch (provider) {
		case "deep_research_fallback":
			return "Deep Research detected"
		case "jina":
			return "Jina detected"
		default:
			return "Other provider"
	}
}
console.log("✅ Switch test:", testSwitch("deep_research_fallback"))
