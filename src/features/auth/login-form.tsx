"use client";

import Link from "next/link";
import { useLoginForm } from "@/hooks/use-login-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import form from "@/styles/form.module.css";

// Паттерн форм во всём проекте один и тот же: react-hook-form валидирует
// на клиенте по той же zod-схеме, что и на сервере, а next-safe-action
// достаёт errors/isExecuting без ручного useState на каждую форму.
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
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" type="password" autoComplete="current-password" {...rhf.register("password")} />
        {rhf.formState.errors.password && <p className={form.errorText}>{rhf.formState.errors.password.message}</p>}
      </div>
      {result.serverError && <p className={form.errorText}>{result.serverError}</p>}
      <Button disabled={isExecuting} type="submit">
        {isExecuting ? "Входим..." : "Войти"}
      </Button>
      <p className={form.footerText}>
        Нет аккаунта?{" "}
        <Link href="/register" className={form.footerLink}>
          Зарегистрироваться
        </Link>{" "}
      </p>
    </form>
  );
}
