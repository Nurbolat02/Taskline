import { db } from "@/db";
import { activityLog } from "@/db/schema";

// Single point of writing to the log — called at the end of every server action
// next to the main mutation. No queue/event bus, just an insert.
export async function logActivity(userId: string, action: string, metadata?: Record<string, unknown>) {
  return await db.insert(activityLog).values({ userId, action, metadata });
}
