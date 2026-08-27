import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Fullstack — Task Tracker",
  description: "Учебный проект: Next.js + Drizzle + JWT-авторизация",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
