# Testes End-to-End (E2E) - ElaiRoo

Este diretório contém testes end-to-end para validar funcionalidades complexas do ElaiRoo, incluindo a integração com WhatsApp.

## 📋 Testes Disponíveis

### WhatsApp Integration E2E

Arquivo: `src/suite/whatsapp-integration.test.ts`

**Objetivo**: Validar o fluxo completo de integração do WhatsApp, desde o recebimento de mensagens @elai até o envio automático de respostas.

### Web Search Interface E2E

Arquivo: `src/suite/web-search-interface.test.ts`

**Objetivo**: Validar a funcionalidade completa da ferramenta web_search, incluindo busca com Jina API, fallback para Deep Research, tratamento de erros e performance.

### Web Search UI Components E2E

Arquivo: `src/suite/web-search-ui-components.test.ts`

**Objetivo**: Validar especificamente os componentes de interface do Deep Research, incluindo renderização de dados complexos, acessibilidade e responsividade.

#### Cenários Testados - WhatsApp:

1. **Fluxo Completo de Integração**

    - ✅ Recebe mensagem "@elai oi, tudo bem? Como você pode me ajudar?"
    - ✅ Cria nova task no ElaiRoo com metadata do WhatsApp
    - ✅ Processa a task e gera resposta
    - ✅ Envia resposta automaticamente via MCP WhatsApp

2. **Validação de Metadata**
    - ✅ Verifica se task criada contém metadata correto do WhatsApp
    - ✅ Valida número do remetente, chat JID e mensagem original

#### Cenários Testados - Web Search Interface:

1. **Web Search com Jina API**

    - ✅ Busca básica com API Jina
    - ✅ Formatação correta dos resultados
    - ✅ Validação de parâmetros de entrada
    - ✅ Verificação de scores e metadados

2. **Deep Research Fallback**

    - ✅ Ativação quando Jina falha ou para queries complexas
    - ✅ Processamento de reasoning avançado
    - ✅ Estruturação de referências e citações
    - ✅ Metadados de URLs visitadas e processadas

3. **Performance e Timeout**

    - ✅ Conclusão de buscas dentro do tempo limite
    - ✅ Métricas de performance
    - ✅ Uso eficiente de recursos

4. **Error Handling**
    - ✅ Fallback gracioso para DuckDuckGo
    - ✅ Tratamento de erros de API
    - ✅ Recuperação após falhas

#### Cenários Testados - Web Search UI Components:

1. **DeepResearchResultsBlock Component**

    - ✅ Renderização de dados complexos do Deep Research
    - ✅ Formatação de markdown e código
    - ✅ Estrutura de referências e citações
    - ✅ Validação de estados para toggles

2. **Comparação de Interfaces**

    - ✅ Diferenças entre resultados Jina e Deep Research
    - ✅ Campos específicos para cada provider
    - ✅ Consistency de dados entre providers

3. **Accessibility e Responsividade**
    - ✅ Validação de tamanhos de texto
    - ✅ URLs válidas e não excessivamente longas
    - ✅ Conteúdo adequado para diferentes telas
    - ✅ Prevenção de conteúdo duplicado excessivo

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

# Executar testes e2e específicos do Web Search
npm run test:e2e -- --grep "Web Search"

# Executar testes e2e específicos da Interface
npm run test:e2e -- --grep "UI Components"

# Executar testes e2e específicos do Deep Research
npm run test:e2e -- --grep "Deep Research"

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

### 4. Web Search - Jina API

```typescript
// Verifica se web_search foi chamada corretamente
assert.ok(webSearchCall, "Web search tool should have been called")
assert.ok(webSearchCall.params?.query.toLowerCase().includes("sentimento"), "Query should contain search terms")

// Verifica estrutura dos resultados
assert.ok(completionText.includes("BERT"), "Results should contain relevant content")
```

### 5. Web Search - Deep Research Fallback

```typescript
// Verifica estrutura específica do Deep Research
assert.strictEqual(receivedResults.provider, "deep_research_fallback", "Should use Deep Research provider")
assert.ok(result.deepResearchData, "Should have deep research data")
assert.ok(result.deepResearchData.think, "Should have thinking process")
assert.ok(result.deepResearchData.reasoning, "Should have detailed reasoning")
assert.strictEqual(result.deepResearchData.references.length, 3, "Should have references")
```

### 6. UI Components - Interface Validation

````typescript
// Verifica dados para renderização de interface
assert.ok(deepData.reasoning.includes("# Análise de Interface"), "Should contain markdown headers")
assert.ok(deepData.reasoning.includes("```typescript"), "Should contain code blocks")
assert.ok(result.title.length < 150, "Title should be readable length")
assert.ok(duplicateRatio < 0.5, "Content should not be excessively repetitive")
````

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

### Web Search não responde

- **Causa**: API Jina não configurada ou Deep Research server não disponível
- **Solução**:

    ```bash
    # Verificar se Deep Research está rodando
    curl http://localhost:3002/health

    # Verificar configuração da API Jina
    # Certificar que jinaApiKey está configurada nas settings

    # Testar fallback para DuckDuckGo
    # Os testes devem passar mesmo sem Jina/Deep Research configurados
    ```

### Testes de UI falhando

- **Causa**: Estrutura de dados do DeepResearchResultsBlock mudou
- **Solução**: Atualizar mocks nos testes para refletir nova estrutura

### Performance tests timeout

- **Causa**: Busca real muito lenta ou recursos limitados
- **Solução**:

    ```typescript
    // Aumentar timeout nos testes específicos
    this.timeout(45000) // 45 segundos
    ```

## 📝 Logs e Debug

### Ativando Logs Detalhados

Os testes incluem logs detalhados com prefixos específicos:

**WhatsApp E2E:**

```typescript
console.log(`[WhatsApp E2E] Simulated WhatsApp message: "${testMessage}" from ${testPhoneNumber}`)
console.log(`[WhatsApp E2E] Task created with ID: ${taskId}`)
console.log(`[WhatsApp E2E] MCP Tool response: ${message.toolName} - ${message.serverName}`)
```

**Web Search E2E:**

```typescript
console.log(`[E2E Test] Tool use detected: ${message.toolName}`, message.params)
console.log(`[E2E Test] Mocking Jina web_search result (blockId: ${message.blockId})`)
console.log(`[E2E Test] Deep Research fallback result (blockId: ${message.blockId})`)
```

**UI Components E2E:**

```typescript
console.log("[UI Test] DeepResearchResultsBlock structure validation - Passed")
console.log("[UI Test] Interface state validation - Passed")
console.log("[UI Test] Accessibility validation - Passed")
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

## 📋 Resumo dos Scripts NPM

```bash
# Scripts específicos para cada conjunto de testes
npm run test:e2e:whatsapp      # Testes de integração WhatsApp
npm run test:e2e:web-search    # Testes de funcionalidade Web Search
npm run test:e2e:ui-components # Testes de componentes de interface
npm run test:e2e:deep-research # Testes específicos do Deep Research
npm run test:e2e               # Todos os testes E2E
```

## 🎯 Cobertura de Testes

- **WhatsApp Integration**: ✅ Fluxo completo de mensagens e respostas
- **Web Search - Jina API**: ✅ Busca, formatação, validação de parâmetros
- **Deep Research Fallback**: ✅ Reasoning avançado, referências, metadados
- **Interface Components**: ✅ Renderização, acessibilidade, responsividade
- **Performance & Error Handling**: ✅ Timeouts, fallbacks, recuperação de erros

---

**Última atualização**: Janeiro 2025
**Versão**: 2.0.0 - Incluindo testes completos de Web Search e Deep Research Interface
