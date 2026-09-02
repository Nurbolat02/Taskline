import z from "zod";

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Maximum 120 characters"),
  description: z.string().max(2000, "Maximum 2000 characters").optional().or(z.literal("")),
  status: z.enum(TASK_STATUSES),
  categoryId: z.uuid().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});
export type TaskInput = z.infer<typeof taskSchema>;

// Extends taskSchema so the task field rules aren't duplicated.
export const updateTaskSchema = taskSchema.extend({ id: z.uuid() });

export const deleteTaskSchema = z.object({
  id: z.uuid(),
});

export const updateTaskStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(TASK_STATUSES),
});
