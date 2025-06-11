# Plano B — Implementação Passo-a-Passo da Ferramenta **web_search**

> _Modo didático, com pitadas de sarcasmo para manter a sanidade._

---

## 📦 Pré-requisitos Rápidos

| Item              | Comando/Teste         | Objetivo                    |
| ----------------- | --------------------- | --------------------------- |
| Dependências root | `pnpm install`        | Garantir tudo instalado     |
| Tipagem           | `pnpm tsc -p .`       | Compilação sem erros        |
| Ambiente          | Node 20.x + pnpm 10.x | Conforme memória `21171a67` |

---

## 🛠️ Passos de Implementação

Cada passo vem com um **Prompt** (bloco de texto) que você pode usar no Roo (ou colar no terminal) para executar/verificar.

### 1. Validar Tipos & Schemas

1. Abrir `src/core/tools/webSearchTool.ts` e conferir `z.object({ query, engine, num_results })`.
2. **Prompt:**

```md
<codebase_search>
<query>engine num_results zod webSearchTool</query>
</codebase_search>
```

✅ **Check:** Jest green para `parseAssistantMessage.test.ts`.

### 2. Garantir Registro da Tool

1. Confirmar linha 55 em `src/core/prompts/tools/index.ts`.
2. **Prompt:**

```md
<grep_search>
<query>web_search:</query>
<path>src/core/prompts/tools/index.ts</path>
</grep_search>
```

✅ **Check:** Deve retornar exatamente uma ocorrência.

### 3. Fallback Deep-Research

1. Adicionar fetch para `http://localhost:3002/query` em `webSearchTool.ts`.
2. **Prompt:**

```md
<write_to_file>
<target>src/core/tools/webSearchTool.ts</target>
<append>// TODO fallback fetch</append>
</write_to_file>
```

✅ **Check:** Teste `deep-research.test.ts` retorna provider "deep-research-fallback".

### 4. Atualizar UI (ChatRow)

1. Verificar render de `<WebSearchResultsBlock>`.
2. **Prompt:**

```md
<search_in_file>
<file>webview-ui/src/components/chat/ChatRow.tsx</file>
<query>WebSearchResultsBlock</query>
</search_in_file>
```

✅ **Check:** Deve existir switch/case para `tool === "web_search"`.

### 5. Renderização de Resultados

1. Ajustar `favicon` e `finalScore`.
2. **Prompt:**

```md
<edit_file>
<target>webview-ui/src/components/chat/WebSearchResultsBlock.tsx</target>
<code>// mapear favicon</code>
</edit_file>
```

✅ **Check:** Teste React snapshot bate.

### 6. Ranqueamento & Boosts

1. Confirmar uso de `rankURLs`.
2. **Prompt:**

```md
<grep_search>
<query>rankURLs(</query>
<path>src/core/tools/webSearchTool.ts</path>
</grep_search>
```

✅ **Check:** Resultado ordenado por `finalScore`.

### 7. Descrição no Dispatcher

1. Snapshot em `sections.test.ts`.
2. **Prompt:**

```md
<run_command>
<cmd>pnpm jest src/core/prompts/**tests**/sections.test.ts</cmd>
</run_command>
```

✅ **Check:** Contém "## web_search".

### 8. Testes Unitários & Integração

1. Criar/atualizar `webSearchTool.test.ts`.
2. **Prompt:**

```md
<run_command>
<cmd>pnpm jest src/core/tools/**tests**/webSearchTool.test.ts --runInBand</cmd>
</run_command>
```

✅ **Check:** Todos verdes.

### 9. Artefatos de Evidência

1. Salvar logs Jest em `artifacts/web_search/*.json`.
2. **Prompt:**

```md
<run_command>
<cmd>pnpm jest --json --outputFile artifacts/web_search/result.json</cmd>
</run_command>
```

✅ **Check:** Arquivo criado.

### 10. Checklist Final

Marque cada item quando passar:

- [ ] Tipos compilam
- [ ] Teste fallback
- [ ] UI renderiza
- [ ] Snapshot dispatcher
- [ ] Jest full pass

> _“Se algo der ruim, reclame com o espelho primeiro, depois comigo.”_
