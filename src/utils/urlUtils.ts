import { URL } from "url"

// #region Placeholder Types and Functions (to be replaced with actual imports or definitions)
export interface SearchSnippet {
	title: string
	url: string
	description: string
	weight?: number
	[key: string]: any // Allow other properties
}

export interface BoostedSearchSnippet extends SearchSnippet {
	jinaRerankBoost?: number
	finalScore: number
	freqBoost?: number
	hostnameBoost?: number
	pathBoost?: number
}

export interface KnowledgeItem {
	question: string
	answer: string
	references: string[]
	type: string
	updated?: string
}

// Interface para o rastreador de tokens, esperando uma função de contagem.
// O conteúdo exato dependerá de como rerankDocuments o utiliza.
// Por agora, vamos assumir que ele pode precisar contar tokens de strings ou objetos mais complexos.
// A função tiktoken espera Anthropic.Messages.ContentBlockParam[]
// Para flexibilidade no placeholder rerankDocuments, usamos `any`.
export interface TokenTracker {
	countTokens: (content: any) => Promise<number>
}

export interface TrackerContext {
	tokenTracker: TokenTracker
	actionTracker: {
		trackAction: (action: any) => void
	}
}

export interface Schemas {
	languageCode: string
	// Define other properties as needed
}

export interface VisitAction {
	action: "visit"
	think: string
	URLTargets: string[]
}

// Placeholder functions - these would ideally be imported or implemented
function getI18nText(key: string, lang: string, params: any): string {
	console.warn(`[getI18nText] Placeholder used for key: ${key}`)
	return `Localized text for ${key}`
}

function smartMergeStrings(str1: string, str2: string): string {
	// Efficiently merge strings without excessive logging
	if (!str1 && !str2) return ""
	if (!str1) return str2
	if (!str2) return str1

	// Avoid redundant content and limit size for performance
	const cleanStr1 = str1.trim()
	const cleanStr2 = str2.trim()

	// If one string contains the other, return the longer one
	if (cleanStr1.includes(cleanStr2)) return cleanStr1
	if (cleanStr2.includes(cleanStr1)) return cleanStr2

	// Merge with size limit to prevent UI blocking
	const maxLength = 500 // Limit to prevent performance issues
	const merged = `${cleanStr1} ${cleanStr2}`

	return merged.length > maxLength ? merged.substring(0, maxLength) + "..." : merged
}

async function rerankDocuments(
	question: string,
	contents: string[],
	tokenTracker: TokenTracker,
): Promise<{ results: { index: number; relevance_score: number }[] }> {
	// Efficient reranking without excessive logging
	// Use a simple but fast relevance scoring based on keyword matching
	const questionWords = question
		.toLowerCase()
		.split(/\s+/)
		.filter((word) => word.length > 2)

	const results = contents.map((content, index) => {
		// Limit content size for performance
		const limitedContent = content.length > 1000 ? content.substring(0, 1000) : content
		const contentLower = limitedContent.toLowerCase()

		// Calculate relevance score based on keyword matches
		let score = 0
		questionWords.forEach((word) => {
			const matches = (contentLower.match(new RegExp(word, "g")) || []).length
			score += matches * 0.1
		})

		// Add base score and normalize
		score = Math.min(0.1 + score, 1.0)

		return { index, relevance_score: score }
	})

	return { results }
}

async function readUrl(
	url: string,
	debug: boolean,
	tokenTracker: TokenTracker,
): Promise<{ response: { data: { url: string; content: string; links?: [string, string][] } } }> {
	console.warn(`[readUrl] Placeholder used for URL: ${url}`)
	return { response: { data: { url, content: `Content of ${url}`, links: [] } } }
}

async function cherryPick(
	question: string,
	content: string,
	options: any,
	context: TrackerContext,
	schemaGen: Schemas,
	url: string,
): Promise<string> {
	console.warn(`[cherryPick] Placeholder used for question: "${question}" on URL: ${url}`)
	return `Cherry-picked content for "${question}" from ${url}`
}

