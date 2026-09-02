"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import styles from "./error.module.css";

// error.tsx must be a Client Component — a Next.js requirement, since it's
// wrapped in an error boundary on the client.
export default function MainError({ error, reset }: { error: Error & { digest: string }; reset: () => void }) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
