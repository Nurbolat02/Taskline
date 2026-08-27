import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// Журнал действий пользователя — при каждом важном событии (создал задачу,
// вошёл в аккаунт и т.п.) сюда добавляется запись.
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, { fields: [activityLog.userId], references: [users.id] }),
}));

export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;
