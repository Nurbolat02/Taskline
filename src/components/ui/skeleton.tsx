import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./skeleton.module.css";

// Used in loading.tsx as a placeholder while a Server Component is loading.
export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(className, styles.skeleton)} {...props}></div>;
}
