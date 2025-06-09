import { ToolArgs } from "../../../core/prompts/tools/types"

export function getProcessTextContentDescription(_args: ToolArgs): string {
	return `## process_text_content
**Descrição:** Realiza várias operações de processamento em um bloco de texto fornecido. As operações suportadas incluem correção de Markdown, remoção de linhas duplicadas, sumarização (placeholder) e extração de palavras-chave (placeholder).
**Parâmetros:**
*   \`text_content: string\` (obrigatório): O texto a ser processado.
*   \`operation: string\` (obrigatório): A operação a ser realizada. Valores suportados atualmente: "fix_markdown", "remove_duplicate_lines", "summarize", "extract_keywords".
*   \`options?: string\` (opcional): Opções adicionais para a operação, fornecidas como um objeto JSON stringificado (atualmente não utilizado pelas implementações placeholder de summarize/extractKeywords).
**Exemplo de Uso XML:**
\`\`\`xml
<process_text_content>
<text_content># Título com erro\\n\\nTexto com linhas\\nTexto com linhas\\n   - item 1 mal formatado</text_content>
<operation>fix_markdown</operation>
</process_text_content>
\`\`\`
\`\`\`xml
<process_text_content>
<text_content>Linha 1\\nLinha 2\\nLinha 1\\nLinha 3</text_content>
<operation>remove_duplicate_lines</operation>
</process_text_content>
\`\`\`
`
}
