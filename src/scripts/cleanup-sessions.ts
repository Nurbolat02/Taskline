import { lt } from "drizzle-orm";
import { db } from "@/db";
import { sessions } from "@/db/schema";

// Сколько дней храним уже истёкшие сессии после expiresAt — для истории,
// отладки и activity log, а не только "живые" данные.
const RETENTION_DAYS = 30;

async function cleanupExpiredSessions() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const deleted = await db.delete(sessions).where(lt(sessions.expiresAt, cutoff)).returning();
  console.log(`Удалено сессий: ${deleted.length} (expiresAt раньше ${cutoff.toISOString()})`);
}

cleanupExpiredSessions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
