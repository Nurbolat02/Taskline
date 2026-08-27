import type { ActivityLogEntry } from "@/db/schema";
import listStyles from "@/styles/list.module.css";
import styles from "./activity-log-list.module.css";

const ACTION_LABELS: Record<string, string> = {
  "auth.register": "Регистрация",
  "auth.login": "Вход",
  "auth.logout": "Выход",
  "auth.session_revoked": "Сессия завершена вручную",
  "task.created": "Задача создана",
  "task.updated": "Задача обновлена",
  "task.status_changed": "Статус задачи изменён",
  "task.deleted": "Задача удалена",
  "category.created": "Категория создана",
  "category.updated": "Категория обновлена",
  "category.deleted": "Категория удалена",
};

// Чисто презентационный компонент без интерактивности — не нуждается
// в "use client" и рендерится на сервере вместе со страницей.
export function ActivityLogList({ entries }: { entries: ActivityLogEntry[] }) {
  if (entries.length === 0) {
    return <p className={listStyles.empty}>Пока нет ни одного действия</p>;
  }

  return (
    <ul className={listStyles.list}>
      {entries.map((entry) => (
        <li key={entry.id} className={`${listStyles.row} ${styles.row}`}>
          <span>{ACTION_LABELS[entry.action] || entry.action}</span>
          <span className={styles.meta}>{new Date(entry.createdAt).toLocaleString("ru-RU")}</span>
        </li>
      ))}
    </ul>
  );
}
