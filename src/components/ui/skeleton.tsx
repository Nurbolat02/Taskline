import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./skeleton.module.css";

// Используется в loading.tsx как заглушка на время загрузки Server Component.
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(className, styles.skeleton)} {...props}></div>;
}
