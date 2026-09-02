"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/actions/categories";

// Encapsulates the edit/delete dialog state and the category delete mutation
// — CategoryRow stays purely presentational.
export function useCategoryRowActions(categoryId: string) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteAction = useAction(deleteCategoryAction, {
    onSuccess: () => {
      toast.success("Category deleted");
      setDeleteOpen(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to delete category");
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
