# API de Ferramentas Roo

Este documento documenta a API das ferramentas disponíveis na arquitetura Roo, incluindo ferramentas core (TypeScript) e servidores MCP (Python, Go, etc.).

## Estrutura da API

### Ferramentas Core (TypeScript)

As ferramentas core são registradas através do [`ToolRegistry`](../src/shared/tools.ts) e seguem a interface:

```typescript
interface ToolSchema {
	name: string
	description: string
	parameters: object
	execute: (args: any) => Promise<any>
}
```

### Servidores MCP

Os servidores MCP são gerenciados pelo [`McpHub`](../src/services/mcp/McpHub.ts) e seguem o protocolo Model Context Protocol.

## Ferramentas Disponíveis

### Core Tools

#### read_file

- **Descrição**: Lê o conteúdo de arquivos de texto
- **Parâmetros**: `{ path: string }`
- **Retorno**: Conteúdo do arquivo com numeração de linhas

#### web_search

- **Descrição**: Busca na web usando diferentes provedores
- **Parâmetros**: `{ query: string, maxResults?: number }`
- **Retorno**: Array de resultados com título, URL e snippet

### Servidores MCP

#### Jina Advanced Search MCP

**Servidor**: `jina-advanced-search`
**Localização**: [`src/services/mcp/jina-advanced-search/`](../src/services/mcp/jina-advanced-search/)

##### Ferramentas Disponíveis

###### advanced_web_search

- **Descrição**: Busca web avançada com capacidades de reranking e análise semântica
- **Parâmetros**:
    ```json
    {
    	"query": "string",
    	"max_results": "number (opcional, padrão: 10)",
    	"include_text": "boolean (opcional, padrão: true)",
    	"include_links": "boolean (opcional, padrão: true)",
    	"target_language": "string (opcional, padrão: 'pt')",
    	"format": "string (opcional: 'markdown'|'html'|'plain')"
    }
    ```
- **Retorno**: Resultados estruturados com texto, links e metadados

###### deep_web_search

- **Descrição**: Busca profunda com análise de múltiplas páginas
- **Parâmetros**:
    ```json
    {
    	"query": "string",
    	"max_pages": "number (opcional, padrão: 5)",
    	"analysis_depth": "string (opcional: 'basic'|'detailed'|'comprehensive')"
    }
    ```

###### multimodal_search

- **Descrição**: Busca multimodal combinando texto, imagens e outros formatos
- **Parâmetros**:
    ```json
    {
    	"query": "string",
    	"modalities": "array (opcional: ['text', 'image', 'video'])",
    	"max_results_per_modality": "number (opcional, padrão: 5)"
    }
    ```

###### temporal_search_analysis

- **Descrição**: Análise temporal de resultados de busca
- **Parâmetros**:
    ```json
    {
    	"query": "string",
    	"time_range": "string (opcional: 'day'|'week'|'month'|'year')",
    	"trend_analysis": "boolean (opcional, padrão: true)"
    }
    ```

###### hybrid_rank_results

- **Descrição**: Reranking híbrido de resultados usando múltiplos algoritmos
- **Parâmetros**:
    ```json
    {
    	"results": "array",
    	"ranking_methods": "array (opcional: ['semantic', 'keyword', 'popularity'])",
    	"weights": "object (opcional)"
    }
    ```

#### WhatsApp MCP

**Servidor**: `whatsapp`
**Localização**: [`src/services/mcp/whatsapp-mcp/`](../src/services/mcp/whatsapp-mcp/)
**Status**: Sistema crítico, sempre ativo

##### Ferramentas Disponíveis

###### whatsapp_send_message

- **Descrição**: Envia mensagem via WhatsApp
- **Parâmetros**:
    ```json
    {
    	"phone": "string",
    	"message": "string"
    }
    ```

###### whatsapp_list_chats

- **Descrição**: Lista conversas ativas
- **Parâmetros**: `{}`
- **Retorno**: Array de conversas com metadados

###### whatsapp_list_messages

- **Descrição**: Lista mensagens de uma conversa
- **Parâmetros**:
    ```json
    {
    	"chat_id": "string",
    	"limit": "number (opcional, padrão: 50)"
    }
    ```

#### Office Word MCP

**Servidor**: `word-document-server`
**Localização**: [`src/services/mcp/Office-Word-MCP-Server/`](../src/services/mcp/Office-Word-MCP-Server/)

