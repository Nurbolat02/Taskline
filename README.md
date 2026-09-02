# Learn Fullstack — Task Tracker

A learning project: a small Task Tracker with categories, built to be
rewritten a few times over while getting comfortable with the modern Next.js stack.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Plain CSS (CSS Modules) + shadcn-style components on top of radix-ui
- PostgreSQL (Docker) + Drizzle ORM
- Custom JWT auth: bcrypt + jose + httpOnly cookie + middleware
- Server Actions + next-safe-action
- React Hook Form + Zod
- Zustand (UI state only: sidebar, task filters)
- Session / Activity log

## Getting started

```bash
# 1. Start Postgres
docker compose up -d

# 2. Copy the env file and change JWT_SECRET if you want
cp .env.example .env

# 3. Install dependencies
bun install

# 4. Push the schema to the DB (push is simpler than generate+migrate for dev)
bun run db:push

# 5. Start the dev server
bun dev
```

Open http://localhost:3000 — it redirects to /login, sign up and start using it.

## Structure

```
src/
 ├── app          — routes (App Router): (auth) and (main) route groups
 ├── actions      — server actions ("use server"), next-safe-action
 ├── components   — ui/ (shadcn-style primitives) and layout/ (navbar, sidebar)
 ├── features      — components for specific features (forms, lists), grouped by domain
 ├── lib           — auth (jwt/password/session), safe-action, utils
 ├── db            — drizzle schema + connection
 ├── schemas       — zod schemas, shared between client and server
 ├── store         — zustand
 └── types         — shared TS types
```

## Rewrite path (see the learning plan)

1. Fully reproduce the project as-is.
2. Rewrite the backend (schema, actions, auth) on your own, keeping the UI.
3. Rewrite the frontend (components, forms) on your own, keeping the backend.
4. Rewrite the whole thing.
5. Write it from scratch with no reference — from memory.

`components/ui/*` are deliberately written as a thin, separate layer on top
of radix-ui — so at step 3/4 they can be swapped for your own components
without touching `features/*` (forms and lists import `Button`, `Input`,
etc. by name, not tied to the implementation).
