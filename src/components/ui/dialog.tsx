"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./dialog.module.css";

// Рендерится через портал в document.body. useEffect не выполняется во время SSR, но
// createPortal выполняется — поэтому перед вызовом проверяем, открыта ли модалка и
// существует ли уже document (на сервере его ещё нет).
export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  React.useEffect(() => {
    if (!open) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div role="dialog" aria-modal="true" className={styles.content} onClick={(event) => event.stopPropagation()}>
        {children}
        <button type="button" className={styles.close} onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader(props: React.ComponentProps<"div">) {
  return <div className={cn(styles.header, props.className)} {...props} />;
}

export function DialogTitle(props: React.ComponentProps<"h2">) {
  return <h2 className={cn(styles.title, props.className)} {...props} />;
}

export function DialogDescription(props: React.ComponentProps<"p">) {
  return <p className={cn(styles.description, props.className)} {...props} />;
}

export function DialogFooter(props: React.ComponentProps<"div">) {
  return <div className={cn(styles.footer, props.className)} {...props} />;
}
