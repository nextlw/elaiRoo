import { ZodError } from "zod"

import { logger } from "../../utils/logging"
import { PostHogClient, ClineProviderInterface } from "./PostHogClient"

/**
 * TelemetryService wrapper class that defers PostHogClient initialization
 * This ensures that we only create the PostHogClient after environment variables are loaded
 */
class TelemetryService {
	private client: PostHogClient | null = null
	private initialized = false

	/**
	 * Initialize the telemetry service with the PostHog client
	 * This should be called after environment variables are loaded
	 */
	public initialize(): void {
		if (this.initialized) {
			logger.debug("TelemetryService: Already initialized.")
			return
		}

		const isTestEnvironment = process.env.NODE_ENV === "test" || process.env.VSCODE_E2E_TESTS === "true"
		this.initialized = true // Mark that initialization attempt is being made. Client will be set if successful.

		try {
			// Attempt to get the client instance.
			// PostHogClient.getInstance() internally handles new PostHog(process.env.POSTHOG_API_KEY || "", ...)
			// If POSTHOG_API_KEY is undefined or "", new PostHog("") will be called,
			// which is expected to throw "Error: You must pass your PostHog project's api key."
			this.client = PostHogClient.getInstance()
			logger.info("TelemetryService: Telemetry client initialized successfully.")
		} catch (error: any) {
			this.client = null // Ensure client is null on any failure during initialization.

			const errorMessage = error instanceof Error ? error.message : String(error)
			// Check for the specific error message related to the API key.
			// It's important to match the exact error message thrown by the PostHog library or our wrapper.
			const isApiKeyMissingError = errorMessage.includes("You must pass your PostHog project's api key")

			if (isTestEnvironment) {
				if (isApiKeyMissingError) {
					logger.info(
						"TelemetryService: PostHog client initialization failed due to missing/invalid API key (expected in test environment). Telemetry will be disabled.",
					)
				} else {
					// Log unexpected errors in test environment as info as well, but distinguish them.
					logger.info(
						`TelemetryService: PostHog client initialization failed in test environment (Error: ${errorMessage}). Telemetry will be disabled.`,
					)
					console.warn(
						"Full unexpected error during PostHogClient initialization in test environment:",
						error,
					)
				}
			} else {
				// Not a test environment
				if (isApiKeyMissingError) {
					logger.warn(
						"TelemetryService: PostHog client initialization failed due to missing/invalid API key. Telemetry will be disabled. Please ensure POSTHOG_API_KEY is correctly set if telemetry is desired.",
					)
				} else {
					logger.warn(
						`TelemetryService: PostHog client initialization failed (Error: ${errorMessage}). Telemetry will be disabled.`,
					)
				}
				// Always log the full error details outside of test environments for better diagnostics.
				if (!isApiKeyMissingError) {
					// Avoid double logging if already covered by the logger.warn above with errorMessage
					console.warn("Full error during PostHogClient initialization:", error)
				}
			}
		}
	}

	/**
	 * Sets the ClineProvider reference to use for global properties
	 * @param provider A ClineProvider instance to use
	 */
	public setProvider(provider: ClineProviderInterface): void {
		// If client is initialized, pass the provider reference
		if (this.isReady) {
			this.client!.setProvider(provider)
		}

		logger.debug("TelemetryService: ClineProvider reference set")
	}

	/**
	 * Base method for all telemetry operations
	 * Checks if the service is initialized before performing any operation
	 * @returns Whether the service is ready to use
	 */
	private get isReady(): boolean {
		return this.initialized && this.client !== null
	}

	/**
	 * Updates the telemetry state based on user preferences and VSCode settings
	 * @param didUserOptIn Whether the user has explicitly opted into telemetry
	 */
	public updateTelemetryState(didUserOptIn: boolean): void {
		if (!this.isReady) {
			return
		}

		this.client!.updateTelemetryState(didUserOptIn)
	}

