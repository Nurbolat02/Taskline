import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// middleware runs in the Edge Runtime — no access to Postgres, so the check here
// is OPTIMISTIC: only the JWT signature and expiry. The real check (is the
// session revoked in the DB) happens in getCurrentUser() in layout.tsx, which
// already runs in the Node environment.
const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  if (PUBLIC_FILE.test(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifyJwt(token) : null;
  const isAuthenticated = payload !== null;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// All paths EXCEPT Next.js static assets (_next/static, _next/image) and
// favicon.ico — no point running those through the auth check.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