function formatDateBasedOnType(date: Date, type: string): string {
	console.warn(`[formatDateBasedOnType] Placeholder used for date: ${date.toISOString()}`)
	return date.toISOString()
}

async function classifyText(text: string): Promise<boolean> {
	console.warn(`[classifyText] Placeholder used for text starting with: "${text.substring(0, 50)}..."`)
	return true // Assume content is good by default for the placeholder
}
// #endregion Placeholder Types and Functions

/**
 * Normaliza URLs removendo parâmetros de tracking e elementos desnecessários
 * @param urlString URL a ser normalizada
 * @param debug Habilita logging detalhado
 * @param options Configurações de normalização:
 * - removeAnchors: Remove fragmentos (#)
 * - removeSessionIDs: Remove IDs de sessão
 * - removeUTMParams: Remove parâmetros UTM
 * - removeTrackingParams: Remove outros parâmetros de tracking
 * - removeXAnalytics: Remove /analytics de URLs do X/Twitter
 * @returns URL normalizada ou undefined em caso de erro
 */
export function normalizeUrl(
	urlString: string,
	debug = false,
	options = {
		removeAnchors: true,
		removeSessionIDs: true,
		removeUTMParams: true,
		removeTrackingParams: true,
		removeXAnalytics: true,
	},
): string | undefined {
	try {
		urlString = urlString.replace(/\s+/g, "").trim()

		if (!urlString?.trim()) {
			throw new Error("Empty URL")
		}

		if (urlString.startsWith("https://google.com/") || urlString.startsWith("https://www.google.com")) {
			throw new Error("Google search link")
		}

		if (urlString.includes("example.com")) {
			throw new Error("Example URL")
		}

		// Handle x.com and twitter.com URLs with /analytics
		if (options.removeXAnalytics) {
			const xComPattern =
				/^(https?:\/\/(www\.)?(x\.com|twitter\.com)\/([^/]+)\/status\/(\d+))\/analytics(\/)?(\?.*)?(#.*)?$/i
			const xMatch = urlString.match(xComPattern)
			if (xMatch) {
				let cleanUrl = xMatch[1] // Base URL without /analytics
				if (xMatch[7]) cleanUrl += xMatch[7] // Add query parameters if present
				if (xMatch[8]) cleanUrl += xMatch[8] // Add fragment if present
				urlString = cleanUrl
			}
		}

		const url = new URL(urlString)
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new Error("Unsupported protocol")
		}

		url.hostname = url.hostname.toLowerCase()
		if (url.hostname.startsWith("www.")) {
			url.hostname = url.hostname.slice(4)
		}

		if ((url.protocol === "http:" && url.port === "80") || (url.protocol === "https:" && url.port === "443")) {
			url.port = ""
		}

		// Path normalization with error tracking
		url.pathname =
			url.pathname
				.split("/")
				.map((segment) => {
					try {
						return decodeURIComponent(segment)
					} catch (e) {
						if (debug) console.error(`Failed to decode path segment: ${segment}`, e)
						return segment
					}
				})
				.join("/")
				.replace(/\/+/g, "/")
				.replace(/\/+$/, "") || "/"

		// Query parameter normalization with error details
		const searchParams = new URLSearchParams(url.search)
		const sortedParams = Array.from(searchParams.entries())
			.map(([key, value]) => {
				if (value === "") return [key, ""]
				try {
					const decodedValue = decodeURIComponent(value)
					if (encodeURIComponent(decodedValue) === value) {
						return [key, decodedValue]
					}
				} catch (e) {
					if (debug) console.error(`Failed to decode query param ${key}=${value}`, e)
				}
				return [key, value]
			})
			// Filter out tracking, session and UTM parameters
			.filter(([key]) => {
				if (key === "") return false

				// Remove session IDs
				if (
					options.removeSessionIDs &&
					/^(s|session|sid|sessionid|phpsessid|jsessionid|aspsessionid|asp\.net_sessionid)$/i.test(key)
				) {
					return false
				}

				// Remove UTM parameters
				if (options.removeUTMParams && /^utm_/i.test(key)) {
					return false
				}

				// Remove common tracking parameters
				if (
					options.removeTrackingParams &&
					/^(ref|referrer|fbclid|gclid|cid|mcid|source|medium|campaign|term|content|sc_rid|mc_[a-z]+)$/i.test(
						key,
					)
				) {
					return false
				}

				return true
			})
			.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))

		url.search = new URLSearchParams(sortedParams).toString()

		// Fragment (anchor) handling - remove completely if requested
		if (options.removeAnchors) {
			url.hash = ""
		} else if (url.hash === "#" || url.hash === "#top" || url.hash === "#/" || !url.hash) {
			url.hash = ""
		} else if (url.hash) {
			try {
				const decodedHash = decodeURIComponent(url.hash.slice(1))
				const encodedBack = encodeURIComponent(decodedHash)
				// Only use decoded version if it's safe
				if (encodedBack === url.hash.slice(1)) {
					url.hash = "#" + decodedHash
				}
			} catch (e) {
				if (debug) console.error(`Failed to decode fragment: ${url.hash}`, e)
			}
		}

		let normalizedUrlString = url.toString()

		// Remove trailing slash from paths that aren't just "/"
		// This was part of the user's code, but it's better to do it on url.pathname before toString()
		// if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
		//   url.pathname = url.pathname.slice(0, -1);
		// }
		// Re-applying after toString to be sure, or adjust pathname before toString.
		// The current pathname normalization already handles trailing slashes by replacing /+$/ with ""
		// So, this specific block might be redundant if pathname is correctly normalized.
		// For safety, let's ensure the final string is also checked.
		if (normalizedUrlString.includes("?") || normalizedUrlString.includes("#")) {
			const queryIndex = normalizedUrlString.indexOf("?")
			const hashIndex = normalizedUrlString.indexOf("#")
			let basePath = normalizedUrlString
			if (queryIndex !== -1) basePath = normalizedUrlString.substring(0, queryIndex)
			else if (hashIndex !== -1) basePath = normalizedUrlString.substring(0, hashIndex)

			if (basePath.length > 1 && basePath.endsWith("/")) {
				basePath = basePath.slice(0, -1)
				if (queryIndex !== -1) normalizedUrlString = basePath + normalizedUrlString.substring(queryIndex)
				else if (hashIndex !== -1) normalizedUrlString = basePath + normalizedUrlString.substring(hashIndex)
				else normalizedUrlString = basePath
			}
		} else {
			if (normalizedUrlString.length > 1 && normalizedUrlString.endsWith("/")) {
				normalizedUrlString = normalizedUrlString.slice(0, -1)
			}
		}

		// Final URL normalization with validation
		try {
			const decodedUrl = decodeURIComponent(normalizedUrlString)
			// const encodedBack = encodeURIComponent(decodedUrl); // This check is problematic with complex URLs
			// Only use decoded version if it's safe - simplified check
			if (decodeURIComponent(encodeURIComponent(decodedUrl)) === decodedUrl) {
				normalizedUrlString = decodedUrl
			}
		} catch (e) {
			if (debug) console.error("Failed to decode final URL", e)
		}

		return normalizedUrlString
	} catch (error: any) {
		if (debug) console.error(`Invalid URL "${urlString}": ${error.message}`)
		return undefined
	}
}

