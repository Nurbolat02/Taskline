import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

// A Server Component (e.g. MainLayout) can't delete a cookie itself during
// render — Next.js only allows changing cookies in a Server Action or Route
// Handler. So when a session needs to be force-ended from a Server Component,
// the user is sent here: this Route Handler clears the session and cookie,
// then redirects to /login.
export async function GET(request: Request) {
  await destroySession();

  return NextResponse.redirect(new URL("/login", request.url));
}
