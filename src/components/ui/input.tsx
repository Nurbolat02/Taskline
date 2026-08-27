import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./input.module.css";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(className, styles.input)} {...props}></input>;
}
