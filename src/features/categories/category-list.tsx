"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useCategoryRowActions } from "@/hooks/use-category-row-actions";
import { CategoryForm } from "./category-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Category } from "@/db/schema";
import styles from "./category-list.module.css";

export function CategoryList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) {
    return <p className={styles.empty}>Пока нет ни одной категории</p>;
  }

  return (
    <ul className={styles.list}>
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </ul>
  );
}

function CategoryRow({ category }: { category: Category }) {
  const { editOpen, setEditOpen, deleteOpen, setDeleteOpen, isDeleting, confirmDelete } = useCategoryRowActions(
    category.id,
  );

  return (
    <li className={styles.row}>
      <div className={styles.info}>
        <span className={styles.dot} style={{ backgroundColor: category.color }}></span>
        <span className={styles.name}>{category.name}</span>
      </div>
      <div className={styles.action}>
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="редактировать">
          <Pencil size={16} />
        </Button>
        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogHeader>
            <DialogTitle> Редактировать категорию</DialogTitle>
          </DialogHeader>
          <CategoryForm category={category} onDone={() => setEditOpen(false)} />
        </Dialog>
        <Button variant="ghost" size="icon" aria-label="удалить" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={16} />
        </Button>
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Удалить категорию {category.name}?</DialogTitle>
          </DialogHeader>
          <p className={styles.footerText}>Задачи из этой категории не удалятся, просто останутся без категории</p>
          <DialogFooter>
            <Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>
              Удалить
            </Button>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Отмена
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </li>
  );
}
