"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { LogOut, Menu } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { getInitials } from "@/lib/format";
import type { User } from "@/db/schema";
import styles from "./navbar.module.css";

export function Navbar({ user }: { user: User }) {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const logout = useAction(logoutAction);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Closes the menu on a click outside it or on Escape.
  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event?.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <Button variant="ghost" size="icon" className={styles.menuButton} onClick={toggleSidebar} aria-label="Menu">
          <Menu size={16} />
        </Button>
        <Link className={styles.logo} href="/">
          Task Tracker
        </Link>
      </div>
      <div ref={menuRef} className={styles.userMenu}>
        <Button variant="ghost" className={styles.userButton} onClick={() => setMenuOpen((prev) => !prev)}>
          <span className={styles.avatar}>{getInitials(user.name)}</span>
          {user.name}
        </Button>
        {menuOpen && (
          <div className={styles.menu}>
            <div className={styles.menuLabel}>{user.email}</div>
            <div className={styles.menuSeparator} />
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => {
                setMenuOpen(false);
                logout.execute();
              }}
            >
              <LogOut size={16} className={styles.logoutIcon} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
