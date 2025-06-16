import { relations } from "drizzle-orm/relations"
import { taskMetrics, runs, tasks } from "./schema"

export const runsRelations = relations(runs, ({ one, many }) => ({
	taskMetric: one(taskMetrics, {
		fields: [runs.taskMetricsId],
		references: [taskMetrics.id],
	}),
	tasks: many(tasks),
}))

export const taskMetricsRelations = relations(taskMetrics, ({ many }) => ({
	runs: many(runs),
	tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
	taskMetric: one(taskMetrics, {
		fields: [tasks.taskMetricsId],
		references: [taskMetrics.id],
	}),
	run: one(runs, {
		fields: [tasks.runId],
		references: [runs.id],
	}),
}))
