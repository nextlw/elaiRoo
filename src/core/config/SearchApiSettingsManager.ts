import * as vscode from "vscode"
import { z, ZodError } from "zod"

import {
	SearchApiSettings,
	searchApiSettingsSchemaDiscriminated,
	// baseSearchApiSettingsSchema, // Corrigido: Usado para estender com ID
	SearchApiProviderName,
} from "../../schemas"
import { modes } from "../../shared/modes"
import { TelemetryService } from "../../../packages/telemetry/src/TelemetryService"
// Schema para SearchApiSettings com um ID opcional, usado internamente
// Este schema garante que qualquer configuração armazenada já passou pela validação discriminada
// e, portanto, inclui 'searchApiProviderName', além de um 'id' opcional.
const searchApiSettingsWithIdSchema = searchApiSettingsSchemaDiscriminated.and(z.object({ id: z.string().optional() }))

// Tipo inferido para SearchApiSettings com ID
type SearchApiSettingsWithId = z.infer<typeof searchApiSettingsWithIdSchema>

// Schema para a estrutura que armazena todos os perfis de API de busca
export const searchApiProfilesSchema = z.object({
	currentSearchApiConfigName: z.string(),
	searchApiConfigs: z.record(z.string(), searchApiSettingsWithIdSchema),
	modeSearchApiConfigs: z.record(z.string(), z.string()).optional(), // Mapeia slug de modo para ID de perfil
})

// Tipo inferido para SearchApiProfiles
export type SearchApiProfiles = z.infer<typeof searchApiProfilesSchema>

// Tipo para entradas de lista de configuração, similar ao ProviderSettingsEntry
export type SearchApiSettingsEntry = {
	name: string
	id: string
	provider: SearchApiProviderName
}

export class SearchApiSettingsManager {
	private static readonly CONFIG_KEY = "searchApiProfiles" // Chave corrigida para settings.json (sem o prefixo "roo-cline.")
	private readonly defaultConfigId = this.generateId()

	private readonly defaultModeSearchApiConfigs: Record<string, string> = Object.fromEntries(
		modes.map((mode) => [mode.slug, this.defaultConfigId]),
	)

	private readonly defaultSearchApiProfiles: SearchApiProfiles = {
		currentSearchApiConfigName: "default",
		searchApiConfigs: {
			default: {
				id: this.defaultConfigId,
				searchApiProviderName: "duckduckgo_fallback", // Provider padrão
				isEnabled: true, // Herdado de baseSearchApiSettingsSchema
			} as SearchApiSettingsWithId, // Cast para garantir que o default seja válido
		},
		modeSearchApiConfigs: this.defaultModeSearchApiConfigs,
	}

	private readonly context: vscode.ExtensionContext

	constructor(context: vscode.ExtensionContext) {
		this.context = context
		this.initialize().catch((error) => {
			console.error("Failed to initialize SearchApiSettingsManager:", error)
			// telemetryService.captureException(error); // Método não existe, tratar erros de forma diferente
		})
	}

	public generateId(): string {
		return Math.random().toString(36).substring(2, 15)
	}

	private _lock = Promise.resolve()
	private lock<T>(cb: () => Promise<T>): Promise<T> {
		const next = this._lock.then(cb)
		this._lock = next.catch(() => {
			// Silenciar erros no lock para não travar a cadeia de promessas
		}) as Promise<void>
		return next
	}

