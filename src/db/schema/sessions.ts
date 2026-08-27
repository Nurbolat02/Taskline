import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// JWT нельзя отозвать сам по себе (валиден до истечения exp), поэтому каждой выданной
// JWT-сессии соответствует строка здесь — logout проставляет revokedAt, и getCurrentUser()
// перестаёт считать такой токен валидным, даже если подпись всё ещё корректна.
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
