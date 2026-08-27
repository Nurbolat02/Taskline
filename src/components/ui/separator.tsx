import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./separator.module.css";

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(styles.separator, styles[orientation], className)}
      {...props}
    />
  );
}
