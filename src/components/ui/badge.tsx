import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./badge.module.css";

export type badgeStyles = "default" | "secondary" | "destructive" | "outline";

export interface BadgeType extends React.ComponentProps<"span"> {
  variant?: badgeStyles;
}

export function Badge({ className, variant = "default", ...props }: BadgeType) {
  return <span className={cn(styles.badge, className, styles[variant])} {...props} />;
}
