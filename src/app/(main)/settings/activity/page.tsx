import { cookies } from "next/headers";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activityLog, sessions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { verifyJwt } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { SessionList } from "@/features/settings/session-list";
import { ActivityLogList } from "@/features/settings/activity-log-list";
import styles from "@/styles/page.module.css";

// Страница-знакомство с Session/Activity log: список активных JWT-сессий
// (с возможностью отозвать конкретную) и журнал последних действий пользователя.
export default async function ActivityPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifyJwt(token) : null;

  const [userSessions, entries] = await Promise.all([
    db.query.sessions.findMany({
      where: eq(sessions.userId, user.id),
      orderBy: [desc(sessions.createdAt)],
    }),
    db.query.activityLog.findMany({
      where: eq(activityLog.userId, user.id),
      orderBy: [desc(activityLog.createdAt)],
      limit: 50,
    }),
  ]);

  return (
    <div className={styles.pageWide}>
      <div className={styles.section}>
        <h1 className={styles.title}>Активные сессии</h1>
        <SessionList sessions={userSessions} currentSessionId={payload?.sessionId ?? null} />
      </div>
      <div className={styles.section}>
        <h2 className={styles.subtitle}>Журнал действий</h2>
        <ActivityLogList entries={entries} />
      </div>
    </div>
  );
}
