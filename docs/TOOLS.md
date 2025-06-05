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
