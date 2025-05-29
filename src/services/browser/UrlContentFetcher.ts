import * as vscode from "vscode"
import * as fs from "fs/promises"
import * as path from "path"
import { Browser, Page, launch } from "puppeteer-core"
import * as cheerio from "cheerio"
import TurndownService from "turndown"
// @ts-ignore
import PCR from "puppeteer-chromium-resolver"
import { fileExistsAtPath } from "../../utils/fs"

interface PCRStats {
	puppeteer: { launch: typeof launch }
	executablePath: string
}

export class UrlContentFetcher {
	private context: vscode.ExtensionContext
	private browser?: Browser
	private page?: Page

	constructor(context: vscode.ExtensionContext) {
		this.context = context
	}

	private async ensureChromiumExists(): Promise<PCRStats> {
		const globalStoragePath = this.context?.globalStorageUri?.fsPath
		if (!globalStoragePath) {
			throw new Error("Global storage uri is invalid")
		}
		const puppeteerDir = path.join(globalStoragePath, "puppeteer")
		const dirExists = await fileExistsAtPath(puppeteerDir)
		if (!dirExists) {
			await fs.mkdir(puppeteerDir, { recursive: true })
		}
		// if chromium doesn't exist, this will download it to path.join(puppeteerDir, ".chromium-browser-snapshots")
		// if it does exist it will return the path to existing chromium
		const stats: PCRStats = await PCR({
			downloadPath: puppeteerDir,
		})
		return stats
	}

	async launchBrowser(): Promise<void> {
		if (this.browser) {
			return
		}
		const stats = await this.ensureChromiumExists()
		this.browser = await stats.puppeteer.launch({
			args: [
				"--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
			],
			executablePath: stats.executablePath,
		})
		// (latest version of puppeteer does not add headless to user agent)
		this.page = await this.browser?.newPage()
	}

	async closeBrowser(): Promise<void> {
		await this.browser?.close()
		this.browser = undefined
		this.page = undefined
	}

	// Obtém o HTML bruto de uma URL sem processamento
	async fetchRawHTML(url: string): Promise<string> {
		if (!this.browser || !this.page) {
			throw new Error("Browser not initialized")
		}
		/*
		- networkidle2 is equivalent to playwright's networkidle where it waits until there are no more than 2 network connections for at least 500 ms.
		- domcontentloaded is when the basic DOM is loaded
		this should be sufficient for most doc sites
		*/
		await this.page.goto(url, { timeout: 10_000, waitUntil: ["domcontentloaded", "networkidle2"] })
		return this.page.content()
	}

	// Limpa o HTML para remover elementos indesejados
	cleanHTML(html: string): { cleanedHTML: string; $: cheerio.CheerioAPI } {
		// Use cheerio para analisar e limpar o HTML
		const $ = cheerio.load(html)
		$("script, style, nav, footer, header").remove()
		return { cleanedHTML: $.html(), $ }
	}

	// Converte HTML limpo para Markdown
	convertToMarkdown(html: string): string {
		const turndownService = new TurndownService()
		return turndownService.turndown(html)
	}

	// Valida se o Markdown mantém o conteúdo essencial do HTML
	validateConversion(html: string, markdown: string): boolean {
		// Simplificar HTML e Markdown para comparação
		const simplifiedHTML = this.simplifyForComparison(html)
		const simplifiedMarkdown = this.simplifyForComparison(markdown)

		// Verificar se o comprimento do conteúdo está próximo
		// Uma perda de até 30% é aceitável devido à remoção de tags e formatação
		const lengthRatio = simplifiedMarkdown.length / simplifiedHTML.length
		if (lengthRatio < 0.7) {
			console.warn(
				`Possível perda de conteúdo na conversão: Markdown é ${(lengthRatio * 100).toFixed(1)}% do tamanho do HTML`,
			)
			return false
		}

		// Verificar palavras-chave do conteúdo
		// Extrair palavras significativas do HTML (ignorando tags e palavras comuns)
		const htmlWords = this.extractSignificantWords(simplifiedHTML)
		const markdownWords = this.extractSignificantWords(simplifiedMarkdown)

		// Calcular quantas palavras-chave do HTML estão presentes no Markdown
		const keywordsPresent = htmlWords.filter((word) => markdownWords.includes(word))
		const keywordRatio = keywordsPresent.length / htmlWords.length

		// Aceitar se pelo menos 85% das palavras-chave estão presentes
		return keywordRatio >= 0.85
	}

	// Helper para simplificar texto para comparação
	private simplifyForComparison(text: string): string {
		return text
			.replace(/\s+/g, " ") // Normalizar espaços
			.replace(/<[^>]*>/g, "") // Remover tags HTML
			.replace(/[\r\n]+/g, " ") // Remover quebras de linha
			.trim()
			.toLowerCase() // Converter para minúsculas
	}

	// Helper para extrair palavras significativas
	private extractSignificantWords(text: string): string[] {
		// Lista de palavras comuns (stopwords) em português e inglês
		const stopWords = new Set([
			"a",
			"o",
			"e",
			"é",
			"de",
			"do",
			"da",
			"em",
			"no",
			"na",
			"para",
			"por",
			"com",
			"que",
			"se",
			"the",
			"and",
			"is",
			"in",
			"to",
			"of",
			"for",
			"with",
			"on",
			"at",
			"from",
			"by",
			"about",
		])

		// Extrair palavras, remover stopwords e manter apenas palavras com mais de 3 caracteres
		return text.split(/\W+/).filter((word) => word.length > 3 && !stopWords.has(word.toLowerCase()))
	}

	// must make sure to call launchBrowser before and closeBrowser after using this
	async urlToMarkdown(url: string): Promise<string> {
		if (!this.browser || !this.page) {
			throw new Error("Browser not initialized")
		}
		const html = await this.fetchRawHTML(url)
		const { cleanedHTML } = this.cleanHTML(html)
		return this.convertToMarkdown(cleanedHTML)
	}

	// Método que retorna tanto o HTML bruto quanto a versão processada em Markdown
	async fetchContent(
		url: string,
		shouldClean: boolean = true,
	): Promise<{ html: string; markdown?: string; cleaned?: boolean }> {
		const rawHTML = await this.fetchRawHTML(url)

		if (!shouldClean) {
			return { html: rawHTML }
		}

		const { cleanedHTML } = this.cleanHTML(rawHTML)
		const markdown = this.convertToMarkdown(cleanedHTML)

		// Validar se a conversão manteve o conteúdo essencial
		const isValid = this.validateConversion(rawHTML, markdown)

		return {
			html: isValid ? cleanedHTML : rawHTML,
			markdown,
			cleaned: isValid,
		}
	}
}
