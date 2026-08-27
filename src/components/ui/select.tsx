import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./select.module.css";

// Обычный <select> со своими стилями — принимает value/onChange напрямую и
// register(...) из react-hook-form, options передаются как обычные <option> дети.
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(styles.select, className)} {...props} />;
}
