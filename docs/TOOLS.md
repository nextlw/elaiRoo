# Guia de Ferramentas Roo (Core & MCP)

## Estrutura de Diretórios

```
src/
├── core/
│   ├── tools/           # Ferramentas core (TypeScript)
│   ├── webview/         # Integração com UI/webview
│   └── prompts/         # Prompts e fluxos de interação
├── services/
│   └── mcp/             # Servidores MCP (TS, Python, Go, etc)
│       ├── [nome-server]/
│       │   └── ...      # Implementação específica
├── shared/
│   └── tools.ts         # Registro e schema das ferramentas core
docs/
└── TOOLS.md             # Este guia
```

## Fluxo de Registro de Ferramentas

### Ferramenta Core (TypeScript)

1. **Criar arquivo** em [`src/core/tools`](src/core/tools).
2. **Implementar** seguindo o padrão [`applyDiffTool.ts`](src/core/tools/applyDiffTool.ts:15).
3. **Registrar** no [`ToolRegistry`](src/shared/tools.ts:42).
4. **Adicionar testes** em `src/__tests__/` e/ou `e2e/`.
5. **Documentar** em [`docs/TOOLS.md`](docs/TOOLS.md) e [`API.md`](docs/API.md).

### Ferramenta MCP (TypeScript, Python, Go)

1. **Criar servidor** em [`src/services/mcp`](src/services/mcp).
2. **Implementar** a ferramenta (exemplo: Python, Go, TS).
3. **Registrar** no [`McpServerManager`](src/services/mcp/McpServerManager.ts:23).
4. **Adicionar testes** na pasta do servidor e/ou `e2e/`.
5. **Documentar** em [`docs/TOOLS.md`](docs/TOOLS.md).

## Exemplos de Implementação

### TypeScript (Core)

- [`applyDiffTool.ts`](src/core/tools/applyDiffTool.ts:15)
- [`web_search`](src/shared/tools.ts:127)

### Python (MCP)

- [`word-document-server`](src/services/mcp/Office-Word-MCP-Server/word_mcp_server.py:8)

### Go (MCP)

- [`main.go`](src/services/mcp/whatsapp-mcp/whatsapp-bridge/main.go)

## Integração

- **Registro Core:** [`ToolRegistry`](src/shared/tools.ts:42)
- **Registro MCP:** [`McpServerManager`](src/services/mcp/McpServerManager.ts:23)
- **Testes:** `src/__tests__/`, `e2e/`

# Arquitetura de Ferramentas Roo

## Fluxo de Registro de Ferramentas

1. **Implementação da ferramenta (TypeScript):**

```typescript
// src/core/tools/novaTool.ts
export const novaTool = {
  name: 'nova_ferramenta',
  description: 'Descrição funcional',
  parameters: {...},
  execute: async (...) => {
    // Lógica principal
  }
};
```

2. **Registro no sistema core:**

```typescript
// src/shared/tools.ts (Linha 42)
ToolRegistry.registerTool(novaTool)
```

3. **Implementação MCP (Python):**

```python
# src/services/mcp/meu-servidor/main.py
class MinhaFerramenta(McpTool):
    def execute(self, args):
        # Implementação específica do servidor
        return {"status": "sucesso"}
```

4. **Integração com McpServerManager:**

```typescript
// src/services/mcp/McpServerManager.ts (Linha 23)
serverManager.registerServer({
	name: "meu-servidor",
	tools: [MinhaFerramenta],
	// Configurações adicionais
})
```

## Boas Práticas

- Referenciar implementações existentes como [applyDiffTool.ts](src/core/tools/applyDiffTool.ts:15)
- Manter documentação sincronizada com [ToolRegistry](src/shared/tools.ts:42)
- Implementar testes usando [e2e/testing-framework.ts](e2e/testing-framework.ts)
- [`word-document-server`](src/services/mcp/Office-Word-MCP-Server/word_mcp_server.py:8)

### Go (MCP)

- [`main.go`](src/services/mcp/whatsapp-mcp/whatsapp-bridge/main.go)

## Integração

- **Registro Core:** [`ToolRegistry`](src/shared/tools.ts:42)
- **Registro MCP:** [`McpServerManager`](src/services/mcp/McpServerManager.ts:23)
- **Testes:** `src/__tests__/`, `e2e/`

---
