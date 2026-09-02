import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, tasks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { TaskCreateButton } from "@/features/tasks/task-create-button";
import { TaskFilters } from "@/features/tasks/task-filters";
import { TaskList } from "@/features/tasks/task-list";
import styles from "@/styles/page.module.css";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return;

  const [userTasks, userCategories] = await Promise.all([
    db.query.tasks.findMany({
      where: eq(tasks.userId, user.id),
      with: { category: true },
      orderBy: [desc(tasks.createdAt)],
    }),
    db.query.categories.findMany({
      where: eq(categories.userId, user.id),
      orderBy: [desc(categories.createdAt)],
    }),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Tasks</h1>
        <TaskCreateButton categories={userCategories} />
      </div>
      <TaskFilters categories={userCategories} />
      <TaskList categories={userCategories} tasks={userTasks} />
    </div>
  );
}