##### Ferramentas Disponíveis

###### create_document

- **Descrição**: Cria novo documento Word
- **Parâmetros**: `{ template?: string }`

###### add_paragraph

- **Descrição**: Adiciona parágrafo ao documento
- **Parâmetros**:
    ```json
    {
    	"text": "string",
    	"style": "string (opcional)"
    }
    ```

#### Office PowerPoint MCP

**Servidor**: `powerpoint-mcp-server`
**Localização**: [`src/services/mcp/Office-PowerPoint-MCP-Server/`](../src/services/mcp/Office-PowerPoint-MCP-Server/)

##### Ferramentas Disponíveis

###### create_presentation

- **Descrição**: Cria nova apresentação PowerPoint
- **Parâmetros**: `{}`

###### add_slide

- **Descrição**: Adiciona slide à apresentação
- **Parâmetros**:
    ```json
    {
    	"layout_index": "number",
    	"title": "string (opcional)"
    }
    ```

## Configuração

### Variáveis de Ambiente

```bash
# Jina Advanced Search
JINA_API_KEY=your_jina_api_key
OPENAI_API_KEY=your_openai_api_key

# WhatsApp MCP
WHATSAPP_SESSION_PATH=/path/to/session
```

### Configuração MCP

Os servidores MCP são configurados automaticamente através do [`McpHub`](../src/services/mcp/McpHub.ts). As configurações são armazenadas em:

- **Global**: `~/.roo/settings/mcp_settings.json`
- **Projeto**: `.roo/mcp.json`

### Exemplo de Configuração

```json
{
	"mcpServers": {
		"jina-advanced-search": {
			"type": "stdio",
			"command": "uv",
			"args": ["run", "main.py"],
			"cwd": "src/services/mcp/jina-advanced-search",
			"disabled": false,
			"timeout": 60,
			"alwaysAllow": ["advanced_web_search", "deep_web_search", "multimodal_search"],
			"env": {
				"JINA_API_KEY": "${JINA_API_KEY}",
				"OPENAI_API_KEY": "${OPENAI_API_KEY}"
			}
		}
	}
}
```

## Desenvolvimento

### Adicionando Nova Ferramenta Core

1. Criar arquivo em [`src/core/tools/`](../src/core/tools/)
2. Implementar interface `ToolSchema`
3. Registrar no [`ToolRegistry`](../src/shared/tools.ts)
4. Adicionar testes
5. Documentar neste arquivo

### Adicionando Novo Servidor MCP

1. Criar diretório em [`src/services/mcp/`](../src/services/mcp/)
2. Implementar servidor seguindo protocolo MCP
3. Configurar no [`McpHub`](../src/services/mcp/McpHub.ts)
4. Adicionar testes de integração
5. Documentar neste arquivo

## Testes

### Executando Testes

```bash
# Testes unitários
pnpm test

# Testes de integração
npm run test:e2e

# Teste específico
npx vitest src/__tests__/specific.spec.ts
```

### Estrutura de Testes

- **Unitários**: `src/__tests__/*.spec.ts`
- **Integração**: `e2e/*.spec.ts`
- **MCP**: `src/services/mcp/*/test_*.py`

## Troubleshooting

### Problemas Comuns

1. **Servidor MCP não conecta**

    - Verificar variáveis de ambiente
    - Verificar dependências Python (`uv sync`)
    - Verificar logs no terminal

2. **Ferramenta não encontrada**

    - Verificar registro no sistema apropriado
    - Verificar se servidor está ativo
    - Verificar configuração JSON

3. **Timeout nas chamadas**
    - Aumentar timeout na configuração
    - Verificar conectividade de rede
    - Verificar logs do servidor

### Logs e Debug

```typescript
// Ativar logs detalhados
console.log(McpHub.getAllServers())

// Verificar status dos servidores
McpHub.getServers().forEach((server) => {
	console.log(`${server.name}: ${server.status}`)
})
```

## Versionamento

- **Core Tools**: Versionadas com a extensão principal
- **Servidores MCP**: Versionados independentemente em `pyproject.toml` ou `package.json`

## Contribuição

1. Fork do repositório
2. Criar branch para feature/fix
3. Implementar com testes
4. Atualizar documentação
5. Submeter Pull Request

## Licença

Este projeto está licenciado sob os termos definidos no arquivo LICENSE do repositório principal.
