# Plano de Implementação da Ferramenta Web Search

## Visão Geral

A ferramenta `web_search` já existe parcialmente no projeto (arquivo: `src/core/tools/webSearchTool.ts`) e precisa ser aprimorada com integração ao sistema Deep Research como fallback avançado. Este plano detalha a implementação completa seguindo os padrões existentes do projeto.

## Análise da Implementação Atual

### Estado Atual (✓ Já Implementado)

1. **Arquivo Principal**: `src/core/tools/webSearchTool.ts` (598 linhas)
2. **Schema**: Definido em `src/schemas/index.ts` (linhas 1270-1280)
3. **Prompt**: Implementado em `src/core/prompts/tools/web-search.ts`
4. **Tipos**: Registrados em todos os arquivos de tipos necessários
5. **Registros de Comando**: Presente em `src/activate/registerCommands.ts`

### Funcionalidades Existentes

- ✅ Integração com API Jina (busca, reranking, embeddings)
- ✅ Fallback para DuckDuckGo via browser automation
- ✅ Sistema de aprovação e validação
- ✅ Re-ranqueamento de resultados
- ✅ Metadados enriquecidos (favicon, lastModified)
- ✅ Logging estruturado

## Lacunas Identificadas

### 1. Sistema de Fallback Avançado (❌ Não Implementado)

- Integração com Deep Research (`localhost:3002`)
- Processamento de queries complexas
- Reasoning avançado

### 2. Testes Inadequados (❌ Parcialmente Implementado)

- Arquivo: `src/core/tools/__tests__/webSearchTool.test.ts` existe mas é básico
- Faltam testes de integração
- Faltam testes de fallback

### 3. Interface de Resultados (❌ Não Verificado)

- Componentes webview para exibição
- Formatação de resultados

## Fases de Implementação

## **FASE 1: Análise e Preparação** ⏱️ 2h

### 1.1 Verificação da Implementação Atual

- [ ] **Checklist Item 1.1.1**: Testar funcionalidade básica da web_search

    - **Arquivo**: `src/core/tools/__tests__/webSearchTool.test.ts`
    - **Teste**: Executar `npm test webSearchTool.test.ts`
    - **Evidência Esperada**: Log mostrando resultados da API Jina
    - **JSON de Entrada**:
        ```json
        {
        	"query": "capital da França",
        	"num_results": 3
        }
        ```
    - **JSON de Saída Esperado**:
        ```json
        {
        	"provider": "jina",
        	"query": "capital da França",
        	"results": [
        		{
        			"title": "...",
        			"link": "...",
        			"snippet": "...",
        			"score": 0.95
        		}
        	]
        }
        ```

- [ ] **Checklist Item 1.1.2**: Verificar configuração da API Jina
    - **Arquivo**: Verificar em configurações do usuário
    - **Teste**: Validar se `jinaApiKey` está configurada
    - **Evidência Esperada**: Settings mostrando API key configurada

### 1.2 Análise do Sistema Deep Research

- [ ] **Checklist Item 1.2.1**: Verificar conectividade com Deep Research

    - **Comando**: `curl http://localhost:3002/health`
    - **Evidência Esperada**: Resposta 200 OK

- [ ] **Checklist Item 1.2.2**: Analisar schemas de entrada/saída
    - **Arquivo**: `/Users/williamduarte/NCMproduto/cmex_poc/docs/implementacao/schemas.md`
    - **Evidência**: Documentação dos schemas de comunicação

## **FASE 2: Implementação do Fallback Deep Research** ⏱️ 8h

### 2.1 Criar Interface de Comunicação

