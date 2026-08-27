"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteTaskAction, updateTaskStatusAction } from "@/actions/tasks";
import type { TaskStatus } from "@/schemas/task";

// Инкапсулирует состояние диалогов редактирования/удаления и обе мутации карточки
// задачи (смена статуса, удаление) — TaskItem остаётся чисто презентационным.
export function useTaskItemActions(taskId: string) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const statusAction = useAction(updateTaskStatusAction, {
    onError: ({ error }) => toast.error(error.serverError || "Не удалось изменить статус"),
  });

  const deleteAction = useAction(deleteTaskAction, {
    onSuccess: () => {
      toast.success("Задача удалена");
      setDeleteOpen(false);
    },
    onError: ({ error }) => toast.error(error.serverError || "Не удалось удалить задачу"),
  });

  return {
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting: deleteAction.isExecuting,
    changeStatus: (status: TaskStatus) => statusAction.execute({ id: taskId, status }),
    confirmDelete: () => deleteAction.execute({ id: taskId }),
  };
}
