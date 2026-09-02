import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users, type User, type Session } from "@/db/schema";
import { signJwt, verifyJwt } from "./jwt";
import { SESSION_COOKIE_NAME, SESSION_DURATION_MS, JWT_EXPIRES_IN } from "./constants";

// Called from login/register AFTER the password has already been verified.
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

  // JWT_EXPIRES_IN is derived from the same SESSION_DURATION_MS so the token and
  // the DB record never drift apart in how long they stay valid.
  const token = await signJwt({ sub: userId, sessionId: session.id }, JWT_EXPIRES_IN);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true, // client-side JS can't read the cookie — protects against XSS
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
  // The session must be neither revoked nor expired — this is exactly where the
  // "logged out, but the JWT is still technically valid" case gets caught: the
  // token itself doesn't know it was revoked, but the DB does.
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

// Used in server actions where the user is required to be logged in — the
// resulting error is caught by authActionClient.
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const payload = await verifyJwt(token);
    if (payload) {
      // Mark the session revoked rather than deleting the row.
      await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, payload.sessionId));
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
