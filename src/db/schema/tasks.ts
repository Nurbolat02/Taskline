import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { categories } from "./categories";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  // Если категорию удалят — задача останется, просто без категории (set null, не cascade).
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  // Хранится обычным текстом, а не через pgEnum — список статусов ("todo" | "in_progress" | "done") живёт в схеме валидации.
  status: text("status").notNull().default("todo"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  category: one(categories, { fields: [tasks.categoryId], references: [categories.id] }),
}));

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
