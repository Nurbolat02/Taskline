"use client";

import { useUiStore } from "@/store/ui-store";
import { TaskItem } from "./task-item";
import type { Category } from "@/db/schema";
import type { TaskWithCategory } from "@/types";
import listStyles from "@/styles/list.module.css";
import styles from "./task-list.module.css";

// Data (tasks) comes from the server through a prop, but HOW it's currently
// shown is decided by the zustand filter store. Splitting "where the data
// comes from" from "how it's displayed" is the whole reason for having the store.
export function TaskList({ tasks, categories }: { tasks: TaskWithCategory[]; categories: Category[] }) {
  const filters = useUiStore((state) => state.filters);

  const filtered = tasks.filter((task) => {
    const matchesSearch = task.title.toLocaleLowerCase().includes(filters.search.toLocaleLowerCase());

    const statusFilterIsOff = filters.status === "all";
    const statusFilterIsOn = task.status === filters.status;
    const matchesStatus = statusFilterIsOff || statusFilterIsOn;

    const categoryFilterIsOff = filters.categoryId === "all";
    const categoryFilterIsOn = task.categoryId === filters.categoryId;
    const matchesCategory = categoryFilterIsOff || categoryFilterIsOn;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (filtered.length === 0) {
    return <p className={styles.empty}>No tasks found.</p>;
  }

  return (
    <ul className={listStyles.list}>
      {filtered.map((task) => (
        <TaskItem key={task.id} categories={categories} task={task} />
      ))}
    </ul>
  );
}