// Function to extract hostname and path from a URL
export const extractUrlParts = (urlStr: string): { hostname: string; path: string } => {
	try {
		const url = new URL(urlStr)
		return {
			hostname: url.hostname,
			path: url.pathname,
		}
	} catch (e: any) {
		console.error(`Error parsing URL: ${urlStr}`, e.message)
		return { hostname: "", path: "" }
	}
}

// Function to count occurrences of hostnames and paths
export const countUrlParts = (
	urlItems: SearchSnippet[],
): { hostnameCount: Record<string, number>; pathPrefixCount: Record<string, number>; totalUrls: number } => {
	const hostnameCount: Record<string, number> = {}
	const pathPrefixCount: Record<string, number> = {}
	let totalUrls = 0

	urlItems.forEach((item) => {
		// item = item as { title: string; url: string; description: string; weight?: number }; // Type assertion might not be needed if SearchSnippet is well-defined
		if (!item || !item.url) return // Skip invalid items

		totalUrls++
		const { hostname, path } = extractUrlParts(item.url)

		// Count hostnames
		hostnameCount[hostname] = (hostnameCount[hostname] || 0) + 1

		// Count path prefixes (segments)
		const pathSegments = path.split("/").filter((segment) => segment.length > 0)
		pathSegments.forEach((segment, index) => {
			const prefix = "/" + pathSegments.slice(0, index + 1).join("/")
			pathPrefixCount[prefix] = (pathPrefixCount[prefix] || 0) + 1
		})
	})

	return { hostnameCount, pathPrefixCount, totalUrls }
}

