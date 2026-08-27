"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import styles from "./sidebar.module.css";

const links = [
  { href: "/", label: "Задачи" },
  { href: "/categories", label: "Категории" },
  { href: "/settings/activity", label: "Активность" },
];

// isSidebarOpen из zustand управляет видимостью на мобильных экранах —
// на десктопе сайдбар всегда виден.
export function Sidebar() {
  const pathname = usePathname();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  return (
    <aside className={cn(styles.sidebar, isSidebarOpen ? styles.open : styles.closed)}>
      <nav className={styles.nav}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(styles.link, pathname === link.href ? styles.active : undefined)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
