import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { CategoryForm } from "@/features/categories/category-form";
import { CategoryList } from "@/features/categories/category-list";
import styles from "@/styles/page.module.css";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) return;

  const userCategories = await db.query.categories.findMany({
    where: eq(categories.userId, user.id),
    orderBy: [desc(categories.createdAt)],
  });

  return (
    <div className={styles.pageMedium}>
      <h1 className={styles.title}>Категории</h1>
      <CategoryForm />
      <CategoryList categories={userCategories} />
    </div>
  );
}
