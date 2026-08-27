import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User, type Session } from "@/db/schema";
import { signJwt, verifyJwt } from "./jwt";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS, JWT_EXPIRES_IN } from "./constants";

// Вызывается из login/register ПОСЛЕ того, как пароль уже проверен.
export async function createSession(
  userId: string,
  meta: { userAgent?: string | null; ipAddress?: string | null },
): Promise<Session> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const [session] = await db
    .insert(sessions)
    .values({
      userId: userId,
      expiresAt: expiresAt,
      userAgent: meta.userAgent || null,
      ipAddress: meta.ipAddress || null,
    })
    .returning();

  // Срок жизни JWT (JWT_EXPIRES_IN) выведен из той же SESSION_DURATION_MS, чтобы
  // токен и запись в БД не расходились по времени.
  const token = await signJwt({ sub: userId, sessionId: session.id }, JWT_EXPIRES_IN);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // JS на странице не может прочитать cookie — защита от XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return session;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  const payload = await verifyJwt(token);
  if (!payload) {
    return null;
  }
  // Сессия должна быть не отозвана И не истекла — именно тут ловится случай
  // "разлогинился, но JWT физически ещё валиден": сам токен не знает об отзыве,
  // а в БД это уже отмечено.
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, payload.sessionId), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date())));

  if (!session) {
    return null;
  }
  const [user] = await db.select().from(users).where(eq(users.id, payload.sub));

  return user || null;
}

// Используется в server actions, где пользователь обязан быть залогинен —
// ошибку дальше ловит authActionClient.
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Не авторизован");
  }
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const payload = await verifyJwt(token);
    if (payload) {
      // Помечаем сессию отозванной, а не удаляем строку.
      await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, payload.sessionId));
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
