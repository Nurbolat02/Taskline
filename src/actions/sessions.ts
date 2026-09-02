"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { logActivity } from "@/lib/activity-log";

const revokeSessionSchema = z.object({ id: z.uuid() });

// Doesn't delete the session physically, just sets revokedAt to now.
export const revokeSessionAction = authActionClient
  .inputSchema(revokeSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [session] = await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.id, parsedInput.id), eq(sessions.userId, ctx.user.id)))
      .returning();

    if (!session) {
      throw new Error("Session not found");
    }

    await logActivity(ctx.user.id, "auth.session_revoked", {
      sessionId: session.id,
    });

    revalidatePath("/settings/activity");
  });
