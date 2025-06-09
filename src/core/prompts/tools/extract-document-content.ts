import { ToolArgs } from "../../../core/prompts/tools/types"

export function getExtractDocumentContentDescription(_args: ToolArgs): string {
	// TODO: args pode ser usado para internacionalização no futuro, por exemplo args.t('description')
	return `## extract_document_content
Descrição: Extrai o conteúdo textual de um documento (PDF, DOCX, TXT) fornecido através de uma URL ou um caminho de arquivo local. Tenta inferir o tipo de documento se não for especificado.
Parâmetros:
    *   \`source: string\` (obrigatório): A URL para o documento ou o caminho do arquivo local.
    *   \`document_type?: string\` (opcional): O tipo do documento (ex: "pdf", "docx", "txt"). Se omitido, a ferramenta tentará inferir pela extensão do arquivo ou URL.
Exemplo de Uso XML:
        \`\`\`xml
        <extract_document_content>
        <source>https://example.com/document.pdf</source>
        </extract_document_content>
        \`\`\`
        \`\`\`xml
        <extract_document_content>
        <source>./local_files/report.docx</source>
        <document_type>docx</document_type>
        </extract_document_content>
        \`\`\`
`
}
