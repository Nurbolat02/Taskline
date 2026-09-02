import { Skeleton } from "@/components/ui/skeleton";
import styles from "./loading.module.css";

// Shown automatically while the "/" page's Server Component waits for the DB
// (db.query.tasks.findMany, etc.) — nothing needs to be triggered manually.
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
