import type { ActivityLogEntry } from "@/db/schema";
import listStyles from "@/styles/list.module.css";
import styles from "./activity-log-list.module.css";

const ACTION_LABELS: Record<string, string> = {
  "auth.register": "Registered",
  "auth.login": "Logged in",
  "auth.logout": "Logged out",
  "auth.session_revoked": "Session manually ended",
  "task.created": "Task created",
  "task.updated": "Task updated",
  "task.status_changed": "Task status changed",
  "task.deleted": "Task deleted",
  "category.created": "Category created",
  "category.updated": "Category updated",
  "category.deleted": "Category deleted",
};

// Purely presentational, no interactivity — doesn't need "use client" and
// renders on the server along with the page.
export function ActivityLogList({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return <p className={listStyles.empty}>No activity yet</p>;
  }

  return (
    <ul className={listStyles.list}>
      {entries.map((entry) => (
        <li key={entry.id} className={`${listStyles.row} ${styles.row}`}>
          <span>{ACTION_LABELS[entry.action] || entry.action}</span>
          <span className={styles.meta}>{new Date(entry.createdAt).toLocaleString("en-US")}</span>
        </li>
      ))}
    </ul>
  );
}
