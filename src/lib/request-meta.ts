import { headers } from "next/headers";

// Server actions don't have direct access to the request object, but headers()
// reads the current request's headers from anywhere on the server (like cookies())
// — that's enough to store user-agent/IP in the sessions table for the session
// list and activity log.
export async function getRequestMeta(): Promise<{ userAgent: string | null; ipAddress: string | null }> {
  const headersList = await headers();
  return {
    userAgent: headersList.get("user-agent"),
    // x-forwarded-for can be a chain like "ip1, ip2, ip3" if the request passed
    // through several proxies — take the first IP (the real client).
    ipAddress: headersList.get("x-forwarded-for")?.split(",")[0].trim() || null,
  };
}
