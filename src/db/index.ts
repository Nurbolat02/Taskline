import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL);

// Node.js caches modules, so client/db are created once on first import rather
// than on every request — otherwise every HTTP request would open a new
// connection to Postgres and quickly exhaust its connection limit.
export const db = drizzle(client, { schema });
