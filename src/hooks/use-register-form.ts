"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { registerAction } from "@/actions/auth";
import { registerSchema, type RegisterInput } from "@/schemas/auth";

export function useRegisterForm() {
  const rhf = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const { execute, isExecuting, result } = useAction(registerAction);

  return { rhf, execute, isExecuting, result };
}
