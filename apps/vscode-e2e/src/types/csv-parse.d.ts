/* eslint-disable @typescript-eslint/no-explicit-any */
// Declaração de tipo para o módulo csv-parse
declare module "csv-parse" {
	export interface Options {
		delimiter?: string | string[] | boolean
		quote?: string | boolean | null | undefined
		escape?: string | boolean | undefined
		columns?: boolean | string[] | ((record: any) => any) | undefined
		comment?: string | boolean | null | undefined
		skip_empty_lines?: boolean | "greedy" | undefined
		trim?: boolean | undefined
		ltrim?: boolean | undefined
		rtrim?: boolean | undefined
		encoding?: string | undefined
		relax_column_count?: boolean | undefined
		relax_quotes?: boolean | undefined
		skip_lines_with_error?: boolean | undefined
		skip_records_with_error?: boolean | undefined
		skip_empty_columns?: boolean | undefined
		skip_records_with_empty_values?: boolean | undefined
		skip_lines_with_empty_values?: boolean | undefined
	}

	export interface ParseResult<T> extends Array<T> {
		data: T[]
		errors: Array<{
			type: string
			code: string
			message: string
			row: number
			index: number
		}>
		meta: {
			delimiter: string
			linebreak: string
			aborted: boolean
			truncated: boolean
			cursor: number
			fields?: string[] | undefined
		}
	}

	export function parse<T = any>(
		input: string | Buffer,
		options?: Options & { to_line?: number | undefined; max_record_size?: number | undefined },
		callback?: (err: Error | undefined, records: T[] | undefined, info: any) => void,
	): Promise<ParseResult<T>>

	export function parse<T = any>(
		input: string | Buffer,
		callback?: (err: Error | undefined, records: T[] | undefined, info: any) => void,
	): Promise<ParseResult<T>>

	export function parse<T = any>(
		input: string | Buffer,
		options?: Options,
		callback?: (err: Error | undefined, records: T[] | undefined, info: any) => void,
	): ParseResult<T>

	export function parse<T = any>(
		input: string | Buffer,
		callback?: (err: Error | undefined, records: T[] | undefined, info: any) => void,
	): ParseResult<T>

	export const Parser: {
		new (options?: Options): {
			parse(input: string | Buffer): ParseResult<any>
			on(event: "readable", listener: () => void): void
			on(event: "data", listener: (data: any) => void): void
			on(event: "error", listener: (err: Error) => void): void
			on(event: "end", listener: () => void): void
			on(event: string, listener: (...args: any[]) => void): void
			write(chunk: any, encoding?: string, callback?: (error: Error | null | undefined) => void): boolean
			end(callback?: () => void): void
			end(chunk: any, callback?: () => void): void
			end(chunk: any, encoding: string, callback?: () => void): void
		}
	}

	export default parse
}
