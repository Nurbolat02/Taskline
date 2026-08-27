import * as React from "react";
import { cn } from "@/lib/utils";
import styles from "./card.module.css";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(styles.card, className)} {...props}></div>;
}
export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(styles.header, className)} {...props}></div>;
}
export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn(styles.title, className)} {...props}></h3>;
}
export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn(styles.description, className)} {...props}></p>;
}
export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(styles.content, className)} {...props}></div>;
}
export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(styles.footer, className)} {...props}></div>;
}
