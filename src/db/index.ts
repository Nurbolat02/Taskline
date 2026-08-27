import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL);

// Модули Node.js кэшируются, поэтому client/db создаются один раз при первом импорте,
// а не при каждом запросе — иначе на каждый HTTP-запрос открывалось бы новое соединение
// к БД и быстро исчерпало бы лимит соединений Postgres.
export const db = drizzle(client, { schema });
