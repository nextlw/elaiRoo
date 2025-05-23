import { ToolArgs } from "../../../core/prompts/tools/types"

export function getSearchCodeRepositoriesDescription(args: ToolArgs): string {
	return `## search_code_repositories
Pesquisa em repositórios de código em plataformas suportadas (atualmente apenas GitHub). Permite buscar por código, arquivos ou repositórios com base em uma query e filtros como repositório, organização ou usuário.

Parâmetros:
- query: (required): A string de pesquisa a ser usada na API da plataforma (ex: "função foo linguagem:python", "nome_arquivo.txt")${args.cwd}.
- platform?: (opcional, default: "github"): A plataforma do repositório (ex: "github"). Atualmente, apenas "github" é suportado.
- repository?: (opcional): O nome completo do repositório para focar a busca (ex: "owner/repo_name").
- organization?: (opcional): O nome da organização para focar a busca.
- user?: (opcional): O nome de usuário para focar a busca.
- per_page?: (opcional, default: 30): O número de resultados por página.
- page?: (opcional, default: 1): O número da página de resultados.
Usage:
<search_code_repositories>
<query>implementar autenticação</query>
<platform>github</platform>
<organization>my-company</organization>
<per_page>10</per_page>
</search_code_repositories>

<search_code_repositories>
<query>README.md</query>
<repository>user/project</repository>
</search_code_repositories>
`
}
