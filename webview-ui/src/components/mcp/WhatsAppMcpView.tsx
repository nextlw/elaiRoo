import React, { useState, useEffect } from "react"
import { VSCodeButton, VSCodeDivider, VSCodeTextField } from "@vscode/webview-ui-toolkit/react"
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
	const [userPhoneNumber, setUserPhoneNumber] = useState<string>("")
	const [connectedNumber, setConnectedNumber] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// Verificar status inicial quando o componente carrega
	useEffect(() => {
		// Verificar status inicial via MCP
		const checkInitialStatus = () => {
			vscode.postMessage({
				type: "callMcpTool",
				serverName: server.name,
				toolName: "get_whatsapp_status",
				arguments: {},
				source: server.source || "global",
			})
		}

		// Verificar status após um pequeno delay para garantir que o MCP está pronto
		const timer = setTimeout(checkInitialStatus, 1000)
		return () => clearTimeout(timer)
	}, [server.name, server.source])

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
						setIsLoading(false)
						break

					case "connection_status":
						setConnectionStatus(message.data.status)
						setIsLoading(false)

						// Se conectado, buscar o número conectado
						if (message.data.status === "connected") {
							setQrCode(null)
							if (message.data.phone_number) {
								setConnectedNumber(message.data.phone_number)
							}
						} else if (message.data.status === "disconnected") {
							setConnectedNumber(null)
						}
						break
				}
			}

			// Handler para resposta de ferramentas WhatsApp MCP
			if (message && message.type === "whatsappToolResponse" && message.serverName === "whatsapp") {
				console.log("Resposta WhatsApp MCP:", message)
				setIsLoading(false)

				if (message.toolName === "start_whatsapp_bridge") {
					if (message.result && message.result.isError) {
						// Erro na execução da ferramenta
						console.error("Erro ao iniciar ponte:", message.result.content[0].text)
						setConnectionStatus("disconnected")
						alert("Erro ao iniciar WhatsApp: " + message.result.content[0].text)
					} else if (message.result && message.result.content) {
						try {
							const resultData = JSON.parse(message.result.content[0].text)
							if (resultData.success) {
								// Ponte iniciada com sucesso, aguardar QR code ou status
								if (resultData.status === "already_running") {
									setConnectionStatus("connected")
								} else {
									setConnectionStatus("connecting")
								}
							} else {
								setConnectionStatus("disconnected")
								alert("Erro: " + resultData.message)
							}
						} catch (e) {
							console.error("Erro ao processar resposta:", e)
							setConnectionStatus("disconnected")
						}
					}
				} else if (message.toolName === "stop_whatsapp_bridge") {
					if (message.result && message.result.content) {
						try {
							const resultData = JSON.parse(message.result.content[0].text)
							if (resultData.success) {
								setConnectionStatus("disconnected")
								setQrCode(null)
								setConnectedNumber(null)
							}
						} catch (e) {
							console.error("Erro ao processar resposta:", e)
						}
					}
				} else if (message.toolName === "get_whatsapp_status") {
					if (message.result && message.result.content) {
						try {
							const resultData = JSON.parse(message.result.content[0].text)
							console.log("Status atual do WhatsApp:", resultData)
							if (resultData.success) {
								setConnectionStatus(resultData.status === "connected" ? "connected" : "disconnected")
							}
						} catch (e) {
							console.error("Erro ao processar status:", e)
						}
					}
				}

				if (message.error) {
					console.error("Erro na ferramenta WhatsApp:", message.error)
					setConnectionStatus("disconnected")
					setIsLoading(false)
					alert("Erro na comunicação: " + message.error)
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

	const handleConnect = () => {
		setIsLoading(true)
		setConnectionStatus("connecting")
		setQrCode(null)

		// Chama a ferramenta MCP para iniciar a ponte Go
		// Note: A função não precisa de parâmetros, o número é informativo apenas
		vscode.postMessage({
			type: "callMcpTool",
			serverName: server.name,
			toolName: "start_whatsapp_bridge",
			arguments: {},
			source: server.source || "global",
		})
	}

	const handleDisconnect = () => {
		setIsLoading(true)
		setConnectionStatus("disconnected")
		setQrCode(null)
		setConnectedNumber(null)

		// Chama a ferramenta MCP para parar a ponte Go
		vscode.postMessage({
			type: "callMcpTool",
			serverName: server.name,
			toolName: "stop_whatsapp_bridge",
			arguments: {},
			source: server.source || "global",
		})
	}

	const handleToggleConnection = () => {
		if (connectionStatus === "connected" || connectionStatus === "connecting") {
			handleDisconnect()
		} else {
			handleConnect()
		}
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
					<span className="codicon codicon-comment-discussion text-white"></span>
				</div>

				<div style={{ flexGrow: 1 }}>
					<div style={{ fontWeight: "bold" }}>{server.name}</div>
					<div style={{ fontSize: "12px", color: "var(--vscode-descriptionForeground)" }}>
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
						{connectedNumber && (
							<span style={{ marginLeft: "8px", fontWeight: "bold" }}>({connectedNumber})</span>
						)}
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
							opacity: 0.5,
							cursor: "not-allowed",
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

			{/* Conteúdo expandido - Configuração */}
			{isExpanded && (
				<>
					<VSCodeDivider />
					<div style={{ padding: "16px", backgroundColor: "var(--vscode-editor-background)" }}>
						{/* Configuração do Número */}
						<div style={{ marginBottom: "16px" }}>
							<div style={{ fontWeight: "bold", marginBottom: "8px" }}>
								Configuração da Conta WhatsApp
							</div>

							{connectionStatus === "disconnected" && (
								<div style={{ marginBottom: "12px" }}>
									<label
										style={{
											display: "block",
											fontSize: "12px",
											marginBottom: "4px",
											color: "var(--vscode-descriptionForeground)",
										}}>
										Seu número de telefone (opcional - apenas para referência):
									</label>
									<VSCodeTextField
										value={userPhoneNumber}
										onInput={(e: any) => setUserPhoneNumber(e.target.value)}
										placeholder="Exemplo: +5511999999999"
										style={{ width: "100%" }}
									/>
									<div
										style={{
											fontSize: "11px",
											color: "var(--vscode-descriptionForeground)",
											marginTop: "4px",
											fontStyle: "italic",
										}}>
										Este campo é opcional. A autenticação será feita via QR code.
									</div>
								</div>
							)}

							{connectedNumber && connectionStatus === "connected" && (
								<div
									style={{
										padding: "8px 12px",
										backgroundColor: "var(--vscode-button-secondaryBackground)",
										borderRadius: "4px",
										marginBottom: "12px",
									}}>
									<strong>Conectado como:</strong> {connectedNumber}
								</div>
							)}
						</div>

						{/* Status de conexão e botão */}
						<div
							style={{
								marginBottom: "16px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<div>
								<strong>Status:</strong> {getStatusText()}
								{isLoading && " (processando...)"}
							</div>
							<VSCodeButton appearance="secondary" onClick={handleToggleConnection} disabled={isLoading}>
								{isLoading
									? "Processando..."
									: connectionStatus === "connected" || connectionStatus === "connecting"
										? "Desconectar"
										: "Conectar"}
							</VSCodeButton>
						</div>

						{/* QR Code para autenticação */}
						{connectionStatus === "connecting" && qrCode && (
							<div
								style={{
									marginBottom: "16px",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									padding: "16px",
									backgroundColor: "var(--vscode-textCodeBlock-background)",
									borderRadius: "8px",
								}}>
								<div
									style={{
										fontWeight: "bold",
										marginBottom: "12px",
										textAlign: "center",
									}}>
									Escaneie o QR Code com o WhatsApp
								</div>
								<div
									style={{
										padding: "12px",
										backgroundColor: "white",
										borderRadius: "8px",
										boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
									}}>
									<img
										src={`data:image/png;base64,${qrCode}`}
										alt="QR Code para autenticação no WhatsApp: 1. Abra o aplicativo, 2. Acesse Dispositivos conectados, 3. Toque em Conectar um dispositivo, 4. Escaneie este código"
										role="img"
										aria-label="Código QR para conexão do WhatsApp contendo instruções passo a passo"
										style={{ width: "200px", height: "200px", display: "block" }}
									/>
								</div>
								<div
									style={{
										fontSize: "12px",
										color: "var(--vscode-descriptionForeground)",
										marginTop: "8px",
										textAlign: "center",
										lineHeight: "1.4",
									}}>
									1. Abra o WhatsApp no seu celular
									<br />
									2. Vá em Configurações → Dispositivos conectados
									<br />
									3. Toque em &ldquo;Conectar um dispositivo&quot;
									<br />
									4. Escaneie este QR code
								</div>
							</div>
						)}

						{/* Informações sobre o uso */}
						<div
							style={{
								fontSize: "11px",
								color: "var(--vscode-descriptionForeground)",
								padding: "12px",
								backgroundColor: "var(--vscode-textCodeBlock-background)",
								borderRadius: "4px",
								lineHeight: "1.4",
							}}>
							<strong>Como funciona:</strong>
							<br />
							• Após conectar, você pode usar comandos @elai no WhatsApp
							<br />
							• @elai [tarefa] - cria uma nova tarefa no ElaiRoo
							<br />
							• @elaifim - finaliza a tarefa ativa
							<br />
							• @elainow [texto] - adiciona à tarefa ativa
							<br />• As respostas aparecerão no chat normal do ElaiRoo
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default WhatsAppMcpView