	/**
	 * Captures a telemetry event if telemetry is enabled
	 * @param event The event to capture with its properties
	 */
	public capture(event: { event: string; properties?: any }): void {
		if (!this.isReady) {
			return
		}

		this.client!.capture(event)
	}

	/**
	 * Generic method to capture any type of event with specified properties
	 * @param eventName The event name to capture
	 * @param properties The event properties
	 */
	public captureEvent(eventName: string, properties?: any): void {
		this.capture({ event: eventName, properties })
	}

	// Task events convenience methods
	public captureTaskCreated(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CREATED, { taskId })
	}

	public captureTaskRestarted(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.RESTARTED, { taskId })
	}

	public captureTaskCompleted(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.COMPLETED, { taskId })
	}

	public captureConversationMessage(taskId: string, source: "user" | "assistant"): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CONVERSATION_MESSAGE, { taskId, source })
	}

	public captureModeSwitch(taskId: string, newMode: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.MODE_SWITCH, { taskId, newMode })
	}

	public captureToolUsage(taskId: string, tool: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.TOOL_USED, { taskId, tool })
	}

	public captureCheckpointCreated(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CHECKPOINT_CREATED, { taskId })
	}

	public captureCheckpointDiffed(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CHECKPOINT_DIFFED, { taskId })
	}

	public captureCheckpointRestored(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CHECKPOINT_RESTORED, { taskId })
	}

	public captureContextCondensed(
		taskId: string,
		isAutomaticTrigger: boolean,
		usedCustomPrompt?: boolean,
		usedCustomApiHandler?: boolean,
	): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CONTEXT_CONDENSED, {
			taskId,
			isAutomaticTrigger,
			...(usedCustomPrompt !== undefined && { usedCustomPrompt }),
			...(usedCustomApiHandler !== undefined && { usedCustomApiHandler }),
		})
	}

	public captureSlidingWindowTruncation(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.SLIDING_WINDOW_TRUNCATION, { taskId })
	}

	public captureCodeActionUsed(actionType: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.CODE_ACTION_USED, { actionType })
	}

	public capturePromptEnhanced(taskId?: string): void {
		this.captureEvent(PostHogClient.EVENTS.TASK.PROMPT_ENHANCED, { ...(taskId && { taskId }) })
	}

	public captureSchemaValidationError({ schemaName, error }: { schemaName: string; error: ZodError }): void {
		// https://zod.dev/ERROR_HANDLING?id=formatting-errors
		this.captureEvent(PostHogClient.EVENTS.ERRORS.SCHEMA_VALIDATION_ERROR, { schemaName, error: error.format() })
	}

	public captureDiffApplicationError(taskId: string, consecutiveMistakeCount: number): void {
		this.captureEvent(PostHogClient.EVENTS.ERRORS.DIFF_APPLICATION_ERROR, { taskId, consecutiveMistakeCount })
	}

	public captureShellIntegrationError(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.ERRORS.SHELL_INTEGRATION_ERROR, { taskId })
	}

	public captureConsecutiveMistakeError(taskId: string): void {
		this.captureEvent(PostHogClient.EVENTS.ERRORS.CONSECUTIVE_MISTAKE_ERROR, { taskId })
	}

	/**
	 * Captures a title button click event
	 * @param button The button that was clicked
	 */
	public captureTitleButtonClicked(button: string): void {
		this.captureEvent("Title Button Clicked", { button })
	}

	/**
	 * Checks if telemetry is currently enabled
	 * @returns Whether telemetry is enabled
	 */
	public isTelemetryEnabled(): boolean {
		return this.isReady && this.client!.isTelemetryEnabled()
	}

	/**
	 * Shuts down the PostHog client
	 */
	public async shutdown(): Promise<void> {
		if (!this.isReady) {
			return
		}

		await this.client!.shutdown()
	}
}

// Export a singleton instance of the telemetry service wrapper
export const telemetryService = new TelemetryService()
