import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

// middleware работает в Edge Runtime — нет доступа к Postgres, поэтому проверка тут
// ОПТИМИСТИЧНАЯ: только подпись и срок действия JWT. Настоящую проверку (не отозвана
// ли сессия в БД) делает getCurrentUser() в layout.tsx — там уже Node-окружение.
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

// Ко всем путям, КРОМЕ статики Next.js (_next/static, _next/image) и favicon.ico —
// их незачем прогонять через проверку авторизации.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
