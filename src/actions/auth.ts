"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { actionClient, authActionClient } from "@/lib/safe-action";
import { registerSchema, loginSchema } from "@/schemas/auth";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, destroySession } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity-log";
import { getRequestMeta } from "@/lib/request-meta";

// registerAction and loginAction use actionClient, not authActionClient — the
// user isn't logged in yet, these actions must be reachable without auth.
export const registerAction = actionClient.inputSchema(registerSchema).action(async ({ parsedInput }) => {
  const { name, email, password } = parsedInput;
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    throw new Error("A user with this email already exists");
  }
  const passwordHash = await hashPassword(password);
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
    })
    .returning();

  const meta = await getRequestMeta();
  await createSession(user.id, meta);
  await logActivity(user.id, "auth.register", meta);
  redirect("/");
});

export const loginAction = actionClient.inputSchema(loginSchema).action(async ({ parsedInput }) => {
  const { email, password } = parsedInput;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }
  const meta = await getRequestMeta();
  await createSession(user.id, meta);
  await logActivity(user.id, "auth.login", meta);
  redirect("/");
});

// authActionClient — logoutAction requires a logged-in user, ctx.user is already set.
// No input, so .inputSchema() isn't needed.
export const logoutAction = authActionClient.action(async ({ ctx }) => {
  await logActivity(ctx.user.id, "auth.logout");
  await destroySession();
  redirect("/login");
});
