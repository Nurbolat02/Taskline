import { Skeleton } from "@/components/ui/skeleton";
import styles from "./loading.module.css";

// Показывается автоматически, пока Server Component страницы "/" ждёт
// ответа от БД (db.query.tasks.findMany и т.д.) — ничего вручную вызывать не нужно.
export default function DashboardLoading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.headerRow}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.action} />
      </div>
      <Skeleton className={styles.search} />
      <Skeleton className={styles.row} />
      <Skeleton className={styles.row} />
      <Skeleton className={styles.row} />
    </div>
  );
}
