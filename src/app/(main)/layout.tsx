import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import styles from "./layout.module.css";
import { ReactNode } from "react";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/api/auth/clear-session");

  return (
    <div className={styles.shell}>
      <Navbar user={user} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
