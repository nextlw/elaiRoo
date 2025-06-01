Plano de Implementação: Integração WhatsApp com Roo via MCP
Objetivo:
Permitir que mensagens do WhatsApp contendo @elai sejam injetadas no fluxo do Roo para processamento assíncrono, utilizando o whatsapp-mcp-server como ponto de injeção.

Componentes Chave:
whatsapp-bridge (Go): Detecta menções @elai e envia para o MCP.
whatsapp-mcp-server (Python): Servidor MCP que recebe mensagens do Go, injeta no banco de dados e permite que o Roo as processe.
Roo (Extensão VSCode): Consome mensagens do whatsapp-mcp-server como prompts.

Etapas de Implementação:
Fase 1: Adaptação do whatsapp-mcp-server (Python)
[x] Modificar src/services/mcp/whatsapp-mcp/whatsapp-mcp-server/main.py
• Adicionada tool `inject_external_message` via decorador @mcp.tool()
• Implementado handler para recebimento de mensagens externas

[x] Adicionar importação de process_external_message.
• Importação adicionada: `from .whatsapp import process_external_message`

[x] Definir a nova tool MCP inject_external_message.
• Implementado schema de entrada com parâmetros: - sender_phone_number - message_content - message_timestamp - chat_jid

Fase 2: Adaptação do whatsapp-bridge (Go)
[x] Modificar src/services/mcp/whatsapp-mcp/whatsapp-bridge/main.go
• Adicionada lógica de detecção de menções @elai
• Implementado IPC via STDIN usando fmt.Fprintf

[x] Implementar a função sendMCPToolCall.
• Função criada com serialização JSON dos argumentos
• Protocolo MCP implementado via saída padrão

[x] Chamar inject_external_message na função handleMessage.
• Lógica adicionada no bloco if strings.Contains(content, "@elai")
• Mapeamento de campos:
sender → sender_phone_number
content → message_content
timestamp → message_timestamp
chatJID → chat_jid

Fase 3: Testes e Validação
[ ] Testes Unitários (Python)
[ ] Testes de Integração (Go e Python)

Fase 4: Documentação
[ ] Atualizar docs/TOOLS.md
[ ] Atualizar docs/API.md
