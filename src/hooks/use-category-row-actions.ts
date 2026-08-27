"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/actions/categories";

// Инкапсулирует состояние диалогов редактирования/удаления и удаление
// категории — CategoryRow остаётся чисто презентационным.
export function useCategoryRowActions(categoryId: string) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteAction = useAction(deleteCategoryAction, {
    onSuccess: () => {
      toast.success("Категория удалена");
      setDeleteOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Не удалось удалить категорию");
    },
  });

  return {
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    isDeleting: deleteAction.isExecuting,
    confirmDelete: () => deleteAction.execute({ id: categoryId }),
  };
}
