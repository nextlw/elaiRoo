Análise Detalhada do Roo Code: Lógica de Seleção e Execução de Ferramentas
Visão Geral
O Roo Code é uma extensão do VS Code que implementa um agente de IA autônomo para codificação. A arquitetura é baseada em uma extensão TypeScript principal que se comunica com um frontend React através de webviews.
Arquitetura do Sistema
Estrutura de Diretórios
Roo-Code/
├── src/ # Backend da extensão (TypeScript)
│ ├── core/ # Lógica central
│ ├── api/ # Provedores de API
│ └── tools/ # Implementação das ferramentas
├── webview-ui/ # Frontend React
│ ├── src/ # Código React/TypeScript
│ └── public/ # Assets estáticos
└── package.json # Configuração da extensão

Comunicação Extension ↔ Webview
• Método: postMessage API do VS Code
• Direção 1: Extension → Webview (via webview.postMessage())
• Direção 2: Webview → Extension (via acquireVsCodeApi().postMessage())
• Formato: Mensagens JSON com tipos definidos
Sistema de Modos
Modos Nativos

1. Code Mode: Modo padrão para codificação geral
   o Ferramentas: read_file, write_file, run_command, browser_use
   o Capacidades: Edição completa de arquivos e execução de comandos
2. Architect Mode: Foco em arquitetura e design de sistemas
   o Ferramentas: read_file, list_files (somente leitura)
   o Restrições: Não pode editar arquivos ou executar comandos
3. Ask Mode: Modo de perguntas e pesquisa
   o Ferramentas: read_file, list_files (somente leitura)
   o Propósito: Análise e resposta a perguntas sobre código
4. Debug Mode: Especializado em depuração
   o Ferramentas: read_file, write_file, run_command
   o Foco: Diagnóstico e correção de problemas
   Modos Customizados
   • Criação: Via prompt "Create a new mode for [função]"
   • Configuração: JSON com definições de ferramentas e instruções
   • Armazenamento: Arquivo .roomodes no projeto ou global
   Lógica de Seleção de Ferramentas
   Processo de Decisão
5. Contexto do Modo: Sistema verifica modo ativo e ferramentas disponíveis
6. Análise da Solicitação: IA interpreta o pedido do usuário
7. Seleção de Ferramentas: IA escolhe ferramentas baseado em:
   o Permissões do modo atual
   o Necessidades da tarefa
   o Restrições definidas
   Ferramentas Principais
   Gerenciamento de Arquivos
   • list_files: Lista arquivos e diretórios
   o Parâmetros: path, recursive
   o Limites: 200 arquivos por listagem
   o Respeita: .gitignore e .rooignore
   • read_file: Lê conteúdo de arquivos
   o Validação de segurança para evitar arquivos sensíveis
   • write_file: Escreve/modifica arquivos
   o Mostra diff das alterações
   o Requer aprovação em modos restritivos
   Execução de Comandos
   • run_command: Executa comandos no terminal
   o Monitoramento de saída
   o Detecção de erros automática
   o Sistema de auto-aprovação configurável
   Automação de Browser
   • browser_use: Controla navegador web
   o Puppeteer integration
   o Screenshots automáticos
   o Interação com elementos da página
   Protocolo MCP
   • Ferramentas Externas: Via Model Context Protocol
   o Integração com APIs externas
   o Serviços customizados
   o Expansibilidade ilimitada
   Fluxo de Execução de Ferramentas
8. Análise Inicial
   Usuário → Chat Input → Modo Ativo → Ferramentas Disponíveis

9. Geração de Chamadas
   • IA gera prompt com chamadas XML estruturadas
   • Formato: <tool_name><parameter>valor</parameter></tool_name>
   • Parsing via regex/XML parser básico
10. Sistema de Aprovação
    Ferramenta → Verificação → [Aprovação Manual/Automática] → Execução

Configurações de Auto-Aprovação
• Sempre Aprovar: Browser actions, MCP tools, mode switching
• Nunca Aprovar: Comandos perigosos, operações de sistema
• Condicional: Baseado em whitelist de comandos 4. Execução e Retorno
• Execução sequencial das ferramentas
• Coleta de resultados e outputs
• Retorno formatado para a IA
• Geração de resposta final
Implementação Técnica
Parse de Ferramentas
// Exemplo simplificado do parsing
function parseToolCalls(xmlString: string) {
// Regex para extrair chamadas de ferramentas
const toolPattern = /<(\w+)>(.\*?)<\/\1>/gs;
return xmlString.matchAll(toolPattern);
}

Comunicação Webview
// Extension → Webview
webview.postMessage({
type: 'toolExecutionResult',
data: results
});

// Webview → Extension
vscode.postMessage({
type: 'executeTools',
tools: toolCalls
});

Características Avançadas
Gestão de Contexto
• Histórico persistente: Mantém contexto entre sessões
• Memory Bank: Sistemas como RooFlow para memória de longo prazo
• Context Mentions: @file, @folder, @problems, @url, @git
Otimizações
• Token Usage: Monitoramento de uso e custo
• Streaming: Respostas em tempo real
• Cache: Otimizações para chamadas repetidas
Segurança
• Sandboxing: Webview isolado do sistema
• Validação: Verificação de paths e comandos
• Aprovação: Sistema de confirmação para ações críticas
