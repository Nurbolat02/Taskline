"use client";

import { useCategoryForm } from "@/hooks/use-category-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/db/schema";
import formStyles from "@/styles/form.module.css";
import styles from "./category-form.module.css";

// Одна форма на create и на edit: если передан `category`, вызываем
// updateCategoryAction с его id, иначе — createCategoryAction (см. useCategoryForm).
export function CategoryForm({ category, onDone }: { category?: Category; onDone?: () => void }) {
  const { form, onSubmit, isExecuting } = useCategoryForm({ category, onDone });

  return (
    <form className={styles.row} onSubmit={form.handleSubmit(onSubmit)}>
      <div className={formStyles.field}>
        <Label htmlFor="color">Color</Label>
        <Input id="color" type="color" className={styles.colorInput} {...form.register("color")} />
      </div>
      <div className={`${formStyles.field} ${styles.nameField}`}>
        <Label htmlFor="name">Название категории</Label>
        <Input id="name" placeholder="Например: Работа" {...form.register("name")} />
        {form.formState.errors.name && <p className={formStyles.errorText}>{form.formState.errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={isExecuting}>
        {category ? "Сохранить" : "Добавить"}
      </Button>
    </form>
  );
}
