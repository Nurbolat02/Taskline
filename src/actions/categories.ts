"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { categorySchema, updateCategorySchema, deleteCategorySchema } from "@/schemas/category";
import { logActivity } from "@/lib/activity-log";

export const createCategoryAction = authActionClient
  .inputSchema(categorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const [category] = await db
      .insert(categories)
      .values({ ...parsedInput, userId: ctx.user.id })
      .returning();
    await logActivity(ctx.user.id, "category.created", { categoryId: category.id, categoryName: category.name });
    revalidatePath("/");
    revalidatePath("/categories");
    return category;
  });

export const updateCategoryAction = authActionClient
  .inputSchema(updateCategorySchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, ...values } = parsedInput;
    const [category] = await db
      .update(categories)
      .set(values)
      .where(and(eq(categories.id, id), eq(categories.userId, ctx.user.id)))
      .returning();
    if (!category) {
      throw new Error("Категория не найдена");
    }
    await logActivity(ctx.user.id, "category.updated", { categoryId: category.id });
    revalidatePath("/categories");
    revalidatePath("/");
    return category;
  });

export const deleteCategoryAction = authActionClient
  .inputSchema(deleteCategorySchema)
  .action(async ({ ctx, parsedInput }) => {
    const [category] = await db
      .delete(categories)
      .where(and(eq(categories.id, parsedInput.id), eq(categories.userId, ctx.user.id)))
      .returning();

    if (!category) {
      throw new Error("Категория не найдена");
    }

    await logActivity(ctx.user.id, "category.deleted", { categoryId: category.id, categoryName: category.name });

    revalidatePath("/categories");
    revalidatePath("/");
  });
