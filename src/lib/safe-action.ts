import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "@/lib/auth/session";

// Базовый клиент для всех server actions: handleServerError решает, какой текст
// показать на клиенте вместо голого "Internal Server Error" со стектрейсом.
export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error(error);
    return error.message || "Что-то пошло не так, попробуйте ещё раз";
  },
});

// Тот же actionClient, но с middleware, которое выполняется перед телом любого
// action на authActionClient: достаёт текущего пользователя и кладёт в ctx.user,
// либо бросает ошибку "Не авторизован" (её поймает handleServerError выше).
export const authActionClient = actionClient.use(async ({ next }) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Не авторизован");
  }
  return next({ ctx: { user } });
});
