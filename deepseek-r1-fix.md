# Correção para DeepSeek R1 - Problema com Ferramentas XML

## Problema Identificado

O modelo DeepSeek R1 está falhando ao formatar corretamente as chamadas de ferramentas XML, especificamente com a ferramenta `web_search`. O erro recorrente é:

```json
{
	"code": "invalid_type",
	"expected": "string",
	"received": "undefined",
	"path": ["query"],
	"message": "Required"
}
```

## Causa Raiz

O DeepSeek R1 tem um modo de "thinking" (pensamento) que interfere com a formatação precisa de XML. O modelo tenta raciocinar sobre a estrutura mas não consegue completar a formatação corretamente.

## Soluções Recomendadas

### 1. Trocar Temporariamente o Modelo

Para tarefas que requerem uso intensivo de ferramentas, considere usar:

- **Claude 3.5 Sonnet**: Excelente para seguir instruções estruturadas
- **GPT-4**: Boa compatibilidade com XML
- **DeepSeek Chat**: Versão mais simples do DeepSeek sem o modo thinking

### 2. Adicionar Instruções Customizadas Específicas

Adicione estas instruções ao seu `customInstructions`:

```
## CRITICAL: Tool Usage Format for DeepSeek R1

When using ANY tool, you MUST follow this EXACT format without deviation:

For web_search tool:
<tool_use>
<tool_name>web_search</tool_name>
<parameters>
<query>YOUR SEARCH QUERY HERE</query>
<engine>jina</engine>
<num_results>10</num_results>
</parameters>
</tool_use>

IMPORTANT:
- Do NOT use thinking tags when calling tools
- Complete the ENTIRE XML structure in one response
- Do NOT break the XML across multiple messages
- The query parameter is REQUIRED and must contain actual text
```

### 3. Desabilitar o Modo Thinking para Ferramentas

Se possível, configure o modelo para não usar o modo thinking ao chamar ferramentas.

### 4. Usar um Wrapper de Ferramenta

Crie uma subtarefa específica para chamadas de ferramenta:

```
Subtask: Execute Web Search
Mode: Default (not Reviewer)
Instructions: Search for "últimas notícias IA 2025" using web_search tool with Jina engine
```

## Teste de Validação

Para verificar se o problema foi resolvido, teste com uma query simples:

1. Peça: "Pesquise sobre 'teste' na web"
2. O modelo deve gerar:

```xml
<tool_use>
<tool_name>web_search</tool_name>
<parameters>
<query>teste</query>
</parameters>
</tool_use>
```

## Configuração Alternativa do MCP

Verifique também se o servidor MCP está rodando corretamente:

```bash
# No terminal
cd /Users/williamduarte/NCMproduto/elaiRoo/src/services/mcp/jina-advanced-search
python main.py
```

O erro nos logs mostra que o arquivo não foi encontrado. Verifique se o caminho está correto.
