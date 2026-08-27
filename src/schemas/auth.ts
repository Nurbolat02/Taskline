import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа").max(60, "Максимум 60 символов"),
  email: z.email("Некорректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginSchema>;
