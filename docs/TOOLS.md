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
- [`powerpoint-mcp-server`](src/services/mcp/Office-PowerPoint-MCP-Server/ppt_mcp_server.py:12)
- [`jina-advanced-search`](src/services/mcp/jina-advanced-search/src/jina_advanced_search/main.py:8)

## Usage

### Starting the Server

Run the server:

```bash
python ppt_mcp_server.py
```

## Available Tools

### Presentation Tools

- **create_presentation**: Create a new PowerPoint presentation
- **open_presentation**: Open an existing PowerPoint presentation from a file
- **save_presentation**: Save the current presentation to a file
- **get_presentation_info**: Get information about the current presentation
- **set_core_properties**: Set core document properties of the current presentation

### Slide Tools

- **add_slide**: Add a new slide to the current presentation
- **get_slide_info**: Get information about a specific slide
- **populate_placeholder**: Populate a placeholder with text
- **add_bullet_points**: Add bullet points to a placeholder

### Text Tools

- **add_textbox**: Add a textbox to a slide

### Image Tools

- **add_image**: Add an image to a slide
- **add_image_from_base64**: Add an image from a base64 encoded string to a slide

### Table Tools

- **add_table**: Add a table to a slide
- **format_table_cell**: Format a table cell

### Shape Tools

- **add_shape**: Add an auto shape to a slide

### Chart Tools

- **add_chart**: Add a chart to a slide

## Examples

### Creating a New Presentation

```python
# Create a new presentation
result = use_mcp_tool(
    server_name="ppt",
    tool_name="create_presentation",
    arguments={}
)
presentation_id = result["presentation_id"]

# Add a title slide
result = use_mcp_tool(
    server_name="ppt",
    tool_name="add_slide",
    arguments={
        "layout_index": 0,  # Title slide layout
        "title": "My Presentation",
        "presentation_id": presentation_id
    }
)
slide_index = result["slide_index"]

# Populate subtitle placeholder
result = use_mcp_tool(
    server_name="ppt",
    tool_name="populate_placeholder",
    arguments={
        "slide_index": slide_index,
        "placeholder_idx": 1,  # Subtitle placeholder
        "text": "Created with PowerPoint MCP Server",
        "presentation_id": presentation_id
    }
)

# Save the presentation
result = use_mcp_tool(
    server_name="ppt",
    tool_name="save_presentation",
    arguments={
        "file_path": "my_presentation.pptx",
        "presentation_id": presentation_id
    }
)
```

### Adding a Chart

```python
# Add a chart slide
result = use_mcp_tool(
    server_name="ppt",
    tool_name="add_slide",
    arguments={
        "layout_index": 1,  # Content slide layout
        "title": "Sales Data",
        "presentation_id": presentation_id
    }
)
slide_index = result["slide_index"]

# Add a column chart
result = use_mcp_tool(
    server_name="ppt",
    tool_name="add_chart",
    arguments={
        "slide_index": slide_index,
        "chart_type": "column",
        "left": 1.0,
        "top": 2.0,
        "width": 8.0,
        "height": 4.5,
        "categories": ["Q1", "Q2", "Q3", "Q4"],
        "series_names": ["2023", "2024"],
        "series_values": [
            [100, 120, 140, 160],
            [110, 130, 150, 170]
        ],
        "has_legend": True,
        "legend_position": "bottom",
        "has_data_labels": True,
        "title": "Quarterly Sales",
        "presentation_id": presentation_id
    }
)
```

## Jina Advanced Search MCP

### Servidor: `jina-advanced-search`

**Localização**: [`src/services/mcp/jina-advanced-search/`](src/services/mcp/jina-advanced-search/)

O Jina Advanced Search MCP oferece capacidades avançadas de busca web usando a API Jina AI, com processamento semântico e extração de conteúdo.

### Ferramentas Disponíveis

#### advanced_web_search

Busca web avançada com capacidades de reranking e análise semântica usando a API Jina.

**Parâmetros**:

- `query` (string, obrigatório): Consulta de busca
- `max_results` (number, opcional): Número máximo de resultados (padrão: 10)
- `search_type` (string, opcional): Tipo de busca (padrão: "advanced")
- `api_key` (string, opcional): Chave da API Jina (se não definida em variáveis de ambiente)
- `use_reranking` (boolean, opcional): Aplicar reranking aos resultados (padrão: true)

