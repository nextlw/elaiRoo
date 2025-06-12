const http = require("http")

async function testDirectDeepResearch() {
	console.log("🚀 Testando conexão direta com Deep Research...\n")

	// Primeiro testar health check
	console.log("1. ⚡ Testando health check...")
	try {
		const healthResponse = await makeRequest("GET", "/health", null)
		console.log("✅ Health check:", JSON.stringify(healthResponse))
	} catch (error) {
		console.error("❌ Health check falhou:", error.message)
		return
	}

	// Testar lista de modelos
	console.log("\n2. 📋 Testando lista de modelos...")
	try {
		const modelsResponse = await makeRequest("GET", "/v1/models", null)
		console.log("✅ Modelos disponíveis:", JSON.stringify(modelsResponse, null, 2))
	} catch (error) {
		console.error("❌ Lista de modelos falhou:", error.message)
	}

	// Testar chat completion
	console.log("\n3. 💬 Testando chat completion...")
	const payload = {
		model: "jina-deepsearch-v1",
		messages: [
			{
				role: "user",
				content: "Qual é a capital do Brasil?",
			},
		],
		stream: false,
		budget_tokens: 10000,
		max_attempts: 1,
		max_returned_urls: 3,
	}

	try {
		console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2))
		const chatResponse = await makeRequest("POST", "/v1/chat/completions", payload)
		console.log("✅ Resposta do chat:", JSON.stringify(chatResponse, null, 2))

		if (chatResponse.choices && chatResponse.choices[0]) {
			console.log("\n🧠 Conteúdo da resposta:", chatResponse.choices[0].message.content)
			if (chatResponse.visitedURLs) {
				console.log("🌐 URLs visitados:", chatResponse.visitedURLs.length)
			}
			if (chatResponse.usage) {
				console.log("📊 Uso de tokens:", chatResponse.usage)
			}
		}
	} catch (error) {
		console.error("❌ Chat completion falhou:", error.message)
		console.error("📋 Detalhes do erro:", error.stack)
	}
}

function makeRequest(method, path, body) {
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "localhost",
			port: 3002,
			path: path,
			method: method,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"User-Agent": "elaiRoo-DeepResearch-Test/1.0",
			},
		}

		const req = http.request(options, (res) => {
			let data = ""

			res.on("data", (chunk) => {
				data += chunk
			})

			res.on("end", () => {
				try {
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(JSON.parse(data))
					} else {
						reject(new Error(`HTTP ${res.statusCode}: ${data}`))
					}
				} catch (e) {
					reject(new Error(`Parse error: ${e.message}, Data: ${data}`))
				}
			})
		})

		req.on("error", (error) => {
			reject(error)
		})

		if (body) {
			req.write(JSON.stringify(body))
		}

		req.end()
	})
}

testDirectDeepResearch()