- [ ] **Checklist Item 2.1.1**: Implementar cliente HTTP para Deep Research

    - **Arquivo**: `src/core/tools/deepResearch/client.ts`
    - **Linhas**: 1-150
    - **JSON de Entrada**:
        ```json
        {
        	"query": "string",
        	"tokenBudget": 100000,
        	"maxBadAttempts": 2,
        	"numReturnedURLs": 10,
        	"boostHostnames": ["example.com"],
        	"badHostnames": ["spam.com"]
        }
        ```
    - **JSON de Saída**:
        ```json
        {
        	"result": {
        		"action": "answer",
        		"think": "reasoning process",
        		"answer": "final answer",
        		"references": [
        			{
        				"exactQuote": "quote",
        				"url": "source url",
        				"dateTime": "2024-01-01"
        			}
        		]
        	},
        	"visitedURLs": ["url1", "url2"],
        	"readURLs": ["url1"],
        	"allURLs": ["url1", "url2", "url3"]
        }
        ```

- [ ] **Checklist Item 2.1.2**: Implementar tratamento de SSE
    - **Arquivo**: `src/core/tools/deepResearch/sseHandler.ts`
    - **Linhas**: 1-100
    - **Teste**: Conexão SSE funcional
    - **Evidência**: Log de eventos SSE recebidos

### 2.2 Modificar webSearchTool.ts

- [ ] **Checklist Item 2.2.1**: Adicionar fallback Deep Research
    - **Arquivo**: `src/core/tools/webSearchTool.ts`
    - **Linhas**: 350-450
    - **Modificação**: Novo case no switch para "deep_research_fallback"
    - **Teste**:
        ```typescript
        it("should fallback to Deep Research when Jina fails", async () => {
        	// Mock Jina failure
        	// Call webSearchTool with complex query
        	// Verify Deep Research was called
        	// Verify results format
        })
        ```

### 2.3 Atualizar Schema e Tipos

- [ ] **Checklist Item 2.3.1**: Estender WebSearchParams
    - **Arquivo**: `src/schemas/index.ts`
    - **Linhas**: 1270-1290
    - **Adição**:
        ```typescript
        export const webSearchParamsSchema = z.object({
        	tool_name: z.literal("web_search"),
        	query: z.string(),
        	engine: z.string().optional(),
        	num_results: z.number().optional(),
        	use_deep_research: z.boolean().optional(),
        	reasoning_enabled: z.boolean().optional(),
        })
        ```

## **FASE 3: Testes Unitários e de Integração** ⏱️ 6h

### 3.1 Testes Unitários Básicos

- [ ] **Checklist Item 3.1.1**: Teste de validação de parâmetros

    - **Arquivo**: `src/core/tools/__tests__/webSearchTool.test.ts`
    - **Linhas**: 1-50
    - **Objetivo**: Validar schema de entrada
    - **Teste**:
        ```typescript
        describe("Parameter validation", () => {
        	it("should validate required query parameter", async () => {
        		const invalidParams = { num_results: 5 } // missing query
        		const result = webSearchParamsSchema.safeParse(invalidParams)
        		expect(result.success).toBe(false)
        		expect(result.error?.issues[0].path).toEqual(["query"])
        	})
        })
        ```
    - **Evidência**: Teste passa, mostrando validação funcionando

- [ ] **Checklist Item 3.1.2**: Teste de integração com Jina
    - **Arquivo**: `src/core/tools/__tests__/webSearchTool.test.ts`
    - **Linhas**: 51-100
    - **Objetivo**: Verificar chamada API Jina
    - **Teste**:
        ```typescript
        describe("Jina integration", () => {
        	it("should call Jina API with correct parameters", async () => {
        		const mockHttpsRequest = jest.fn().mockResolvedValue({
        			code: 200,
        			data: { results: [mockJinaResult] },
        		})
        		// Test implementation
        		expect(mockHttpsRequest).toHaveBeenCalledWith(
        			expect.objectContaining({
        				hostname: "s.jina.ai",
        				headers: expect.objectContaining({
        					Authorization: expect.stringContaining("Bearer "),
        				}),
        			}),
        		)
        	})
        })
        ```
    - **Evidência**: Mock HTTP chamado com parâmetros corretos

### 3.2 Testes de Integração Deep Research

