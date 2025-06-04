// Configurações globais do Jest
global.jest = jest
global.expect = expect

// Configurações específicas para os testes E2E
beforeAll(() => {
	// Configurações que devem ser executadas antes de todos os testes
	console.log("Iniciando testes E2E...")
})

afterAll(() => {
	// Limpeza após todos os testes
	console.log("Finalizando testes E2E...")
})
