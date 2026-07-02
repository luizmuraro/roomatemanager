# Share House

Share House is a mobile-first web app for shared household finance between people sharing a home.
It helps track expenses, split values, manage shopping items, store receipts, and keep account settlements clear.

Primary UX language is Portuguese (Brasil), with BRL currency formatting.

## Current Status

Project stage: Full-stack MVP — integrated with the NestJS backend (`../sharehouse-backend`).

Implemented (wired to the API):
- Authentication: login / register / logout via httpOnly cookie session
- Onboarding: create a household or join by invite code
- Main navigation shell: Sidebar (desktop, with logout) + Bottom Nav (mobile)
- Dashboard with summaries and quick actions
- Expenses flow with filters and add-expense modal (2 steps); solo & paired households
- Settle-up: full-balance settlement that clears the balance (persisted)
- Shopping list (CRUD + clear checked)
- Household: invite code, and leaving a household
- Settings: profile update, invite management

Still mock/local (not yet wired):
- Receipts (gallery is mock; upload storage pending — see Known Limitations)
- Settings "Privacidade" and "Notificações" tabs

Data source:
- Backend REST API; money is integer cents; auth is an httpOnly `access_token` cookie

## Routes

- /login (and /register)
- /onboarding
- /dashboard
- /expenses
- /shopping
- /receipts
- /settings

Notes:
- / redirects to /dashboard
- Protected routes redirect to /login when signed out, or to /onboarding when the user has no household

## Tech Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS 3
- shadcn/ui (Radix-based components)
- React Router DOM v6
- TanStack Query v5
- React Hook Form + Zod
- Recharts
- Lucide React
- Sonner
- Vitest + Testing Library

## Project Structure

Main folders:

- src/components
	- ui: shadcn/ui generated primitives
	- expenses, shopping, receipts, settings: feature components
	- layout components (AppLayout, sidebar, mobile nav)
- src/pages
	- route-level pages
- src/hooks
	- feature and shared hooks
- src/lib
	- formatters, route helpers, expense helpers, mock data
- src/types
	- domain types

## Getting Started

Prerequisites:
- Node.js 20+ (recommended LTS)
- npm

Install dependencies:

npm install

Start development server:

npm run dev

If npm is not recognized in your PowerShell session, use:

C:\Program Files\nodejs\npm.cmd run dev

Default local URL:

http://localhost:8080

The API base URL comes from `VITE_API_URL` in `.env` (set it to `http://localhost:3000` for local dev — without `/api`). The backend lives in `../sharehouse-backend`; run it separately.

## Available Scripts

- npm run dev: start local dev server
- npm run build: production build
- npm run build:dev: development-mode build
- npm run preview: preview built app
- npm run lint: run ESLint
- npm run test: run tests once
- npm run test:watch: run tests in watch mode

## Product and UX Conventions

- Mobile-first layouts
- Portuguese (Brasil) UI copy
- Currency formatting in BRL (R$ 1.234,56)
- Tailwind utility classes (no inline styles)
- Strict typing and functional components

## Known Limitations

- Receipts are still mock/local — upload storage (Cloudflare R2) is not wired yet
- Settle-up is full-balance only; partial payments are not supported yet
- Settings "Privacidade" and "Notificações" tabs are placeholders
- No frontend e2e tests yet (Playwright scaffolded, no specs); backend has unit tests for balance math + the household cap

## Next Suggested Steps

1. Wire receipts to Cloudflare R2 and attach them to expenses
2. Add partial settle-up payments
3. Implement the Settings privacy/notification preferences
4. Add frontend component/e2e tests and CI checks (lint, tests, build)

## License

Private project.
