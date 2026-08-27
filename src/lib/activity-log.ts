import { db } from "@/db";
import { activityLog } from "@/db/schema";

// Единая точка записи в журнал — вызывается в конце каждого server action
// рядом с основной мутацией. Никакой очереди/шины событий, просто insert.
export async function logActivity(userId: string, action: string, metadata?: Record<string, unknown>) {
  return await db.insert(activityLog).values({ userId, action, metadata });
}
