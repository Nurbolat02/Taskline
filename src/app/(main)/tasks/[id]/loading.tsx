import { Skeleton } from "@/components/ui/skeleton";
import styles from "./loading.module.css";

export default function TaskDetailLoading() {
  return (
    <div className={styles.wrap}>
      <Skeleton className={styles.back} />
      <Skeleton className={styles.title} />
      <Skeleton className={styles.body} />
    </div>
  );
}
