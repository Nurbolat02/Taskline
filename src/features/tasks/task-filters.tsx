"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { TASK_STATUSES, TASK_STATUS_LABELS } from "@/schemas/task";
import type { Category } from "@/db/schema";
import styles from "./task-filters.module.css";

// All filtering happens on the client over the already-loaded task list —
// this is exactly the "local filter state" Zustand exists for in this project.
export function TaskFilters({ categories }: { categories: Category[] }) {
  const { filters, setSearch, setStatusFilter, setCategoryFilter, resetFilters } = useUiStore();

  return (
    <div className={styles.filters}>
      <Input
        value={filters.search}
        placeholder="Search by name..."
        onChange={(event) => setSearch(event.target.value)}
        className={styles.search}
      />
      <Select
        value={filters.status}
        onChange={(event) => setStatusFilter(event.target.value as typeof filters.status)}
        className={styles.select}
      >
        <option value="all">All statuses</option>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {TASK_STATUS_LABELS[status]}
          </option>
        ))}
      </Select>
      <Select
        value={filters.categoryId}
        onChange={(event) => setCategoryFilter(event.target.value)}
        className={styles.select}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Button variant="ghost" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  );
}
