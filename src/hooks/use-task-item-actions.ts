"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteTaskAction, updateTaskStatusAction } from "@/actions/tasks";
import type { TaskStatus } from "@/schemas/task";

// Encapsulates the edit/delete dialog state and both task-card mutations
// (status change, delete) — TaskItem stays purely presentational.
export function useTaskItemActions(taskId: string) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const statusAction = useAction(updateTaskStatusAction, {
    onError: ({ error }) => toast.error(error.serverError || "Failed to update status"),
  });

  const deleteAction = useAction(deleteTaskAction, {
    onSuccess: () => {
      toast.success("Task deleted");
      setDeleteOpen(false);
    },
    onError: ({ error }) => toast.error(error.serverError || "Failed to delete task"),
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