#### multimodal_search

Busca multimodal combinando texto e imagens.

**Parâmetros**:

- `text_query` (string, opcional): Consulta de busca em texto
- `image_url` (string, opcional): URL da imagem para busca visual
- `max_results` (number, opcional): Número máximo de resultados (padrão: 10)
- `api_key` (string, opcional): Chave da API Jina

**Nota**: Pelo menos um entre `text_query` ou `image_url` deve ser fornecido.

#### semantic_search

Busca semântica em documentos fornecidos.

**Parâmetros**:

- `query` (string, obrigatório): Consulta de busca
- `documents` (array, obrigatório): Lista de documentos para pesquisar
- `max_results` (number, opcional): Número máximo de resultados (padrão: 10)
- `api_key` (string, opcional): Chave da API Jina

#### extract_content

Extração de conteúdo de URLs usando o Jina Reader.

**Parâmetros**:

- `url` (string, obrigatório): URL para extrair conteúdo
- `api_key` (string, opcional): Chave da API Jina

#### get_server_info

Obtém informações sobre o servidor Jina Advanced Search MCP.

**Parâmetros**: Nenhum

### Exemplos de Uso

#### Busca Web Avançada

```python
# Busca avançada com reranking semântico
result = use_mcp_tool(
    server_name="jina-advanced-search",
    tool_name="advanced_web_search",
    arguments={
        "query": "inteligência artificial machine learning 2024",
        "max_results": 15,
        "use_reranking": True
    }
)

# Resultado inclui:
# - query: consulta original
# - search_type: "advanced_web_search"
# - total_results: número de resultados encontrados
# - documents: array com título, conteúdo, URL e score
```

#### Busca Multimodal

```python
# Busca combinando texto e imagem
result = use_mcp_tool(
    server_name="jina-advanced-search",
    tool_name="multimodal_search",
    arguments={
        "text_query": "arquitetura moderna sustentável",
        "image_url": "https://example.com/building.jpg",
        "max_results": 10
    }
)

# Resultado inclui:
# - search_type: "multimodal"
# - total_results: total de resultados
# - results_by_modality: resultados agrupados por modalidade
# - unified_ranking: ranking unificado de todos os resultados
```

#### Busca Semântica

```python
# Busca semântica em documentos locais
documents = [
    "Python é uma linguagem de programação de alto nível.",
    "JavaScript é usado para desenvolvimento web.",
    "Go é uma linguagem compilada criada pelo Google.",
    "Rust foca em segurança de memória."
]

result = use_mcp_tool(
    server_name="jina-advanced-search",
    tool_name="semantic_search",
    arguments={
        "query": "linguagem para sistemas embarcados",
        "documents": documents,
        "max_results": 2
    }
)
```

#### Extração de Conteúdo

```python
# Extrair conteúdo de uma página web
result = use_mcp_tool(
    server_name="jina-advanced-search",
    tool_name="extract_content",
    arguments={
        "url": "https://example.com/article"
    }
)

# Resultado inclui:
# - url: URL processada
# - content: conteúdo extraído em texto
# - operation: "content_extraction"
# - success: status da operação
```

### Configuração

#### Variáveis de Ambiente Necessárias

```bash
# Chave da API Jina (obrigatória)
# Obtenha em: https://jina.ai/
JINA_API_KEY=sua_chave_jina_aqui

# Chave da API OpenAI (opcional - para funcionalidades futuras)
OPENAI_API_KEY=sua_chave_openai_aqui
```

#### Configuração Automática

O servidor é configurado automaticamente pelo [`McpHub`](src/services/mcp/McpHub.ts) na inicialização da extensão. A configuração padrão inclui:

- **Comando**: `python main.py`
- **Timeout**: 60 segundos
- **Ferramentas permitidas**: Todas as ferramentas (advanced_web_search, multimodal_search, semantic_search, extract_content, get_server_info)
- **Observação de arquivos**: Código Python e configurações

### Uso no Cursor/Roo

Após configurar a API key e reiniciar o Cursor/Roo, você pode usar comandos naturais como:

- "Pesquise na web sobre [tópico]"
- "Faça uma busca avançada sobre [assunto]"
- "Extraia o conteúdo de [URL]"
- "Busque informações sobre [tema] usando Jina"

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
