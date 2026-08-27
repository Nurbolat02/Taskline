import z from "zod";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Нужно сделать",
  in_progress: "В процессе",
  done: "Готово",
};

export const taskSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(120, "Максимум 120 символов"),
  description: z.string().max(2000, "Максимум 2000 символов").optional().or(z.literal("")),
  status: z.enum(TASK_STATUSES),
  categoryId: z.uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});
export type TaskInput = z.infer<typeof taskSchema>;

// Расширяет taskSchema, чтобы не дублировать правила полей задачи.
export const updateTaskSchema = taskSchema.extend({ id: z.uuid() });

export const deleteTaskSchema = z.object({
  id: z.uuid(),
});

export const updateTaskStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(TASK_STATUSES),
});
