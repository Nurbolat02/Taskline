# Deployment

- **Frontend + backend (Next.js, server actions):** Vercel — project `taskline`
  - Public URL: https://taskline-beta.vercel.app
- **Database:** Neon (Postgres), connected via Vercel's native Neon integration
  - Neon project: `neon-emerald-village`
  - Database: `neondb`
- **Env vars (set in Vercel):** `DATABASE_URL` (from Neon integration), `JWT_SECRET`
- **Auth:** custom JWT (bcrypt + jose), no third-party auth provider

Schema is managed with Drizzle (`drizzle-kit push`), no separate backend service — API logic lives in Next.js server actions and route handlers.
