"use client";

import { useTaskForm } from "@/hooks/use-task-form";
import { TASK_STATUSES, TASK_STATUS_LABELS } from "@/schemas/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import type { Category } from "@/db/schema";
import type { TaskWithCategory } from "@/types";
import formStyles from "@/styles/form.module.css";

// Одна форма на создание и редактирование: наличие `task` решает, какой
// action вызвать (см. useTaskForm).
export function TaskForm({
  task,
  categories,
  onDone,
}: {
  task?: TaskWithCategory;
  categories: Category[];
  onDone?: () => void;
}) {
  const { form, onSubmit, isExecuting } = useTaskForm({ task, onDone });

  return (
    <form className={formStyles.form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className={formStyles.field}>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} />
        {form.formState.errors.title && <p className={formStyles.errorText}>{form.formState.errors.title.message}</p>}
      </div>
      <div className={formStyles.field}>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...form.register("description")} />
        {form.formState.errors.description && (
          <p className={formStyles.errorText}>{form.formState.errors.description.message}</p>
        )}
      </div>
      <div className={formStyles.grid2}>
        <div className={formStyles.field}>
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...form.register("status")}>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>
        <div className={formStyles.field}>
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" {...form.register("categoryId")}>
            <option value="">Без категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className={formStyles.field}>
        <Label htmlFor="dueDate">Due date</Label>
        <Input id="dueDate" type="date" {...form.register("dueDate")} />
      </div>
      <Button type="submit" disabled={isExecuting} className={formStyles.selfEnd}>
        {task ? "Сохранить" : "Создать задачу"}
      </Button>
    </form>
  );
}
