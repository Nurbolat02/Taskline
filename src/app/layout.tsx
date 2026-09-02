import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Fullstack — Task Tracker",
  description: "A learning project: Next.js + Drizzle + JWT authentication",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
