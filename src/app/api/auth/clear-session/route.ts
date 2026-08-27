import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

// Server Component (например MainLayout) не может сам удалить cookie во время рендера —
// Next.js разрешает менять cookie только в Server Action или Route Handler. Поэтому когда
// нужно принудительно завершить сессию из Server Component, отправляем пользователя сюда:
// этот Route Handler удаляет сессию и cookie, затем перенаправляет на /login.
export async function GET(request: Request) {
  await destroySession();

  return NextResponse.redirect(new URL("/login", request.url));
}
