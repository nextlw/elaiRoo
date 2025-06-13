# Configuração do Jina Advanced Search MCP

## Configuração Completa ✅

O MCP jina-advanced-search foi configurado com sucesso nos seguintes arquivos:

### 1. Cursor Global Config

**Arquivo:** `~/.cursor/mcp.json`

```json
{
	"mcpServers": {
		"jina-advanced-search": {
			"type": "stdio",
			"command": "python",
			"args": ["/Users/williamduarte/NCMproduto/elaiRoo/src/services/mcp/jina-advanced-search/main.py"],
			"disabled": false,
			"timeout": 60,
			"alwaysAllow": [
				"advanced_web_search",
				"multimodal_search",
				"semantic_search",
				"extract_content",
				"get_server_info"
			],
			"env": {
				"JINA_API_KEY": "${JINA_API_KEY}",
				"OPENAI_API_KEY": "${OPENAI_API_KEY}",
				"PYTHONPATH": "/Users/williamduarte/NCMproduto/elaiRoo/src/services/mcp/jina-advanced-search"
			}
		}
	}
}
```

### 2. Roo Project Config

**Arquivo:** `.roo/mcp.json`

```json
{
	"mcpServers": {
		"jina-advanced-search": {
			"type": "stdio",
			"command": "python",
			"args": ["src/services/mcp/jina-advanced-search/main.py"],
			"disabled": false,
			"timeout": 60,
			"alwaysAllow": [
				"advanced_web_search",
				"multimodal_search",
				"semantic_search",
				"extract_content",
				"get_server_info"
			],
			"env": {
				"JINA_API_KEY": "${JINA_API_KEY}",
				"OPENAI_API_KEY": "${OPENAI_API_KEY}",
				"PYTHONPATH": "src/services/mcp/jina-advanced-search"
			}
		}
	}
}
```

### 3. Roo Global Config

**Arquivo:** `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-code-nightly/settings/mcp_settings.json`

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com:

```bash
# Jina AI API Key (obrigatória)
# Obtenha sua chave em: https://jina.ai/
JINA_API_KEY=sua_chave_jina_aqui

# OpenAI API Key (opcional, para funcionalidades avançadas)
OPENAI_API_KEY=sua_chave_openai_aqui
```

## Ferramentas Disponíveis

- **advanced_web_search**: Busca avançada na web com Jina AI
- **multimodal_search**: Busca multimodal combinando texto e imagens
- **semantic_search**: Busca semântica em documentos fornecidos
- **extract_content**: Extração de conteúdo de URLs
- **get_server_info**: Informações sobre o servidor MCP

## Como Usar

1. Reinicie o Cursor/Roo após adicionar as configurações
2. As ferramentas estarão disponíveis automaticamente
3. Use comandos como:
    - "Pesquise na web sobre..."
    - "Extraia o conteúdo de..."
    - "Faça uma busca semântica..."

## Verificação

Para verificar se está funcionando:

```bash
cd src/services/mcp/jina-advanced-search
python test_jina_mcp.py
```
