import React, { useState, useEffect } from "react"
import { VSCodeButton, VSCodeDivider } from "@vscode/webview-ui-toolkit/react"

import { McpServer } from "@roo/mcp"
import { vscode } from "@src/utils/vscode"
import { useAppTranslation } from "@src/i18n/TranslationContext"

interface WhatsAppMcpViewProps {
	server: McpServer
	alwaysAllowMcp?: boolean
}

const WhatsAppMcpView: React.FC<WhatsAppMcpViewProps> = ({ server, alwaysAllowMcp: _alwaysAllowMcp }) => {
	const { t } = useAppTranslation()
	const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">(
		"disconnected",
	)
	const [qrCode, setQrCode] = useState<string | null>(null)
	const [isExpanded, setIsExpanded] = useState(false)
	const [recipient, setRecipient] = useState<string>("")
	const [chatMessages, setChatMessages] = useState<Array<{ text: string; isSent: boolean; recipient?: string }>>([])

	// Escutar os eventos especiais do WhatsApp
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data

			// Verificar se é um evento do WhatsApp
			if (message && message.type === "whatsapp_event") {
				console.log("Evento WhatsApp recebido:", message)

				switch (message.event_type) {
					case "qr_code":
						setQrCode(message.data.qr_code)
						setConnectionStatus("connecting")
						break

					case "connection_status":
						setConnectionStatus(message.data.status)
						// Se conectado, limpar o QR code
						if (message.data.status === "connected") {
							setQrCode(null)
						}
						break

					case "message_received": {
						// <-- Adicione chaves aqui para criar um escopo
						// Formatar a mensagem recebida para mostrar no terminal
						const sender =
							message.data.sender_phone_number === undefined ||
							message.data.sender_phone_number === null ||
							message.data.sender_phone_number === ""
								? "Desconhecido"
								: message.data.sender_phone_number

						const content = message.data.message_content ?? "" // <-- Esta linha parece estar faltando

						// Adiciona a mensagem ao chat
						setChatMessages((prev) => [
							...prev,
							{
								text: `[${sender}] ${content}`,
								isSent: false,
							},
						])
						break
					}
				}
			}
		}

		// Adicionar o listener de mensagem
		window.addEventListener("message", handleMessage)

		// Limpar o listener quando o componente for desmontado
		return () => {
			window.removeEventListener("message", handleMessage)
		}
	}, [])

	const handleToggleExpand = () => {
		setIsExpanded(!isExpanded)
	}

	const handleRestart = () => {
		// Alterar status para connecting
		setConnectionStatus("connecting")
		setQrCode(null) // Limpa o QR code atual

		vscode.postMessage({
			type: "restartMcpServer",
			text: server.name,
			source: server.source || "global",
		})
	}

	const handleSendMessage = (text: string) => {
		if (!recipient.trim()) {
			// Exibe mensagem de erro se não houver destinatário
			setChatMessages((prev) => [
				...prev,
				{
					text: "Erro: Informe um número de telefone válido primeiro!",
					isSent: false,
				},
			])
			return
		}

		// Adiciona a mensagem enviada ao chat local
		setChatMessages((prev) => [
			...prev,
			{
				text,
				isSent: true,
				recipient: recipient,
			},
		])

		// Envia para o backend via postMessage usando o tipo 'terminalOperation' e o campo 'values' para enviar comandos MCP
		vscode.postMessage({
			type: "terminalOperation",
			values: {
				action: "executeMcpTool",
				tool: "whatsapp_send_message",
				args: { recipient: recipient, message: text },
				server: server.name,
			},
		})
	}

	// Status do WhatsApp com cores específicas
	const getStatusColor = () => {
		switch (connectionStatus) {
			case "connected":
				return "var(--vscode-testing-iconPassed)"
			case "connecting":
				return "var(--vscode-charts-yellow)"
			case "disconnected":
				return "var(--vscode-testing-iconFailed)"
		}
	}

	// Status do WhatsApp com texto específico
	const getStatusText = () => {
		switch (connectionStatus) {
			case "connected":
				return t("whatsapp:status.connected")
			case "connecting":
				return t("whatsapp:status.connecting")
			case "disconnected":
			default:
				return t("whatsapp:status.disconnected")
		}
	}

	return (
		<div
			style={{
				marginBottom: "10px",
				borderRadius: "4px",
				border: "1px solid var(--vscode-widget-border)",
				overflow: "hidden",
			}}>
			{/* Cabeçalho do WhatsApp com ícone e status */}
			<div
				onClick={handleToggleExpand}
				style={{
					display: "flex",
					alignItems: "center",
					padding: "12px",
					backgroundColor: "var(--vscode-editor-background)",
					cursor: "pointer",
				}}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: "24px",
						height: "24px",
						marginRight: "12px",
						backgroundColor: "#25D366",
						borderRadius: "50%",
					}}>
					<span className="codicon codicon-comment-discussion" style={{ color: "#fff" }}></span>
				</div>

				<div style={{ flexGrow: 1 }}>
					<div style={{ fontWeight: "bold" }}>{server.name}</div>
					<div
						style={{
							fontSize: "12px",
							color: "var(--vscode-descriptionForeground)",
						}}>
						<span
							style={{
								display: "inline-block",
								width: "8px",
								height: "8px",
								borderRadius: "50%",
								backgroundColor: getStatusColor(),
								marginRight: "6px",
							}}></span>
						{getStatusText()}
					</div>
				</div>

				{/* Não permitimos desativar o WhatsApp MCP */}
				<div style={{ marginLeft: "10px" }}>
					<div
						style={{
							width: "20px",
							height: "10px",
							backgroundColor: "var(--vscode-editor-background)",
							borderRadius: "10px",
							border: "1px solid var(--vscode-checkbox-border)",
							position: "relative",
							opacity: 0.5, // Mostra desabilitado
							cursor: "not-allowed", // Cursor indicando que não pode ser alterado
						}}>
						<div
							style={{
								width: "6px",
								height: "6px",
								backgroundColor: "var(--vscode-titleBar-activeForeground)",
								borderRadius: "50%",
								position: "absolute",
								top: "1px",
								left: "12px",
								transition: "left 0.2s",
							}}
						/>
					</div>
					<div
						style={{
							fontSize: "10px",
							marginTop: "2px",
							textAlign: "center",
							color: "var(--vscode-descriptionForeground)",
							opacity: 0.7,
						}}>
						{t("whatsapp:systemCritical")}
					</div>
				</div>
			</div>

			{/* Conteúdo expandido */}
			{isExpanded && (
				<>
					<VSCodeDivider />
					<div
						style={{
							padding: "10px",
							backgroundColor: "var(--vscode-editor-background)",
						}}>
						{/* Status de conexão */}
						<div
							style={{
								marginBottom: "10px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<div>
								<strong>{t("whatsapp:connectionStatus")}:</strong> {getStatusText()}
							</div>
							<VSCodeButton appearance="secondary" onClick={handleRestart}>
								{connectionStatus === "connecting" ? t("whatsapp:connecting") : t("whatsapp:reconnect")}
							</VSCodeButton>
						</div>

						{/* QR Code (mostra apenas quando em modo de conexão) */}
						{connectionStatus === "connecting" && qrCode && (
							<div
								style={{
									marginBottom: "15px",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}>
								<strong style={{ marginBottom: "10px" }}>{t("whatsapp:scanQrCode")}</strong>
								<div
									style={{
										padding: "10px",
										backgroundColor: "white",
										borderRadius: "4px",
									}}>
									<img
										src={`data:image/png;base64,${qrCode}`}
										alt="QR Code"
										style={{ width: "200px", height: "200px" }}
									/>
								</div>
							</div>
						)}

						{/* Terminal de chat */}
						<div>
							<strong>{t("whatsapp:chatTerminal")}</strong>
							<div
								style={{
									maxHeight: "150px",
									overflowY: "auto",
									marginTop: "5px",
									padding: "8px",
									backgroundColor: "var(--vscode-textCodeBlock-background)",
									borderRadius: "4px",
									fontFamily: "var(--vscode-editor-font-family)",
									fontSize: "var(--vscode-editor-font-size)",
								}}>
								{chatMessages.length === 0 ? (
									<div style={{ color: "var(--vscode-descriptionForeground)", fontStyle: "italic" }}>
										{t("whatsapp:noChatMessages")}
									</div>
								) : (
									chatMessages.map((msg, index) => (
										<div
											key={index}
											style={{
												marginBottom: "4px",
												textAlign: msg.isSent ? "right" : "left",
											}}>
											<span
												style={{
													display: "inline-block",
													padding: "4px 8px",
													borderRadius: "4px",
													backgroundColor: msg.isSent
														? "var(--vscode-button-background)"
														: "var(--vscode-editor-inactiveSelectionBackground)",
													color: msg.isSent
														? "var(--vscode-button-foreground)"
														: "var(--vscode-editor-foreground)",
													maxWidth: "80%",
													wordBreak: "break-word",
												}}>
												{msg.text}
											</span>
										</div>
									))
								)}
							</div>

							{/* Campo de destinatário */}
							<div
								style={{
									marginTop: "10px",
									display: "flex",
									gap: "10px",
									alignItems: "center",
								}}>
								<label
									style={{
										fontSize: "12px",
										minWidth: "70px",
									}}>
									Destinatário:
								</label>
								<input
									type="text"
									value={recipient}
									onChange={(e) => setRecipient(e.target.value)}
									placeholder="Ex: 5511999998888"
									disabled={connectionStatus !== "connected"}
									style={{
										backgroundColor: "var(--vscode-input-background)",
										color: "var(--vscode-input-foreground)",
										border: "1px solid var(--vscode-input-border)",
										borderRadius: "4px",
										padding: "4px 8px",
										flexGrow: 1,
										opacity: connectionStatus === "connected" ? 1 : 0.6,
									}}
								/>
							</div>

							{/* Entrada de mensagem */}
							<div
								style={{
									marginTop: "10px",
									display: "flex",
									gap: "10px",
								}}>
								<input
									type="text"
									id="messageInput"
									disabled={connectionStatus !== "connected" || !recipient.trim()}
									placeholder={
										connectionStatus !== "connected"
											? "Conecte-se primeiro para enviar mensagens"
											: !recipient.trim()
												? "Informe um destinatário primeiro"
												: "Digite sua mensagem..."
									}
									style={{
										backgroundColor: "var(--vscode-input-background)",
										color: "var(--vscode-input-foreground)",
										border: "1px solid var(--vscode-input-border)",
										borderRadius: "4px",
										padding: "4px 8px",
										flexGrow: 1,
										opacity: connectionStatus === "connected" && recipient.trim() ? 1 : 0.6,
									}}
									onKeyPress={(e) => {
										if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim() !== "") {
											handleSendMessage((e.target as HTMLInputElement).value)
											;(e.target as HTMLInputElement).value = ""
										}
									}}
								/>
								<VSCodeButton
									appearance="secondary"
									disabled={connectionStatus !== "connected" || !recipient.trim()}
									onClick={() => {
										const input = document.getElementById("messageInput") as HTMLInputElement
										if (input && input.value.trim() !== "") {
											handleSendMessage(input.value)
											input.value = ""
										}
									}}>
									Enviar
								</VSCodeButton>
							</div>
							<div
								style={{
									marginTop: "5px",
									fontSize: "11px",
									color: "var(--vscode-descriptionForeground)",
									fontStyle: "italic",
								}}>
								{t("whatsapp:commandHelp")}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default WhatsAppMcpView
