import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./button.module.css";

export type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export function buttonClassName(
  size: ButtonSize = "default",
  variant: ButtonVariant = "default",
  className: string | undefined,
) {
  return cn(styles.button, styles[`variant-${variant}`], styles[`size-${size}`], className);
}

interface ButtonProps extends React.ComponentProps<"button"> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
}

export function Button({ size, variant, className, ...props }: ButtonProps) {
  return <button className={buttonClassName(size, variant, className)} {...props}></button>;
}
