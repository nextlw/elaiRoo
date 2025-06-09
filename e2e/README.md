# Testes End-to-End (E2E) - ElaiRoo

Este diretório contém testes end-to-end para validar funcionalidades complexas do ElaiRoo, incluindo a integração com WhatsApp.

## 📋 Testes Disponíveis

### WhatsApp Integration E2E

Arquivo: `src/suite/whatsapp-integration.test.ts`

**Objetivo**: Validar o fluxo completo de integração do WhatsApp, desde o recebimento de mensagens @elai até o envio automático de respostas.

#### Cenários Testados:

1. **Fluxo Completo de Integração**

    - ✅ Recebe mensagem "@elai oi, tudo bem? Como você pode me ajudar?"
    - ✅ Cria nova task no ElaiRoo com metadata do WhatsApp
    - ✅ Processa a task e gera resposta
    - ✅ Envia resposta automaticamente via MCP WhatsApp

2. **Validação de Metadata**
    - ✅ Verifica se task criada contém metadata correto do WhatsApp
    - ✅ Valida número do remetente, chat JID e mensagem original

## 🚀 Como Executar

### Pré-requisitos

1. **ElaiRoo instalado e configurado**
2. **WhatsApp MCP configurado** (opcional para mocks)
3. **VS Code com a extensão ElaiRoo**

### Executando os Testes

```bash
# Navegar para o diretório do projeto
cd /Users/williamduarte/NCMproduto/elaiRoo

# Instalar dependências (se necessário)
npm install

# Executar testes e2e específicos do WhatsApp
npm run test:e2e -- --grep "WhatsApp Integration"

# Ou executar todos os testes e2e
npm run test:e2e
```

### Executando Via VS Code

1. Abrir VS Code no projeto ElaiRoo
2. Ir para a aba "Testing" (ícone de tubo de ensaio)
3. Expandir "E2E Tests"
4. Executar "WhatsApp Integration E2E"

## 🔧 Configuração do Ambiente de Teste

### Mock vs. Integração Real

Os testes são projetados para funcionar em dois modos:

#### Modo Mock (Padrão)

- Simula respostas do MCP WhatsApp
- Não requer WhatsApp real conectado
- Ideal para CI/CD e desenvolvimento

#### Modo Integração Real

- Requer WhatsApp MCP configurado e conectado
- Testa fluxo completo real
- Ideal para validação final

### Variáveis de Teste

```typescript
const testPhoneNumber = "+5585989530473"
const testMessage = "@elai oi, tudo bem? Como você pode me ajudar?"
```

## 📊 Validações Executadas

### 1. Recebimento de Mensagem

```typescript
// Verifica se mensagem @elai é detectada
assert.ok(receivedMessage.text?.includes("@elai"), "A mensagem deveria conter @elai")
assert.strictEqual(receivedMessage.sender_phone_number, testPhoneNumber, "Número correto")
```

### 2. Criação de Task

```typescript
// Verifica se task foi criada com sucesso
assert.ok(taskId, "Uma task deveria ter sido criada")
assert.ok(whatsappMetadata, "Metadata do WhatsApp deveria estar presente")
```

### 3. Processamento e Resposta

```typescript
// Verifica se resposta foi enviada via MCP
assert.strictEqual(sendCall.toolName, "send_message", "Deveria usar send_message")
assert.strictEqual(sendCall.serverName, "whatsapp", "Deveria usar servidor WhatsApp")
```

## 🐛 Troubleshooting

### Erro: "suite is not defined"

- **Causa**: Tipos do Mocha não carregados
- **Solução**: Os testes usam `@ts-ignore` para contornar isso em ambiente de desenvolvimento

### Erro: "globalThis.api is undefined"

- **Causa**: API do ElaiRoo não inicializada
- **Solução**: Certificar que a extensão ElaiRoo está carregada no VS Code

### Timeout nos Testes

- **Causa**: Processamento demorado ou MCP não respondendo
- **Solução**: Aumentar timeout ou verificar logs do MCP

### MCP WhatsApp não responde

- **Causa**: Ponte Go não está rodando ou configurada incorretamente
- **Solução**:

    ```bash
    # Verificar se ponte está rodando
    lsof -i :8080

    # Iniciar ponte manualmente
    cd src/services/mcp/whatsapp-mcp/whatsapp-bridge
    ./whatsapp-bridge
    ```

## 📝 Logs e Debug

### Ativando Logs Detalhados

Os testes incluem logs detalhados com prefixo `[WhatsApp E2E]`:

```typescript
console.log(`[WhatsApp E2E] Simulated WhatsApp message: "${testMessage}" from ${testPhoneNumber}`)
console.log(`[WhatsApp E2E] Task created with ID: ${taskId}`)
console.log(`[WhatsApp E2E] MCP Tool response: ${message.toolName} - ${message.serverName}`)
```

### Verificando Status do MCP

```typescript
// Verificar status do WhatsApp MCP
const status = await mcpHub.callTool("whatsapp", "get_whatsapp_status", {}, "global")
console.log("WhatsApp MCP Status:", status)
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
- name: Run WhatsApp E2E Tests
  run: |
      npm install
      npm run test:e2e -- --grep "WhatsApp Integration"
  env:
      NODE_ENV: test
      WHATSAPP_TEST_MODE: mock
```

### Resultados Esperados

✅ **Sucesso**: Todos os testes passam, indicando que a integração WhatsApp está funcionando

⚠️ **Parcial**: Task é criada mas resposta não é enviada (pode indicar problema no MCP)

❌ **Falha**: Task não é criada ou há erros de configuração

## 📞 Teste Manual

Para validar manualmente a integração:

1. **Configurar WhatsApp MCP**
2. **Escanear QR Code**
3. **Enviar mensagem real**: "@elai oi"
4. **Verificar**: Nova task criada no ElaiRoo
5. **Aguardar**: Resposta automática no WhatsApp

## 🔧 Desenvolvimento

### Adicionando Novos Testes

```typescript
// @ts-ignore - Mocha globals
test("novo cenário de teste", async function () {
	this.timeout(30000)

	const api = globalThis.api
	// ... lógica do teste

	assert.ok(resultado, "Validação deve passar")
})
```

### Utilitários Disponíveis

- `waitUntilCompleted`: Aguarda conclusão de task
- `simulateWhatsAppMessage`: Simula mensagem do WhatsApp
- `waitForMcpToolCall`: Aguarda chamada específica do MCP
- `sleep`: Pausa execução por tempo determinado

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0
