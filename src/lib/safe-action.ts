import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "@/lib/auth/session";

// Base client for all server actions: handleServerError decides what text to
// show on the client instead of a bare "Internal Server Error" with a stack trace.
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error(error);
    return error.message || "Something went wrong, please try again";
  },
});

// Same as actionClient, but with middleware that runs before the body of any
// action built on authActionClient: fetches the current user and puts it in
// ctx.user, or throws "Not authenticated" (caught by handleServerError above).
export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }
  return next({ ctx: { user } });
});
