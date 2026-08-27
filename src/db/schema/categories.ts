import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { tasks } from "./tasks";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  // Если пользователя удалят — все его категории удалятся вместе с ним.
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#64748b"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categoryRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  tasks: many(tasks),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
