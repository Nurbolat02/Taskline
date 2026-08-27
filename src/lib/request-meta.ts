import { headers } from "next/headers";

// server actions не имеют прямого доступа к объекту request, но headers() достаёт
// заголовки текущего запроса из любого места на сервере (как и cookies()) —
// этого достаточно, чтобы положить user-agent/IP в таблицу sessions для
// списка сессий и activity log
export async function getRequestMeta(): Promise<{ userAgent: string | null; ipAddress: string | null }> {
  const headersList = await headers();
  return {
    userAgent: headersList.get("user-agent"),
    // x-forwarded-for может быть цепочкой "ip1, ip2, ip3", если запрос прошёл
    // через несколько прокси — берём первый IP (настоящий клиент).
    ipAddress: headersList.get("x-forwarded-for")?.split(",")[0].trim() || null,
  };
}