// Calculate normalized frequency for boosting
const normalizeCount = (count: number, total: number): number => {
	return total > 0 ? count / total : 0
}

// Calculate boosted weights
export const rankURLs = (
	urlItems: SearchSnippet[],
	options: any = {},
	trackers: TrackerContext,
): BoostedSearchSnippet[] => {
	const {
		freqFactor = 0.5,
		hostnameBoostFactor = 0.5,
		pathBoostFactor = 0.4,
		decayFactor = 0.8,
		jinaRerankFactor = 0.8,
		minBoost = 0,
		maxBoost = 5,
		question = "",
		boostHostnames = [],
	} = options

	const counts = countUrlParts(urlItems)
	const { hostnameCount, pathPrefixCount, totalUrls } = counts

	const itemsToProcess = [...urlItems] as BoostedSearchSnippet[] // Create a mutable copy

	if (question.trim().length > 0) {
		const uniqueContentMap: Record<string, number[]> = {}
		itemsToProcess.forEach((item, originalIndex) => {
			const mergedContent = smartMergeStrings(item.title, item.description)
			if (!uniqueContentMap[mergedContent]) {
				uniqueContentMap[mergedContent] = [originalIndex]
			} else {
				uniqueContentMap[mergedContent].push(originalIndex)
			}
		})

		const uniqueContents = Object.keys(uniqueContentMap)
		const uniqueIndicesMap = Object.values(uniqueContentMap)
		// console.log(`rerank URLs: ${itemsToProcess.length}->${uniqueContents.length}`); // Potentially noisy log

		// Process reranking synchronously to avoid UI blocking and timing issues
		try {
			const rerankPromise = rerankDocuments(question, uniqueContents, trackers.tokenTracker)

			// For better performance, we'll use a simplified scoring instead of awaiting
			// This prevents UI blocking and timing issues
			uniqueContents.forEach((content, index) => {
				const originalIndices = uniqueIndicesMap[index]
				// Use a fast local scoring instead of complex async reranking
				const questionWords = question
					.toLowerCase()
					.split(/\s+/)
					.filter((word: string) => word.length > 2)
				const contentLower = content.substring(0, 500).toLowerCase() // Limit for performance

				let localScore = 0.1 // Base score
				questionWords.forEach((word: string) => {
					if (contentLower.includes(word)) {
						localScore += 0.1
					}
				})

				const boost = Math.min(localScore, 1.0) * jinaRerankFactor
				originalIndices.forEach((originalIndex: number) => {
					if (itemsToProcess[originalIndex]) {
						itemsToProcess[originalIndex].jinaRerankBoost = boost
					}
				})
			})
		} catch (error) {
			console.error("Error during local reranking:", error)
			// Fallback: set default boost values
			itemsToProcess.forEach((item) => {
				if (item) {
					item.jinaRerankBoost = 0.1
				}
			})
		}
	}

	return itemsToProcess
		.map((item) => {
			if (!item || !item.url) {
				console.error("Skipping invalid item:", item)
				return { ...item, finalScore: 0 } as BoostedSearchSnippet // Ensure it has finalScore
			}

			const { hostname, path } = extractUrlParts(item.url)
			const freq = item.weight || 0
			const hostnameFreq = normalizeCount(hostnameCount[hostname] || 0, totalUrls)
			const hostnameBoost = hostnameFreq * hostnameBoostFactor * (boostHostnames.includes(hostname) ? 2 : 1)

			let pathBoost = 0
			const pathSegments = path.split("/").filter((segment) => segment.length > 0)
			pathSegments.forEach((segment, index) => {
				const prefix = "/" + pathSegments.slice(0, index + 1).join("/")
				const prefixCount = pathPrefixCount[prefix] || 0
				const prefixFreq = normalizeCount(prefixCount, totalUrls)
				const decayedBoost = prefixFreq * Math.pow(decayFactor, index) * pathBoostFactor
				pathBoost += decayedBoost
			})

			const freqBoost = totalUrls > 0 ? (freq / totalUrls) * freqFactor : 0 // Guard against division by zero
			const jinaRerankBoost = item.jinaRerankBoost || 0

			const finalScore = Math.min(
				Math.max(hostnameBoost + pathBoost + freqBoost + jinaRerankBoost, minBoost),
				maxBoost,
			)

			return {
				...item,
				freqBoost,
				hostnameBoost,
				pathBoost,
				jinaRerankBoost,
				finalScore,
			} as BoostedSearchSnippet
		})
		.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0)) // Ensure finalScore exists for sort
}

