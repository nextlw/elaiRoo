// Declaração de tipo para o módulo csv-parse/sync
declare module "csv-parse/sync" {
	// Tenta importar Options do módulo principal 'csv-parse'
	// Isso assume que os tipos do 'csv-parse' principal são encontráveis.
	import { Options as CsvParseOptions } from "csv-parse"

	export interface Options extends CsvParseOptions {}

	export function parse(input: string | Buffer, options?: Options): any[]
	// Você pode adicionar outras sobrecargas ou tipos específicos para a versão sync se necessário.
}
