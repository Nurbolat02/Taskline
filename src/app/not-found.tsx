import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import styles from "./not-found.module.css";

// Next.js renders the nearest not-found.tsx up the tree — both for
// non-existent URLs and when code explicitly calls notFound() (see tasks/[id]/page.tsx).
export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.message}>Page not found</p>
      <Link href="/" className={buttonClassName("default", "default", styles.link)}>
        Go home
      </Link>
    </div>
  );
}