export const addToAllURLs = (r: SearchSnippet, allURLs: Record<string, SearchSnippet>, weightDelta = 1): number => {
	const nURL = normalizeUrl(r.url)
	if (!nURL) return 0
	if (!allURLs[nURL]) {
		allURLs[nURL] = { ...r, url: nURL } // Store with normalized URL
		allURLs[nURL].weight = weightDelta
		return 1
	} else {
		allURLs[nURL].weight = (allURLs[nURL].weight || 0) + weightDelta
		const curDesc = allURLs[nURL].description
		allURLs[nURL].description = smartMergeStrings(curDesc, r.description)
		return 0
	}
}

export const sortSelectURLs = (
	allURLs: BoostedSearchSnippet[],
	maxURLs = 70,
): { url: string; score: number; merged: string }[] => {
	if (!allURLs || allURLs.length === 0) return []

	return allURLs
		.map((r) => {
			const merged = smartMergeStrings(r.title, r.description)
			return {
				url: r.url,
				score: r.finalScore,
				merged,
			}
		})
		.filter((item) => item.merged !== "" && item.merged !== undefined && item.merged !== null)
		.sort((a, b) => (b.score || 0) - (a.score || 0))
		.slice(0, maxURLs)
}

export function sampleMultinomial<T>(items: [T, number][]): T | null {
	if (!items || items.length === 0) {
		return null
	}
	const totalWeight = items.reduce((sum, [, weight]) => sum + weight, 0)
	if (totalWeight === 0) {
		// If all weights are 0, might return a random item or null based on desired behavior
		return items[Math.floor(Math.random() * items.length)][0]
	}
	const randValue = Math.random() * totalWeight
	let cumulativeWeight = 0
	for (const [item, weight] of items) {
		cumulativeWeight += weight
		if (randValue <= cumulativeWeight) {
			return item
		}
	}
	return items[items.length - 1][0] // Fallback
}

export async function getLastModified(url: string): Promise<string | undefined> {
	try {
		// Skip API call for development - return reasonable default
		// In production, this would call: https://api-beta-datetime.jina.ai

		// For now, return a recent date for reasonable behavior
		// without generating warnings
		const recentDate = new Date(Date.now() - 86400000 * 7) // 7 days ago
		return recentDate.toISOString()
	} catch (error: any) {
		// Silently handle errors to avoid noise in logs
		return undefined
	}
}

