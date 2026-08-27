import styles from "./layout.module.css";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
