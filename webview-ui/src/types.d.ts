// Type declarations for third-party modules

declare module "knuth-shuffle-seeded" {
	export default function knuthShuffle<T>(array: T[], seed: any): T[]
}

// Estendendo o tipo WebviewMessage para incluir executeMcpTool
declare module "@src/shared/WebviewMessage" {
	interface WebviewMessage {
		type: WebviewMessage["type"] | "executeMcpTool"
		tool?: string
		args?: Record<string, any>
		server?: string
		[key: string]: any // Permite outras propriedades
	}
}