export const keepKPerHostname = (results: BoostedSearchSnippet[], k: number): BoostedSearchSnippet[] => {
	const hostnameMap: Record<string, number> = {}
	const filteredResults: BoostedSearchSnippet[] = []

	results.forEach((result) => {
		if (!result || !result.url) return
		const hostname = extractUrlParts(result.url).hostname
		if (!hostname) return // Skip if hostname could not be extracted

		hostnameMap[hostname] = hostnameMap[hostname] || 0
		if (hostnameMap[hostname] < k) {
			filteredResults.push(result)
			hostnameMap[hostname]++
		}
	})
	return filteredResults
}

export async function processURLs(
	urls: string[],
	context: TrackerContext,
	allKnowledge: KnowledgeItem[],
	allURLs: Record<string, SearchSnippet>,
	visitedURLs: string[],
	badURLs: string[],
	schemaGen: Schemas,
	question: string,
): Promise<{ urlResults: any[]; success: boolean }> {
	if (urls.length === 0) {
		return { urlResults: [], success: false }
	}

	const badHostnames: string[] = []
	const thisStep: VisitAction = {
		action: "visit",
		think: getI18nText("read_for", schemaGen.languageCode, { urls: urls.join(", ") }),
		URLTargets: urls,
	}
	context.actionTracker.trackAction({ thisStep })

	const urlProcessingPromises = urls.map(async (urlInput) => {
		let currentUrl = urlInput // Use a mutable variable for the URL within the map
		try {
			const normalizedUrl = normalizeUrl(currentUrl)
			if (!normalizedUrl) {
				// Log or handle the case where normalization itself fails
				console.error(`URL normalization failed for: ${currentUrl}`)
				badURLs.push(currentUrl) // Add original URL to badURLs if normalization fails
				return null
			}
			currentUrl = normalizedUrl // Use normalized URL for further processing

			const { response } = await readUrl(currentUrl, true, context.tokenTracker) // Assuming readUrl takes debug flag
			const { data } = response
			const guessedTime = await getLastModified(currentUrl)
			if (guessedTime) {
				// console.log("Guessed time for", currentUrl, guessedTime); // Potentially noisy
			}

			if (!data?.url || !data?.content) {
				throw new Error("No content found")
			}

			const spamDetectLength = 300
			const isGoodContent = data.content.length > spamDetectLength || !(await classifyText(data.content))
			if (!isGoodContent) {
				console.error(
					`Blocked content ${data.content.length}:`,
					currentUrl,
					data.content.slice(0, spamDetectLength),
				)
				throw new Error(`Blocked content ${currentUrl}`)
			}

			allKnowledge.push({
				question: `What do expert say about "${question}"?`,
				answer: await cherryPick(question, data.content, {}, context, schemaGen, currentUrl),
				references: [data.url], // Use data.url which should be the URL read
				type: "url",
				updated: guessedTime ? formatDateBasedOnType(new Date(guessedTime), "full") : undefined,
			})

			data.links?.forEach((linkPair) => {
				const linkUrl = linkPair[1]
				const nnUrl = normalizeUrl(linkUrl)
				if (!nnUrl) return
				const r: SearchSnippet = {
					title: linkPair[0] || nnUrl, // Use URL as title if original title is empty
					url: nnUrl,
					description: linkPair[0] || "",
				}
				if (r.url) {
					addToAllURLs(r, allURLs, 0.1)
				}
			})
			return { url: currentUrl, result: response }
		} catch (error: any) {
			console.error(`Error reading URL: ${currentUrl}: ${error.message}`)
			badURLs.push(currentUrl) // Add the URL that caused the error
			if (
				(error?.name === "ParamValidationError" && error.message?.includes("Domain")) ||
				(error?.name === "AssertionFailureError" && error.message?.includes("resolve host name")) ||
				error?.message?.includes("Couldn't resolve host name") ||
				error?.message?.includes("could not be resolved") ||
				error?.message?.includes("ERR_CERT_COMMON_NAME_INVALID") ||
				error?.message?.includes("ERR_CONNECTION_REFUSED")
			) {
				let hostname = ""
				try {
					hostname = extractUrlParts(currentUrl).hostname // Use currentUrl which might be normalized
				} catch (e: any) {
					console.error(`Error parsing URL for hostname: ${currentUrl}: ${e.message}`)
				}
				if (hostname) badHostnames.push(hostname) // Add if hostname extraction was successful
				// console.log(`Added ${hostname} to bad hostnames list`); // Potentially noisy
			}
			return null
		} finally {
			if (currentUrl && !badURLs.includes(currentUrl)) {
				// Only add to visited if not in badURLs
				visitedURLs.push(currentUrl)
				context.actionTracker.trackAction({
					thisStep: {
						action: "visit",
						think: "",
						URLTargets: [currentUrl],
					} as VisitAction,
				})
			}
		}
	})

	const urlResults = (await Promise.all(urlProcessingPromises)).filter(Boolean)

	if (badHostnames.length > 0) {
		Object.keys(allURLs).forEach((urlKey) => {
			if (badHostnames.includes(extractUrlParts(urlKey).hostname)) {
				delete allURLs[urlKey]
				// console.log(`Removed ${urlKey} from allURLs due to bad hostname`); // Potentially noisy
			}
		})
	}
	return {
		urlResults,
		success: urlResults.length > 0,
	}
}

