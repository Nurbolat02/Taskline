# Learn Fullstack — Task Tracker

Учебный проект: маленький Task Tracker с категориями, написанный для того,
чтобы его несколько раз переписать и закрепить современный Next.js-стек.

## Стек

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 + shadcn-style компоненты на radix-ui
- PostgreSQL (Docker) + Drizzle ORM
- Своя JWT-авторизация: bcrypt + jose + httpOnly cookie + middleware
- Server Actions + next-safe-action
- React Hook Form + Zod
- Zustand (только для UI-состояния: сайдбар, фильтры задач)
- Session / Activity log

## Как запустить

```bash
# 1. Поднять Postgres
docker compose up -d

# 2. Скопировать env и при желании поменять JWT_SECRET
cp .env.example .env

# 3. Поставить зависимости
bun install

# 4. Накатить схему в БД (для разработки проще push, чем generate+migrate)
bun run db:push

# 5. Запустить дев-сервер
bun dev
```

Откройте http://localhost:3000 — редирект на /login, зарегистрируйтесь и пользуйтесь.

## Структура

```
src/
 ├── app          — роуты (App Router): (auth) и (main) route groups
 ├── actions      — server actions ("use server"), next-safe-action
 ├── components   — ui/ (shadcn-style примитивы) и layout/ (navbar, sidebar)
 ├── features      — компоненты конкретных фич (формы, списки), группировка по домену
 ├── lib           — auth (jwt/password/session), safe-action, utils
 ├── db            — drizzle schema + подключение
 ├── schemas       — zod-схемы, общие для клиента и сервера
 ├── store         — zustand
 └── types         — общие TS-типы
```

## Путь переписывания (см. план обучения)

1. Полностью повторить проект как есть.
2. Переписать backend (schema, actions, auth) самостоятельно, оставив UI.
3. Переписать frontend (компоненты, формы) самостоятельно, оставив backend.
4. Переписать всё целиком.
5. Написать с нуля без референса — по памяти.

`components/ui/*` специально написаны как отдельный, тонкий слой поверх
radix-ui — чтобы на шаге 3/4 их можно было заменить на свои компоненты,
не трогая `features/*` (формы и списки импортируют `Button`, `Input` и т.д.
по имени, а не завязаны на реализацию).
