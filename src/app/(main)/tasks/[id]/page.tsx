import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { TASK_STATUS_LABELS, type TaskStatus } from "@/schemas/task";
import { Badge } from "@/components/ui/badge";
import styles from "@/styles/page.module.css";

// Динамический маршрут: /tasks/[id]. В Next.js 15+/16 `params` — это Promise,
// его нужно await-нуть перед использованием.
export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return;

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.userId, user.id), eq(tasks.id, id)),
    with: { category: true },
  });

  if (!task) notFound();

  return (
    <div className={`${styles.page} ${styles.narrow}`}>
      <Link href="/" className={styles.backLink}>
        ← Ко всем задачам
      </Link>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>{task.title}</h1>
        <Badge>{TASK_STATUS_LABELS[task.status as TaskStatus]}</Badge>
        {task.category && (
          <Badge variant="outline" style={{ borderColor: task.category.color, color: task.category.color }}>
            {task.category.name}
          </Badge>
        )}
      </div>
      {task.description && <p className={styles.bodyText}>{task.description}</p>}
      {task.dueDate && (
        <p className={styles.subtitleMuted}>Срок: {new Date(task.dueDate).toLocaleDateString("ru-RU")}</p>
      )}
    </div>
  );
}
