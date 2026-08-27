"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import type { Category } from "@/db/schema";

export function TaskCreateButton({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={16} />
        Новая задача
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogHeader>
          <DialogTitle>Новая задача</DialogTitle>
        </DialogHeader>
        <TaskForm categories={categories} onDone={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
