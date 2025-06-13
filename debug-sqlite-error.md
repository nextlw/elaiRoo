# Debug do Erro SQLite - chunk_tags

## Erro Reportado

```
error when indexing: Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: chunk_tags.tag, chunk_tags.chunkId
```

## Status da Investigação

### ✅ Problema 1: Erro do PDF - RESOLVIDO

- **Causa**: O módulo `pdf-parse` estava executando código de teste ao ser importado
- **Solução**: Mudamos para lazy loading com `require()` nos arquivos:
    - `src/integrations/misc/extract-text.ts`
    - `src/core/tools/extractDocumentContentTool.ts`

### ❓ Problema 2: Erro SQLite chunk_tags - EM INVESTIGAÇÃO

- **Situação**: Não encontramos nenhuma referência à tabela `chunk_tags` no código atual
- **Verificações feitas**:
    - ✓ Procurado em todos os arquivos .ts, .js, .sql
    - ✓ Verificado todos os bancos SQLite no projeto
    - ✓ Nenhuma tabela `chunk_tags` encontrada

## Próximos Passos para Debugar

### 1. Verificar bancos de dados do VS Code

```bash
# No terminal, execute:
find ~/Library/Application\ Support/Code -name "*.db" -o -name "*.sqlite" 2>/dev/null | while read db; do
    echo "Checking: $db"
    sqlite3 "$db" ".tables" 2>/dev/null | grep -i chunk && echo "  Found chunk tables in: $db"
done
```

### 2. Verificar logs completos do VS Code

1. Abra o Command Palette (Cmd+Shift+P)
2. Digite "Developer: Show Logs..."
3. Selecione "Extension Host"
4. Procure por mensagens relacionadas a "chunk_tags" ou "indexing"

### 3. Limpar dados de indexação

Se o erro persistir, tente limpar os dados de indexação:

1. Abra as configurações do Roo Code
2. Vá para a seção de indexação de código
3. Clique em "Clear Index Data"

### 4. Verificar extensões conflitantes

O erro pode vir de outra extensão. Tente:

1. Desabilitar outras extensões temporariamente
2. Reiniciar o VS Code
3. Testar novamente

### 5. Procurar por bancos temporários

```bash
# Procurar em diretórios temporários
find /tmp -name "*.db" -o -name "*.sqlite" 2>/dev/null | while read db; do
    sqlite3 "$db" ".tables" 2>/dev/null | grep -i chunk && echo "Found in: $db"
done
```

## Solução Temporária

Se o erro continuar impedindo o uso da extensão:

1. Desabilite a indexação de código nas configurações
2. Reinicie o VS Code
3. O erro deve parar de aparecer

## Informações Adicionais

- O erro sugere uma tentativa de inserir dados duplicados em uma constraint única
- A tabela `chunk_tags` não faz parte do código atual do Roo Code
- Pode ser de uma versão antiga ou de outra extensão/serviço
