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
    return <p className={styles.empty}>No categories yet</p>;
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
        <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)} aria-label="edit">
          <Pencil size={16} />
        </Button>
        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>
          <CategoryForm category={category} onDone={() => setEditOpen(false)} />
        </Dialog>
        <Button variant="ghost" size="icon" aria-label="delete" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={16} />
        </Button>
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Delete category {category.name}?</DialogTitle>
          </DialogHeader>
          <p className={styles.footerText}>Tasks in this category won't be deleted, they'll just lose their category</p>
          <DialogFooter>
            <Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </li>
  );
}
