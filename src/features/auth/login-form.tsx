"use client";

import Link from "next/link";
import { useLoginForm } from "@/hooks/use-login-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import form from "@/styles/form.module.css";

// The same pattern is used for every form in the project: react-hook-form
// validates on the client against the same zod schema used on the server,
// and next-safe-action provides errors/isExecuting without manual useState
// on each form.
export function LoginForm() {
  const { rhf, execute, isExecuting, result } = useLoginForm();

  return (
    <form className={form.form} onSubmit={rhf.handleSubmit((values) => execute(values))}>
      <div className={form.field}>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...rhf.register("email")} />
        {rhf.formState.errors.email && <p className={form.errorText}>{rhf.formState.errors.email.message}</p>}
      </div>
      <div className={form.field}>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" {...rhf.register("password")} />
        {rhf.formState.errors.password && <p className={form.errorText}>{rhf.formState.errors.password.message}</p>}
      </div>
      {result.serverError && <p className={form.errorText}>{result.serverError}</p>}
      <Button disabled={isExecuting} type="submit">
        {isExecuting ? "Logging in..." : "Log in"}
      </Button>
      <p className={form.footerText}>
        Don't have an account?{" "}
        <Link href="/register" className={form.footerLink}>
          Sign up
        </Link>{" "}
      </p>
    </form>
  );
}
