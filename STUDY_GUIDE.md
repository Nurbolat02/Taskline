# Гид по знакомству с проектом и порядку переписывания

Этот файл — карта чтения проекта. Порядок фаз ниже = порядок зависимостей:
каждый следующий слой опирается на предыдущий, поэтому если идти по фазам
сверху вниз, каждый файл понятен сразу, без забегания вперёд и подглядывания.

---

## Фаза 0 — Обвязка (просто пролистать, не запоминать)

`package.json` → `tsconfig.json` → `compose.yml` → `.env.example` → `src/app/globals.css`

Тут ничего "переписывать" не нужно — это конфиги. Важно только понять, что
где лежит и почему `compose.yml` использует порт 5433, а не 5432 (конфликт
с локально установленным Postgres 16 на этой машине).

## Фаза 1 — База данных (фундамент всего проекта)

`src/db/schema/users.ts` → `sessions.ts` → `activity-log.ts` → `categories.ts`
→ `tasks.ts` → `schema/index.ts` → `src/db/index.ts` → `drizzle.config.ts`

**Самопроверка перед переходом дальше:**

- Почему у `sessions` есть отдельная таблица, если JWT и так подписан?
- Почему `categoryId` в `tasks` — `onDelete: "set null"`, а не `"cascade"`?

## Фаза 2 — Ядро авторизации (то, ради чего всё затевалось)

`src/lib/auth/constants.ts` → `password.ts` → `jwt.ts` → `session.ts` →
`src/middleware.ts`

Это самая важная фаза.

**Самопроверка:**

- Чем "оптимистичная" проверка в middleware отличается от проверки в
  `getCurrentUser()`?
- Что произойдёт, если удалить проверку `isNull(sessions.revokedAt)` в
  `session.ts`?

## Фаза 3 — Контракт клиент↔сервер

`src/schemas/auth.ts` → `category.ts` → `task.ts` → `src/lib/safe-action.ts`

Здесь описано "что вообще можно передать на сервер" и настроен
`authActionClient`, который сам проверяет авторизацию перед каждым action.

## Фаза 4 — Бизнес-логика

`src/lib/activity-log.ts` → `src/lib/request-meta.ts` →
`src/actions/auth.ts` → `categories.ts` → `tasks.ts` → `sessions.ts`

**Самопроверка:**

- В каждом action есть `eq(*.userId, ctx.user.id)` — что случится, если это
  условие убрать? (Это и есть IDOR-уязвимость, специально оставленная как
  урок — попробуй представить эксплойт.)

## Фаза 5 — UI-примитивы (можно бегло, это не логика, а разметка)

`src/components/ui/button.tsx` (обрати внимание на `forwardRef` — без него
сломается `asChild` у диалогов) → `input.tsx` → `label.tsx` → `textarea.tsx`
→ `card.tsx` → `badge.tsx` → `select.tsx` → `dialog.tsx` →
`dropdown-menu.tsx` → `separator.tsx` → `skeleton.tsx`

## Фаза 6 — Zustand

`src/store/ui-store.ts` — самый маленький файл, но важно понять разделение
"данные с сервера" vs "как их сейчас показать".

## Фаза 7 — Фичи (компоненты форм и списков)

`features/auth/login-form.tsx` → `register-form.tsx` →
`features/categories/category-form.tsx` → `category-list.tsx` →
`features/tasks/task-form.tsx` → `task-item.tsx` → `task-filters.tsx` →
`task-list.tsx` → `task-create-button.tsx` →
`features/settings/session-list.tsx` → `activity-log-list.tsx` →
`components/layout/navbar.tsx` → `sidebar.tsx`

## Фаза 8 — Роутинг (собирает всё воедино)

`src/app/layout.tsx` → `(auth)/layout.tsx` → `(auth)/login/page.tsx` →
`register/page.tsx` → `(main)/layout.tsx` → `(main)/page.tsx` →
`(main)/categories/page.tsx` → `(main)/tasks/[id]/page.tsx` + `loading.tsx`
→ `(main)/settings/activity/page.tsx` → `(main)/loading.tsx` →
`(main)/error.tsx` → `app/not-found.tsx`

---

# Как переписывать (5 шагов)

1. **Полное повторение** — иди по фазам 1→8 сверху вниз, читай мой файл,
   закрывай его, печатай свою версию по памяти, потом сверяй построчно. Не
   пропускай фазы и не читай на два шага вперёд.
2. **Backend с нуля** — оставь UI (фазы 5–8) как есть, перепиши фазы 1–4
   сам, ориентируясь только на то, что импортирует оставшийся UI-код (это и
   есть твоё ТЗ по контракту данных).
3. **Frontend с нуля** — оставь фазы 1–4, перепиши 5–8 сам, имея готовые
   actions/schemas как контракт.
4. **Всё вместе** — с нуля, но можно подглядывать в структуру папок.
5. **По памяти, без подглядывания** — открываешь пустую папку и весь стек
   по памяти.

Один нюанс: между шагами 1 и 2 стоит сделать паузу и попробовать объяснить
вслух (или письменно) каждой фазе — "зачем она нужна". Если не можешь
объяснить фазу 2 своими словами, шаг 2 (переписывание backend) будет просто
копированием, а не пониманием.
