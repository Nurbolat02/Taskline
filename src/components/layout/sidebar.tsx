"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import styles from "./sidebar.module.css";

const links = [
  { href: "/", label: "Tasks" },
  { href: "/categories", label: "Categories" },
  { href: "/settings/activity", label: "Activity" },
];

// isSidebarOpen from zustand controls visibility on mobile screens — on
// desktop the sidebar is always visible.
export function Sidebar() {
  const pathname = usePathname();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);

  return (
    <>
      {isSidebarOpen && <div className={styles.backdrop} onClick={closeSidebar} />}
      <aside className={cn(styles.sidebar, isSidebarOpen ? styles.open : styles.closed)}>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeSidebar}
              className={cn(styles.link, pathname === link.href ? styles.active : undefined)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