- [ ] **Checklist Item 3.2.1**: Teste de conectividade

    - **Arquivo**: `src/core/tools/__tests__/deepResearchIntegration.test.ts`
    - **Linhas**: 1-80
    - **Objetivo**: Verificar comunicação com localhost:3002
    - **Teste**:
        ```typescript
        describe("Deep Research Integration", () => {
        	it("should connect to Deep Research server", async () => {
        		const response = await fetch("http://localhost:3002/health")
        		expect(response.status).toBe(200)
        		const health = await response.json()
        		expect(health).toHaveProperty("status", "ok")
        	})
        })
        ```
    - **Evidência**: Resposta 200 e JSON de health check

- [ ] **Checklist Item 3.2.2**: Teste de query complexa
    - **Arquivo**: `src/core/tools/__tests__/deepResearchIntegration.test.ts`
    - **Linhas**: 81-150
    - **Objetivo**: Processar query que requer reasoning
    - **JSON de Entrada**:
        ```json
        {
        	"query": "Como implementar análise de sentimento em português usando transformers e qual a diferença de performance entre BERT e DistilBERT para textos curtos?",
        	"use_deep_research": true
        }
        ```
    - **Evidência Esperada**: Resposta estruturada com referências e reasoning

## **FASE 4: Interface e Componentes** ⏱️ 4h

### 4.1 Componente de Resultados de Busca

- [ ] **Checklist Item 4.1.1**: Criar WebSearchResultsBlock

    - **Arquivo**: `webview-ui/src/components/chat/WebSearchResultsBlock.tsx`
    - **Linhas**: 1-200
    - **Função**: Renderizar resultados formatados
    - **Props Interface**:
        ```typescript
        interface WebSearchResultsProps {
        	results: WebSearchResult[]
        	provider: string
        	query: string
        	reasoning?: string
        }
        ```

- [ ] **Checklist Item 4.1.2**: Integrar ao ChatRow
    - **Arquivo**: `webview-ui/src/components/chat/ChatRow.tsx`
    - **Linhas**: Identificar local de inserção
    - **Modificação**: Adicionar case para "web_search_result"

### 4.2 Estados de Loading e Progresso

- [ ] **Checklist Item 4.2.1**: Implementar indicador de progresso
    - **Arquivo**: `webview-ui/src/components/chat/WebSearchProgress.tsx`
    - **Estados**:
        - "Buscando com Jina..."
        - "Processamento Deep Research..."
        - "Analisando resultados..."
    - **Teste**: Verificar transições de estado

## **FASE 5: Testes de Sistema e E2E** ⏱️ 4h

### 5.1 Teste End-to-End

- [ ] **Checklist Item 5.1.1**: Teste completo via UI

    - **Arquivo**: `e2e/src/suite/web-search-e2e.test.ts`
    - **Objetivo**: Simular uso real da ferramenta
    - **Cenário**:
        1. Usuário digita query complexa
        2. Sistema tenta Jina
        3. Falls back para Deep Research
        4. Exibe resultados formatados
    - **Evidência**: Screenshots dos resultados

- [ ] **Checklist Item 5.1.2**: Teste de performance
    - **Arquivo**: `e2e/src/suite/web-search-performance.test.ts`
    - **Métricas**:
        - Tempo de resposta < 30s
        - Uso de tokens < 50k
        - Rate limiting respeitado
    - **Evidência**: Logs de performance

## **FASE 6: Documentação e Refinamento** ⏱️ 2h

### 6.1 Documentação

- [ ] **Checklist Item 6.1.1**: Atualizar documentação da ferramenta

    - **Arquivo**: `docs/tools/web-search.md`
    - **Conteúdo**:
        - Casos de uso
        - Configuração de APIs
        - Troubleshooting
        - Exemplos práticos

- [ ] **Checklist Item 6.1.2**: Atualizar changelog
    - **Arquivo**: `CHANGELOG.md`
    - **Entrada**: Nova versão com melhorias da web_search

## Arquivos a Serem Criados/Modificados

### Novos Arquivos