	public async initialize(): Promise<void> {
		await this.lock(async () => {
			let profiles = await this.loadProfilesInternal()
			let isDirty = false

			if (!profiles) {
				profiles = JSON.parse(JSON.stringify(this.defaultSearchApiProfiles)) // Deep copy
				isDirty = true
			}

			if (!profiles.searchApiConfigs) {
				profiles.searchApiConfigs = JSON.parse(JSON.stringify(this.defaultSearchApiProfiles.searchApiConfigs))
				isDirty = true
			}
			if (Object.keys(profiles.searchApiConfigs).length === 0) {
				profiles.searchApiConfigs = JSON.parse(JSON.stringify(this.defaultSearchApiProfiles.searchApiConfigs))
				profiles.currentSearchApiConfigName = this.defaultSearchApiProfiles.currentSearchApiConfigName
				isDirty = true
			}

			for (const [_name, config] of Object.entries(profiles.searchApiConfigs)) {
				if (!config.id) {
					config.id = this.generateId()
					isDirty = true
				}
			}

			if (!profiles.modeSearchApiConfigs) {
				profiles.modeSearchApiConfigs = JSON.parse(JSON.stringify(this.defaultModeSearchApiConfigs))
				isDirty = true
			}

			// Garantir que todos os modos tenham uma configuração
			if (profiles.modeSearchApiConfigs) {
				// Adicionada verificação de nulidade
				for (const mode of modes) {
					if (!profiles.modeSearchApiConfigs[mode.slug]) {
						const currentProfile = profiles.searchApiConfigs[profiles.currentSearchApiConfigName]
						profiles.modeSearchApiConfigs[mode.slug] = currentProfile?.id || this.defaultConfigId
						isDirty = true
					}
				}
			}

			if (isDirty) {
				await this.saveProfilesInternal(profiles)
			}
		})
	}

	private async loadProfilesInternal(): Promise<SearchApiProfiles> {
		try {
			const config = vscode.workspace.getConfiguration("roo-cline")
			// Mudança: obter diretamente como objeto, não como string
			const content = config.get<SearchApiProfiles>("searchApiProfiles")
			if (!content) {
				// Retorna uma cópia profunda do default para evitar mutações acidentais
				return JSON.parse(JSON.stringify(this.defaultSearchApiProfiles))
			}
			// Usar safeParse para lidar com dados potencialmente malformados
			const parsed = searchApiProfilesSchema.safeParse(content)
			if (parsed.success) {
				console.log(
					"[SearchApiSettingsManager] loadProfilesInternal - Successfully parsed profiles:",
					parsed.data,
				)
				return parsed.data
			} else {
				console.error(
					"[SearchApiSettingsManager] Failed to parse SearchApiProfiles from secrets, resetting to default:",
					parsed.error,
				)
				TelemetryService.instance.captureSchemaValidationError({
					schemaName: "SearchApiProfiles",
					error: parsed.error,
				})
				// Retorna uma cópia profunda do default em caso de erro de parse
				return JSON.parse(JSON.stringify(this.defaultSearchApiProfiles))
			}
		} catch (error) {
			console.error("Error loading SearchApiProfiles, resetting to default:", error)
			if (error instanceof ZodError) {
				TelemetryService.instance.captureSchemaValidationError({ schemaName: "SearchApiProfiles", error })
			} else {
				// telemetryService.captureException(error as Error); // Método não existe
				console.error("Unhandled error during SearchApiProfiles load:", error)
			}
			return JSON.parse(JSON.stringify(this.defaultSearchApiProfiles))
		}
	}

	private async saveProfilesInternal(profiles: SearchApiProfiles): Promise<void> {
		try {
			// Validar antes de salvar
			const validatedProfiles = searchApiProfilesSchema.parse(profiles)
			const contentToSave = JSON.stringify(validatedProfiles, null, 2)
			console.log("[SearchApiSettingsManager] saveProfilesInternal - Content to save:", contentToSave)
			const config = vscode.workspace.getConfiguration("roo-cline")
			await config.update(
				SearchApiSettingsManager.CONFIG_KEY,
				JSON.parse(contentToSave),
				vscode.ConfigurationTarget.Global,
			)
			console.log(
				"[SearchApiSettingsManager] saveProfilesInternal - Successfully stored content in VS Code settings.",
			)
		} catch (error) {
			console.error("Failed to save SearchApiProfiles to VS Code settings:", error)
			if (error instanceof ZodError) {
				TelemetryService.instance.captureSchemaValidationError({ schemaName: "SearchApiProfilesOnSave", error })
			} else {
				console.error("Unhandled error during SearchApiProfiles save to VS Code settings:", error)
			}
			throw new Error(`Failed to write search API profiles to VS Code settings: ${error}`)
		}
	}