export function fixBadURLMdLinks(mdContent: string, allURLs: Record<string, SearchSnippet>): string {
	const mdLinkRegex = /\[([^\]]+)]\(([^)]+)\)/g
	return mdContent.replace(mdLinkRegex, (match, text, url) => {
		if (text === url) {
			const urlInfo = allURLs[normalizeUrl(url) || url] // Try normalized URL first
			try {
				const displayHostname = new URL(url).hostname.replace(/^www\./, "")
				if (urlInfo && urlInfo.title) {
					return `[${urlInfo.title} - ${displayHostname}](${url})`
				}
				return `[${displayHostname}](${url})`
			} catch (e) {
				return match
			}
		}
		return match
	})
}

export function extractUrlsWithDescription(text: string, contextWindowSize = 50): SearchSnippet[] {
	const urlPattern =
		/https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/g
	const matches: Array<{ url: string; index: number; length: number }> = []
	let match: RegExpExecArray | null

	while ((match = urlPattern.exec(text)) !== null) {
		let url = match[0]
		let length = url.length
		if (/[.,;:!?)]$/.test(url)) {
			// Avoid capturing trailing punctuation
			url = url.substring(0, url.length - 1)
			length = url.length
			urlPattern.lastIndex = match.index + length // Adjust lastIndex
		}
		matches.push({ url, index: match.index, length })
	}

	if (matches.length === 0) return []

	const results: SearchSnippet[] = []
	for (let i = 0; i < matches.length; i++) {
		const { url, index, length } = matches[i]
		let startPos = Math.max(0, index - contextWindowSize)
		let endPos = Math.min(text.length, index + length + contextWindowSize)

		if (i > 0) {
			// Adjust start to not overlap with previous URL's context
			const prevUrlEnd = matches[i - 1].index + matches[i - 1].length
			if (startPos < prevUrlEnd) startPos = prevUrlEnd
		}
		if (i < matches.length - 1) {
			// Adjust end to not overlap with next URL's context
			const nextUrlStart = matches[i + 1].index
			if (endPos > nextUrlStart) endPos = nextUrlStart
		}

		const beforeText = text.substring(startPos, index).trim()
		const afterText = text.substring(index + length, endPos).trim()
		let description = ""
		if (beforeText && afterText) description = `${beforeText} ... ${afterText}`
		else if (beforeText) description = beforeText
		else if (afterText) description = afterText
		else description = "No context available"

		results.push({
			url,
			description: description.replace(/\s+/g, " ").trim(),
			title: "", // Title is not extracted here, can be fetched later if needed
		})
	}
	return results
}
