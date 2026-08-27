"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { loginAction } from "@/actions/auth";
import { loginSchema, type LoginInput } from "@/schemas/auth";

export function useLoginForm() {
  const rhf = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { execute, isExecuting, result } = useAction(loginAction);

  return { rhf, execute, isExecuting, result };
}
