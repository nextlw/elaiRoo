import { ToolArgs } from "./types"

export function getGetRepositoryFileContentDescription(_args: ToolArgs): string {
	return `## get_repository_file_content
Busca o conteúdo de um arquivo específico de um repositório em uma plataforma suportada (atualmente apenas GitHub). Requer a URL completa do repositório e o caminho para o arquivo dentro do repositório.

**Parâmetros:**
*   \`repository_url: string\` (obrigatório): A URL completa para o repositório (ex: "https://github.com/owner/repo_name").
*   \`file_path: string\` (obrigatório): O caminho para o arquivo dentro do repositório (ex: "src/main.js", "README.md").
*   \`ref?: string\` (opcional): O nome do branch, tag ou commit SHA do qual buscar o arquivo. Se omitido, usará o branch padrão do repositório.
*   \`platform?: string\` (opcional, default: "github"): A plataforma do repositório (ex: "github"). Atualmente, apenas "github" é suportado.

**Exemplo de Uso XML:**
\`\`\`xml
<get_repository_file_content>
  <repository_url>https://github.com/my-org/my-project</repository_url>
  <file_path>src/utils/helpers.ts</file_path>
  <ref>develop</ref>
</get_repository_file_content>
\`\`\`
\`\`\`xml
<get_repository_file_content>
  <repository_url>https://github.com/another-user/another-repo</repository_url>
  <file_path>docs/API.md</file_path>
</get_repository_file_content>
\`\`\`
`
}
