"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useTaskItemActions } from "@/hooks/use-task-item-actions";
import { TASK_STATUSES, TASK_STATUS_LABELS, type TaskStatus } from "@/schemas/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import type { Category } from "@/db/schema";
import type { TaskWithCategory } from "@/types";
import styles from "./task-item.module.css";

export function TaskItem({ task, categories }: { task: TaskWithCategory; categories: Category[] }) {
  const { editOpen, setEditOpen, deleteOpen, setDeleteOpen, isDeleting, changeStatus, confirmDelete } =
    useTaskItemActions(task.id);

  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <Link href={`/tasks/${task.id}`} className={styles.title}>
            {task.title}
          </Link>
          {task.category && (
            <Badge variant="outline" style={{ borderColor: task.category.color, color: task.category.color }}>
              {task.category.name}
            </Badge>
          )}
        </div>
        {task.description && <p className={styles.description}>{task.description}</p>}
        {task.dueDate && <p className={styles.due}>Due: {new Date(task.dueDate).toLocaleString("en-US")}</p>}
      </div>
      <div className={styles.actions}>
        <Select
          value={task.status}
          onChange={(event) => changeStatus(event.target.value as TaskStatus)}
          className={styles.statusTrigger}
        >
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </Select>

        <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => setEditOpen(true)}>
          <Pencil size={16} />
        </Button>
        <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <TaskForm task={task} categories={categories} onDone={() => setEditOpen(false)} />
        </Dialog>
        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setDeleteOpen(true)}>
          <Trash2 size={16} />
        </Button>
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Delete task &quot;{task.title}&quot;?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </li>
  );
}