1. `src/core/tools/deepResearch/client.ts`
2. `src/core/tools/deepResearch/sseHandler.ts`
3. `src/core/tools/__tests__/deepResearchIntegration.test.ts`
4. `webview-ui/src/components/chat/WebSearchResultsBlock.tsx`
5. `webview-ui/src/components/chat/WebSearchProgress.tsx`
6. `e2e/src/suite/web-search-e2e.test.ts`
7. `e2e/src/suite/web-search-performance.test.ts`
8. `docs/tools/web-search.md`

### Arquivos a Modificar

1. `src/core/tools/webSearchTool.ts` (linhas 350-450)
2. `src/schemas/index.ts` (linhas 1270-1290)
3. `src/core/tools/__tests__/webSearchTool.test.ts` (expandir)
4. `webview-ui/src/components/chat/ChatRow.tsx`
5. `CHANGELOG.md`

## Estrutura de Testes

### Padrão dos Testes (Baseado em parseAssistantMessage.test.ts)

```typescript
describe("webSearchTool", () => {
	describe("parameter validation", () => {
		it("should validate required parameters", () => {
			// Test implementation
		})
	})

	describe("API integration", () => {
		it("should call Jina API correctly", async () => {
			// Test implementation
		})

		it("should fallback to Deep Research", async () => {
			// Test implementation
		})
	})

	describe("result processing", () => {
		it("should format results correctly", () => {
			// Test implementation
		})
	})
})
```

## Evidências de Funcionamento por Teste

### 1. Teste de Validação de Parâmetros

**Evidência**: Log Jest mostrando validação Zod funcionando

```
✓ should validate required query parameter (5ms)
✓ should reject invalid num_results (3ms)
```

### 2. Teste de Integração Jina

**Evidência**: Mock HTTP request com headers corretos

```json
{
	"hostname": "s.jina.ai",
	"method": "GET",
	"headers": {
		"Authorization": "Bearer test-api-key",
		"Accept": "application/json"
	}
}
```

### 3. Teste Deep Research

**Evidência**: Resposta estruturada com reasoning

```json
{
  "action": "answer",
  "think": "Para responder sobre análise de sentimento...",
  "answer": "A implementação de análise de sentimento...",
  "references": [...]
}
```

### 4. Teste E2E

**Evidência**: Screenshot da UI mostrando resultados formatados

### 5. Teste de Performance

**Evidência**: Log de métricas

```
Search completed in 12.3s
Tokens used: 23,451 / 50,000
Deep Research fallback: true
Results returned: 8
```

## Dependências e Configurações

### Novas Dependências NPM

```json
{
	"dependencies": {
		"eventsource": "^2.0.2", // Para SSE client
		"node-fetch": "^3.3.2" // Para HTTP client
	},
	"devDependencies": {
		"@types/eventsource": "^1.1.15"
	}
}
```

### Configurações VS Code

```json
{
	"webSearch.jinaApiKey": "user-api-key",
	"webSearch.deepResearchEndpoint": "http://localhost:3002",
	"webSearch.fallbackEnabled": true,
	"webSearch.maxTokensPerQuery": 50000
}
```

## Critérios de Sucesso

### Funcionalidade

- [ ] Busca básica com Jina funciona
- [ ] Fallback para Deep Research funciona
- [ ] Resultados são formatados corretamente
- [ ] Reasoning é preservado e exibido

### Performance

- [ ] Resposta em < 30s para queries complexas
- [ ] Uso eficiente de tokens (< 50k por query)
- [ ] Rate limiting respeitado

### Qualidade

- [ ] Cobertura de testes > 85%
- [ ] Todos os testes E2E passam
- [ ] Documentação completa
- [ ] Logs estruturados para debugging

### Integração

- [ ] Funciona com todos os modos (Code, Architect, Ask, Debug)
- [ ] Integração suave com UI existente
- [ ] Backward compatibility mantida

Este plano garante uma implementação robusta seguindo os padrões estabelecidos do projeto, com testes abrangentes e integração adequada ao sistema Deep Research como fallback avançado.
