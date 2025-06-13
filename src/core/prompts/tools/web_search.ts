import { ToolArgs } from "./types"

export function getWebSearchDescription(args: ToolArgs): string {
	// args.t can be used for i18n in the future, e.g. args.t('toolDescriptions.web_search.description')
	return `## web_search
Realiza uma busca na web usando um motor de busca. Retorna uma lista de resultados, cada um contendo título, link e um breve snippet. Pode usar APIs de busca específicas (como Jina, Serper, Brave) se configuradas pelo usuário e se a lógica da ferramenta suportar, ou recorrer a uma busca genérica em motores como DuckDuckGo/Google.

Parameters:
- query: (required): The search term or question to be used in the search engine API (ex: "Qual a capital da França?") ${args.cwd}.
- engine?: (optional): The preferred search engine (ex: "google", "duckduckgo", "brave", "jina", "serper"). If omitted or not configured/supported by the tool, a fallback (DuckDuckGo) will be used.
- num_results?: (optional, default: 5, according to the tool's logic): The maximum number of results to be returned.

Usage:
<web_search>
  <query>Qual a capital da França?</query>
  <engine>jina</engine>
  <num_results>3</num_results>
</web_search>

Guidelines for the model's behavior mode when using web_search:
- Depth and Exhaustiveness: Conduct deep searches, exploring all nuances.
- Logical Reasoning: In case of doubt, seek references for similar problems and use logical reasoning to solve them.
- Do Not Give Up: NEVER say you don't know the answer or can't respond. In case of an impasse, review accumulated knowledge, reformulate the search strategy, and try new approaches.
- Practical Examples: ALWAYS provide practical examples of how the information can be used.
- If prevented from visiting a page by some method, try again with another strategy. In case of failures, research how to solve the specific access problem without compromising the quality of the main response ${args.cwd}.
- Whenever possible, try to seek updated information by validating the publication date against the current date.
- When appropriate, i.e., when information is available via an API that does not require credentials, search for the API documentation, construct an HTTP request with the necessary parameters in a sandbox, and obtain the response. Treat the response as a web page response and get the main content as markdown.
- In cases where credentials are required, ask the user for the credentials, construct an HTTP request with the necessary parameters in a sandbox, and obtain the response. Treat the response as a web page response and get the main content as markdown.
- Whenever a user login is required, ask if they can log in so you can continue your search, obtain the authorization token by opening the address in a browser, wait for them to confirm they have logged in, obtain the authorization token, and use it to make the HTTP request or access the content via browser_action.
- In cases where attempts to obtain content have been frustrated up to the limit of attempts, try again with another strategy. One of them is to download the content via browser_action and then analyze it as a file with the extract_page_content or read_file tool.
`
}
