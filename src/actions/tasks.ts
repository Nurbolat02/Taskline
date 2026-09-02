"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { authActionClient } from "@/lib/safe-action";
import { taskSchema, updateTaskSchema, deleteTaskSchema, updateTaskStatusSchema } from "@/schemas/task";
import { logActivity } from "@/lib/activity-log";

export const createTaskAction = authActionClient.inputSchema(taskSchema).action(async ({ parsedInput, ctx }) => {
  const [task] = await db
    .insert(tasks)
    .values({
      title: parsedInput.title,
      description: parsedInput.description || null,
      status: parsedInput.status,
      categoryId: parsedInput.categoryId || null,
      dueDate: parsedInput.dueDate ? new Date(parsedInput.dueDate) : null,
      userId: ctx.user.id,
    })
    .returning();

  await logActivity(ctx.user.id, "task.created", {
    taskId: task.id,
    taskTitle: task.title,
  });
  revalidatePath("/");
  return task;
});

export const updateTaskAction = authActionClient.inputSchema(updateTaskSchema).action(async ({ parsedInput, ctx }) => {
  const { id, ...values } = parsedInput;
  const [task] = await db
    .update(tasks)
    .set({
      title: values.title,
      description: values.description || null,
      status: values.status,
      categoryId: values.categoryId || null,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, ctx.user.id)))
    .returning();
  if (!task) throw new Error("Task not found");

  await logActivity(ctx.user.id, "task.updated", { taskId: id });
  revalidatePath("/");
  revalidatePath(`/tasks/${id}`);
  return task;
});

// Separate lightweight action just for changing status — used in the select
// right on the task card, so we don't have to submit the whole form for one field.
export const updateTaskStatusAction = authActionClient
  .inputSchema(updateTaskStatusSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [task] = await db
      .update(tasks)
      .set({
        status: parsedInput.status,
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, parsedInput.id), eq(tasks.userId, ctx.user.id)))
      .returning();
    if (!task) {
      throw new Error("Task not found");
    }

    await logActivity(ctx.user.id, "task.status_changed", {
      taskId: task.id,
      taskStatus: task.status,
    });

    revalidatePath("/");
    revalidatePath(`/tasks/${task.id}`);
    return task;
  });

export const deleteTaskAction = authActionClient.inputSchema(deleteTaskSchema).action(async ({ parsedInput, ctx }) => {
  const [task] = await db
    .delete(tasks)
    .where(and(eq(tasks.userId, ctx.user.id), eq(tasks.id, parsedInput.id)))
    .returning();
  if (!task) {
    throw new Error("Task not found");
  }
  await logActivity(ctx.user.id, "task.deleted", {
    taskId: parsedInput.id,
    taskTitle: task.title,
  });
  revalidatePath("/");
  return task;
});