	public async createOrUpdateProfile(name: string, settings: SearchApiSettings): Promise<string> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			const existingProfile = profiles.searchApiConfigs[name]
			// O 'id' não deve vir de 'settings', pois SearchApiSettings (o tipo de 'settings') não tem 'id'.
			// O 'id' é gerenciado internamente ou vem do existingProfile.
			const id = existingProfile?.id || this.generateId()

			try {
				// Validar e filtrar settings usando o schema discriminado antes de salvar
				const validatedSettings = searchApiSettingsSchemaDiscriminated.parse(settings)
				profiles.searchApiConfigs[name] = { ...validatedSettings, id }
				await this.saveProfilesInternal(profiles)
				return id
			} catch (error) {
				console.error(`Failed to validate or save profile '${name}':`, error)
				if (error instanceof ZodError) {
					TelemetryService.instance.captureSchemaValidationError({
						schemaName: "SearchApiSettingsDiscriminatedOnSave",
						error,
					})
				} else {
					// telemetryService.captureException(error as Error); // Método não existe
					console.error(`Unhandled error during profile '${name}' save/validation:`, error)
				}
				throw new Error(
					`Failed to create or update profile '${name}': ${
						error instanceof Error ? error.message : String(error)
					}`,
				)
			}
		})
	}

	public async deleteProfile(name: string): Promise<void> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			if (!profiles.searchApiConfigs[name]) {
				throw new Error(`Search API profile '${name}' not found.`)
			}
			if (Object.keys(profiles.searchApiConfigs).length === 1) {
				throw new Error("Cannot delete the last remaining search API profile.")
			}

			const deletedProfileId = profiles.searchApiConfigs[name].id
			delete profiles.searchApiConfigs[name]

			// Se o perfil deletado era o atual, define um novo atual (o primeiro da lista)
			if (profiles.currentSearchApiConfigName === name) {
				profiles.currentSearchApiConfigName = Object.keys(profiles.searchApiConfigs)[0]
			}

			// Remover ou reatribuir o perfil dos modos que o utilizavam
			if (profiles.modeSearchApiConfigs) {
				for (const modeSlug in profiles.modeSearchApiConfigs) {
					if (profiles.modeSearchApiConfigs[modeSlug] === deletedProfileId) {
						// Reatribui ao perfil global atual ou ao default se não houver mais perfis
						const newProfileForMode =
							profiles.searchApiConfigs[profiles.currentSearchApiConfigName]?.id || this.defaultConfigId
						profiles.modeSearchApiConfigs[modeSlug] = newProfileForMode
					}
				}
			}

			await this.saveProfilesInternal(profiles)
		})
	}

	public async getProfile(name: string): Promise<(SearchApiSettingsWithId & { name: string }) | undefined> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			const profileSettings = profiles.searchApiConfigs[name]
			if (profileSettings) {
				// Garantir que o schema discriminado seja retornado para consistência com o que é salvo
				const validated = searchApiSettingsSchemaDiscriminated.safeParse(profileSettings)
				if (validated.success) {
					return { name, ...validated.data, id: profileSettings.id || this.generateId() }
				} else {
					console.warn(
						`Profile '${name}' data is not fully valid against discriminated schema, returning base:`,
						validated.error,
					)
					// Retorna o que tem, mas com um aviso. O ID é importante.
					return {
						name,
						...(profileSettings as SearchApiSettingsWithId),
						id: profileSettings.id || this.generateId(),
					}
				}
			}
			return undefined
		})
	}

	public async getProfileById(id: string): Promise<(SearchApiSettingsWithId & { name: string }) | undefined> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			const entry = Object.entries(profiles.searchApiConfigs).find(([_, config]) => config.id === id)
			if (entry) {
				const [name, profileSettings] = entry
				const validated = searchApiSettingsSchemaDiscriminated.safeParse(profileSettings)
				if (validated.success) {
					return { name, ...validated.data, id: profileSettings.id || this.generateId() }
				} else {
					console.warn(
						`Profile ID '${id}' (name: ${name}) data is not fully valid, returning base:`,
						validated.error,
					)
					return {
						name,
						...(profileSettings as SearchApiSettingsWithId),
						id: profileSettings.id || this.generateId(),
					}
				}
			}
			return undefined
		})
	}

	public async getAllProfiles(): Promise<Array<SearchApiSettingsEntry>> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			return Object.entries(profiles.searchApiConfigs).map(([name, config]) => ({
				name,
				id: config.id || this.generateId(), // Garante que haja um ID
				// Agora config é do tipo SearchApiSettings & { id?: string }, então searchApiProviderName existe.
				provider: config.searchApiProviderName as SearchApiProviderName,
			}))
		})
	}

	public async activateProfile(name: string): Promise<void> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			if (!profiles.searchApiConfigs[name]) {
				throw new Error(`Search API profile '${name}' not found. Cannot activate.`)
			}
			profiles.currentSearchApiConfigName = name
			await this.saveProfilesInternal(profiles)
		})
	}

	public async getCurrentProfileName(): Promise<string | undefined> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			return profiles.currentSearchApiConfigName
		})
	}

	public async getCurrentProfileSettings(): Promise<(SearchApiSettingsWithId & { name: string }) | undefined> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			const currentName = profiles.currentSearchApiConfigName
			if (currentName && profiles.searchApiConfigs[currentName]) {
				const profileSettings = profiles.searchApiConfigs[currentName]
				const validated = searchApiSettingsSchemaDiscriminated.safeParse(profileSettings)
				if (validated.success) {
					return { name: currentName, ...validated.data, id: profileSettings.id || this.generateId() }
				} else {
					console.warn(
						`Current profile '${currentName}' data is not fully valid, returning base:`,
						validated.error,
					)
					return {
						name: currentName,
						...(profileSettings as SearchApiSettingsWithId),
						id: profileSettings.id || this.generateId(),
					}
				}
			}
			// Se o perfil atual não existir, tenta retornar o primeiro perfil disponível ou undefined
			const firstProfileName = Object.keys(profiles.searchApiConfigs)[0]
			if (firstProfileName) {
				console.warn(`Current profile '${currentName}' not found, falling back to '${firstProfileName}'.`)
				profiles.currentSearchApiConfigName = firstProfileName // Corrigir o estado
				await this.saveProfilesInternal(profiles) // Salvar a correção
				const profileSettings = profiles.searchApiConfigs[firstProfileName]
				const validated = searchApiSettingsSchemaDiscriminated.safeParse(profileSettings)
				if (validated.success) {
					return { name: firstProfileName, ...validated.data, id: profileSettings.id || this.generateId() }
				} else {
					console.warn(
						`Fallback profile '${firstProfileName}' data is not fully valid, returning base:`,
						validated.error,
					)
					return {
						name: firstProfileName,
						...(profileSettings as SearchApiSettingsWithId),
						id: profileSettings.id || this.generateId(),
					}
				}
			}
			return undefined
		})
	}

	public async setModeProfile(modeSlug: string, profileId: string): Promise<void> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			// Verificar se o profileId existe
			const profileExists = Object.values(profiles.searchApiConfigs).some((p) => p.id === profileId)
			if (!profileExists) {
				throw new Error(
					`Search API profile with ID '${profileId}' not found. Cannot set for mode '${modeSlug}'.`,
				)
			}

			if (!profiles.modeSearchApiConfigs) {
				profiles.modeSearchApiConfigs = {}
			}
			profiles.modeSearchApiConfigs[modeSlug] = profileId
			await this.saveProfilesInternal(profiles)
		})
	}

	public async getModeProfileName(modeSlug: string): Promise<string | undefined> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			const profileId = profiles.modeSearchApiConfigs?.[modeSlug]
			if (profileId) {
				const profileEntry = Object.entries(profiles.searchApiConfigs).find(
					([_name, config]) => config.id === profileId,
				)
				return profileEntry ? profileEntry[0] : undefined
			}
			return undefined
		})
	}

	public async getModeProfileSettings(
		modeSlug: string,
	): Promise<(SearchApiSettingsWithId & { name: string }) | undefined> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			const profileId =
				profiles.modeSearchApiConfigs?.[modeSlug] ||
				profiles.searchApiConfigs[profiles.currentSearchApiConfigName]?.id

			if (profileId) {
				const profileEntry = Object.entries(profiles.searchApiConfigs).find(
					([_name, config]) => config.id === profileId,
				)
				if (profileEntry) {
					const [name, settings] = profileEntry
					const validated = searchApiSettingsSchemaDiscriminated.safeParse(settings)
					if (validated.success) {
						return { name, ...validated.data, id: settings.id || this.generateId() }
					} else {
						console.warn(
							`Mode profile '${name}' (for mode ${modeSlug}) data is not fully valid, returning base:`,
							validated.error,
						)
						return { name, ...(settings as SearchApiSettingsWithId), id: settings.id || this.generateId() }
					}
				}
			}
			// Fallback to global current if mode specific not found or ID is invalid
			return this.getCurrentProfileSettings()
		})
	}

	public async exportProfiles(): Promise<SearchApiProfiles> {
		return this.lock(async () => {
			const profiles = await this.loadProfilesInternal()
			// Validar e limpar cada config antes de exportar
			const cleanedConfigs: Record<string, SearchApiSettingsWithId> = {}
			for (const name in profiles.searchApiConfigs) {
				const config = profiles.searchApiConfigs[name]
				try {
					// Usar o schema discriminado para garantir que apenas campos relevantes sejam exportados
					const validatedConfig = searchApiSettingsSchemaDiscriminated.parse(config)
					cleanedConfigs[name] = { ...validatedConfig, id: config.id }
				} catch (error) {
					console.warn(`Could not fully validate config '${name}' for export, exporting as is:`, error)
					cleanedConfigs[name] = config // Exportar como está se a validação falhar
				}
			}
			return { ...profiles, searchApiConfigs: cleanedConfigs }
		})
	}

	public async importProfiles(profilesToImport: SearchApiProfiles): Promise<void> {
		return this.lock(async () => {
			// Validar os perfis importados
			try {
				const validatedProfiles = searchApiProfilesSchema.parse(profilesToImport)
				// Garantir que todos os configs tenham IDs
				for (const name in validatedProfiles.searchApiConfigs) {
					if (!validatedProfiles.searchApiConfigs[name].id) {
						validatedProfiles.searchApiConfigs[name].id = this.generateId()
					}
				}
				await this.saveProfilesInternal(validatedProfiles)
			} catch (error) {
				console.error("Failed to import search API profiles due to validation error:", error)
				if (error instanceof ZodError) {
					TelemetryService.instance.captureSchemaValidationError({
						schemaName: "SearchApiProfilesOnImport",
						error,
					})
				} else {
					console.error("Unhandled error during SearchApiProfiles import:", error)
				}
				throw new Error(
					`Failed to import search API profiles: ${error instanceof Error ? error.message : String(error)}`,
				)
			}
		})
	}

	public async resetAllProfiles(): Promise<void> {
		return this.lock(async () => {
			// Limpar a configuração antiga se existir
			const config = vscode.workspace.getConfiguration("roo-cline")
			await config.update("searchApiProfiles", undefined, vscode.ConfigurationTarget.Global)
			// Opcionalmente, reinicializar para os padrões imediatamente
			await this.initialize()
		})
	}
}
