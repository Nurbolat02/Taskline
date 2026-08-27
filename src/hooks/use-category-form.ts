"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createCategoryAction, updateCategoryAction } from "@/actions/categories";
import { categorySchema, type CategoryInput } from "@/schemas/category";
import type { Category } from "@/db/schema";

const DEFAULT_COLOR = "#64748b";

// Инкапсулирует react-hook-form + create/update actions для формы категории —
// CategoryForm остаётся чисто презентационным. Наличие `category` решает,
// какой action вызвать.
export function useCategoryForm({ category, onDone }: { category?: Category; onDone?: () => void }) {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      color: category?.color ?? DEFAULT_COLOR,
    },
  });

  const createAction = useAction(createCategoryAction, {
    onSuccess: () => {
      toast.success("Категория создана");
      form.reset({ name: "", color: DEFAULT_COLOR });
      onDone?.();
    },
    onError: ({ error }) => toast.error(error.serverError || "Не удалось создать категорию"),
  });

  const updateAction = useAction(updateCategoryAction, {
    onSuccess: () => {
      toast.success("Категория обновлена");
      onDone?.();
    },
    onError: ({ error }) => toast.error(error.serverError || "Не удалось обновить категорию"),
  });

  const isExecuting = updateAction.isExecuting || createAction.isExecuting;

  function onSubmit(values: CategoryInput) {
    if (category) {
      updateAction.execute({ ...values, id: category.id });
    } else {
      createAction.execute(values);
    }
  }

  return { form, onSubmit, isExecuting };
}
