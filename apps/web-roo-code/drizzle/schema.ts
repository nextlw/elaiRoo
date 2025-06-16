import {
	sqliteTable,
	AnySQLiteColumn,
	foreignKey,
	integer,
	text,
	blob,
	real,
	uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const runs = sqliteTable("runs", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	taskMetricsId: integer().references(() => taskMetrics.id),
	model: text().notNull(),
	description: text(),
	settings: blob(),
	pid: integer(),
	socketPath: text().notNull(),
	passed: integer().default(0).notNull(),
	failed: integer().default(0).notNull(),
	createdAt: integer().notNull(),
})

export const taskMetrics = sqliteTable("taskMetrics", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	tokensIn: integer().notNull(),
	tokensOut: integer().notNull(),
	tokensContext: integer().notNull(),
	cacheWrites: integer().notNull(),
	cacheReads: integer().notNull(),
	cost: real().notNull(),
	duration: integer().notNull(),
	createdAt: integer().notNull(),
})

export const tasks = sqliteTable(
	"tasks",
	{
		id: integer().primaryKey({ autoIncrement: true }).notNull(),
		runId: integer()
			.notNull()
			.references(() => runs.id),
		taskMetricsId: integer().references(() => taskMetrics.id),
		language: text().notNull(),
		exercise: text().notNull(),
		passed: integer(),
		startedAt: integer(),
		finishedAt: integer(),
		createdAt: integer().notNull(),
	},
	(table) => [uniqueIndex("tasks_language_exercise_idx").on(table.runId, table.language, table.exercise)],
)
