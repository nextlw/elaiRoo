import { ToolArgs } from "./types"

export function getExtractPageContentDescription(_args: ToolArgs): string {
	return `## extract_page_content
Extrai o conteúdo textual principal de uma página da web a partir de uma URL. Por padrão, tenta limpar o HTML de boilerplate (menus, anúncios, etc.) e converter o conteúdo principal para Markdown. Pode opcionalmente retornar o HTML bruto.

**Parâmetros:**
*   \`url: string\` (obrigatório): A URL da página da qual extrair o conteúdo.
*   \`clean_html?: boolean\` (opcional, default: true): Se \`true\`, tenta limpar o HTML e extrair o conteúdo principal como Markdown. Se \`false\`, retorna o HTML bruto da página (funcionalidade de \`false\` é TODO).

**Exemplo de Uso XML:**
\`\`\`xml
<extract_page_content>
  <url>https://www.example.com/article</url>
  <clean_html>true</clean_html>
</extract_page_content>
\`\`\`
\`\`\`xml
<extract_page_content>
  <url>https://www.example.com/another-article</url>
</extract_page_content>
\`\`\`
`
}
