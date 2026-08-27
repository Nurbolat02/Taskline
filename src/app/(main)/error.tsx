"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import styles from "./error.module.css";

// error.tsx обязан быть Client Component — это требование Next.js,
// т.к. он оборачивается в error boundary на клиенте.
export default function MainError({ error, reset }: { error: Error & { digest: string }; reset: () => void }) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Что-то пошло не так</h2>
      <p className={styles.message}>{error.message}</p>
      <Button onClick={reset}>Попробовать снова</Button>
    </div>
  );
}
