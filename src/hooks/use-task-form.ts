"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";
import { createTaskAction, updateTaskAction } from "@/actions/tasks";
import { taskSchema } from "@/schemas/task";
import type { TaskWithCategory } from "@/types";

// <select> always returns a string, so in the form categoryId is a plain
// string ("" means "no category"), and it's converted to the real
// z.uuid().nullable() from taskSchema right before it's sent to the server (onSubmit).
const formSchema = taskSchema.extend({ categoryId: z.string() });
type TaskFormValues = z.infer<typeof formSchema>;

// Encapsulates react-hook-form + the create/update actions for the task form
// — TaskForm stays purely presentational. Whether `task` is set decides which
// action gets called.
export function useTaskForm({ task, onDone }: { task?: TaskWithCategory; onDone?: () => void }) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      status: (task?.status as TaskFormValues["status"]) || "todo",
      categoryId: task?.categoryId || "",
      description: task?.description || "",
      dueDate: task?.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
    },
  });

  const createAction = useAction(createTaskAction, {
    onSuccess: () => {
      toast.success("Task created");
      onDone?.();
    },
    onError: ({ error }) => toast.error(error.serverError || "Failed to create task"),
  });

  const updateAction = useAction(updateTaskAction, {
    onSuccess: () => {
      toast.success("Task updated");
      onDone?.();
    },
    onError: ({ error }) => toast.error(error.serverError || "Failed to update task"),
  });

  const isExecuting = updateAction.isExecuting || createAction.isExecuting;

  function onSubmit(values: TaskFormValues) {
    const payload = { ...values, categoryId: values.categoryId || null };
    if (task) {
      updateAction.execute({ ...payload, id: task.id });
    } else {
      createAction.execute(payload);
    }
  }

  return { form, onSubmit, isExecuting };
}
