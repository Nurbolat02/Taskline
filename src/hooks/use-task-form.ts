"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { z } from "zod";
import { createTaskAction, updateTaskAction } from "@/actions/tasks";
import { taskSchema } from "@/schemas/task";
import type { TaskWithCategory } from "@/types";

// <select> всегда отдаёт строку, поэтому в форме categoryId — обычная строка
// ("" значит "без категории"), а в настоящий z.uuid().nullable() из taskSchema
// превращаем прямо перед отправкой на сервер (onSubmit).
const formSchema = taskSchema.extend({ categoryId: z.string() });
type TaskFormValues = z.infer<typeof formSchema>;

// Инкапсулирует react-hook-form + create/update actions для формы задачи —
// TaskForm остаётся чисто презентационным. Наличие `task` решает, какой action вызвать.
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
      toast.success("Задача создана");
      onDone?.();
    },
    onError: ({ error }) => toast.error(error.serverError || "Не удалось создать задачу"),
  });

  const updateAction = useAction(updateTaskAction, {
    onSuccess: () => {
      toast.success("Задача обновлена");
      onDone?.();
    },
    onError: ({ error }) => toast.error(error.serverError || "Не удалось обновить задачу"),
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
