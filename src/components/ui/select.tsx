import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./select.module.css";

// A plain <select> with its own styles — accepts value/onChange directly and
// register(...) from react-hook-form; options are passed as regular
// <option> children, no wrapper needed.
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(styles.select, className)} {...props} />;
}
