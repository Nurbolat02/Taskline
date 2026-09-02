import { lt } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema";

// How many days we keep already-expired sessions after expiresAt — for history,
// debugging, and the activity log, not just "live" data.
const RETENTION_DAYS = 30;

async function cleanupExpiredSessions() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const deleted = await db.delete(sessions).where(lt(sessions.expiresAt, cutoff)).returning();
  console.log(`Deleted sessions: ${deleted.length} (expiresAt before ${cutoff.toISOString()})`);
}

cleanupExpiredSessions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
