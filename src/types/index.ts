import type { Task, Category } from "@/db/schema";

// Задача с подгруженной категорией (или null, если категория не выбрана
// или была удалена) — то, что реально возвращает наш запрос со джойном.
export type TaskWithCategory = Task & { category: Category | null };
