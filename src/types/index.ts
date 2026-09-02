import type { Task, Category } from "@/db/schema";

// A task with its category loaded (or null if no category is set or it was
// deleted) — this is what our join query actually returns.
export type TaskWithCategory = Task & { category: Category | null };
