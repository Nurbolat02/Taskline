"use client";

import Link from "next/link";
import { useRegisterForm } from "@/hooks/use-register-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import form from "@/styles/form.module.css";

export function RegisterForm() {
  const { rhf, execute, isExecuting, result } = useRegisterForm();

  return (
    <form className={form.form} onSubmit={rhf.handleSubmit((values) => execute(values))}>
      <div className={form.field}>
        <Label htmlFor="name">Name</Label>
        <Input id="name" autoComplete="name" {...rhf.register("name")} />
        {rhf.formState.errors.name && <p className={form.errorText}>{rhf.formState.errors.name.message}</p>}
      </div>
      <div className={form.field}>
        <Label htmlFor="email">Email</Label>
        <Input id="email" autoComplete="email" type="email" {...rhf.register("email")} />
        {rhf.formState.errors.email && <p className={form.errorText}>{rhf.formState.errors.email.message}</p>}
      </div>
      <div className={form.field}>
        <Label htmlFor="password">Password</Label>
        <Input id="password" autoComplete="new-password" type="password" {...rhf.register("password")} />
        {rhf.formState.errors.password && <p className={form.errorText}>{rhf.formState.errors.password.message}</p>}
      </div>
      {result.serverError && <p className={form.errorText}>{result.serverError}</p>}
      <Button type="submit" disabled={isExecuting}>
        {isExecuting ? "Creating account..." : "Sign up"}
      </Button>
      <p className={form.footerText}>
        Already have an account?{" "}
        <Link href="/login" className={form.footerLink}>
          Log in
        </Link>
      </p>
    </form>
  );
}
