# roomatemanager — Frontend (for Claude Code)

Frontend for **Share House**: React 18 + Vite 5 + TypeScript + Tailwind CSS 3 + shadcn/ui (Radix). Mobile-first, Portuguese (Brasil) UI, BRL currency. Routing via React Router v6, data fetching via TanStack Query v5, forms via React Hook Form + Zod.

> Full product/status detail lives in `README.md` — read it for routes, features, and known limitations. This file is the quick reference for working in the code.

## Commands

Run from this folder (`roomatemanager/`):

- `npm run dev` — dev server at http://localhost:8080 (port fixed in `vite.config.ts`, not Vite's default 5173)
- `npm run build` — production build (`build:dev` for development mode)
- `npm run preview` — preview the built app
- `npm run lint` — ESLint
- `npm run test` — Vitest run once (`test:watch` for watch mode). Only a placeholder test exists today (`src/test/example.test.ts`) — effectively no coverage yet.
- Playwright is scaffolded (`playwright.config.ts`, `playwright-fixture.ts`) but the config is commented-out and there are **no e2e specs yet**.

If `npm` isn't on PATH in PowerShell, use `C:\Program Files\nodejs\npm.cmd`.

## Structure

- `src/pages/` — route-level pages: `/login` (+ `/register`), `/onboarding`, `/dashboard`, `/expenses`, `/shopping`, `/receipts`, `/settings`
- `src/components/` — feature components (expenses, shopping, receipts, settings) and layout (AppLayout, sidebar, mobile nav)
  - `src/components/ui/` — shadcn/ui generated primitives; prefer composing these over hand-rolled widgets
- `src/hooks/` — TanStack Query data hooks, one per feature (`useExpenses`, `useShopping`, `useHousehold`, `useUser`), each `useQuery`/`useMutation` against the API with cache invalidation
- `src/lib/` — `api-client.ts` (shared axios instance), formatters, route/expense helpers. (No central mock-data module — the only mock data is the inline `initialReceipts` array in `Receipts.tsx`.)
- `src/contexts/` — `AuthContext` (session bootstrap + login/register/logout)
- `src/types/` — domain types. **Two parallel systems:** `types/api.ts` is the backend contract (use this for anything that touches the API); `types/expense.ts` & `types/shopping.ts` are legacy UI shapes, mapped from the API per-page. Prefer the `api.ts` contract; the duplication is flagged for cleanup.

## Conventions

- **PT-BR copy** for all user-facing text; **BRL** formatting (`R$ 1.234,56`).
- **Mobile-first** layouts.
- **Tailwind utility classes** only — no inline styles.
- Strict typing, functional components.
- Use existing helpers in `src/lib/` and shadcn primitives in `src/components/ui/` before adding new ones.
- **Money is integer cents** in the API/types; convert reais↔cents only at the UI edge (e.g. `*100` when sending, format on display).
- Expense categories must match the backend PT-BR enum exactly: `alimentacao | moradia | transporte | saude | lazer | outros`.
- The household has **1–2 members** ("partner" = the one other member, when present). **Solo use is supported:** with no partner, `Expenses` adds an expense attributed 100% to the current user (`AddExpenseModal` skips the split step and the "quem pagou" field; the page forces `paidBy` = self, `splitRatio` = 1). Don't add UI that implies >2 roommates without backend support.
- **`splitRatio` = the payer's share** of the amount (matches the backend balance math), *not* the current user's share. The `AddExpenseModal` slider edits "Sua parte" and converts to the payer's share on submit based on who paid. To compute the current user's portion of an expense, use `getMyShare()` in `src/lib/expense.ts` (it flips based on `paidBy`) rather than multiplying by `splitRatio` directly.

## Backend / API

- The API base URL comes from `VITE_API_URL` in `.env` (gitignored). For local dev set it to `http://localhost:3000` — **without** `/api`. The `.env` ships with a placeholder value; changing it requires restarting the dev server.
- **Do not put `/api` in `VITE_API_URL`.** Every request path in the code already starts with `/api` (see `AuthContext.tsx`, `hooks/*`), so a base ending in `/api` doubles it → `/api/api/...` → 404. Base = host+port only.
- The backend lives in the sibling repo `../sharehouse-backend`. Every response is wrapped as `{ success, data }` (read `response.data.data`); all routes are under `/api`.
- **Auth is cookie-based**: `api-client.ts` sets `withCredentials: true`; the httpOnly `access_token` cookie is managed by the backend (nothing stored in JS). `AuthContext` bootstraps the session via `GET /api/auth/me`. A 401 from the interceptor redirects to `/login` (with a `skipAuthRedirect` opt-out used during onboarding).
- **Not yet wired to a backend** (mock/local only): receipts (no endpoint exists yet) and the Settings privacy/notifications tabs. Settle-up is now persisted (`POST /api/expenses/settle`, full-balance) and leaving a household is supported (`POST /api/household/leave`).
