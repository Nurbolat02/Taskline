import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import styles from "./not-found.module.css";

// Next.js рендерит ближайший not-found.tsx вверх по дереву — как для
// несуществующих URL, так и когда код явно вызывает notFound() (см. tasks/[id]/page.tsx).
export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Страница не найдена</p>
      <Link href="/" className={buttonClassName("default", "default", styles.link)}>
        На главную
      </Link>
    </div>
  );
}
