"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { revokeSessionAction } from "@/actions/sessions";

export function useSessionRevoke(sessionId: string) {
  const revoke = useAction(revokeSessionAction, {
    onError: ({ error }) => toast.error(error.serverError || "Failed to end session"),
    onSuccess: () => toast.success("Session ended"),
  });

  return {
    isRevoking: revoke.isExecuting,
    revokeSession: () => revoke.execute({ id: sessionId }),
  };
}
