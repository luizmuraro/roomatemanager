# House Share

House Share is a mobile-first web app for shared household finance between people sharing a home.
It helps track expenses, split values, manage shopping items, store receipts, and keep account settlements clear.

Primary UX language is Portuguese (Brasil), with BRL currency formatting.

## Current Status

Project stage: Frontend MVP (no backend yet)

Implemented:
- Authentication screens: Login
- Main navigation shell: Sidebar (desktop) + Bottom Nav (mobile)
- Dashboard with summaries and quick actions
- Expenses flow with filters and add-expense modal (2 steps)
- Settle-up flow with confirmation modal and partial payment support
- Shopping list screen
- Receipt gallery screen
- Settings screen with tabs

Data source right now:
- Mock/local frontend state only
- No API integration yet

## Routes

- /login
- /dashboard
- /expenses
- /shopping
- /receipts
- /settings

Notes:
- / redirects to /dashboard
- /register currently redirects to /login

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

http://localhost:5173

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

- No backend persistence yet
- No authentication backend integration yet
- Some flows are optimistic/local-state only

## Next Suggested Steps

1. Add backend/API integration for auth, expenses, shopping, receipts, settings
2. Persist settle-up transactions and expense payment history
3. Add end-to-end tests for key user flows
4. Add CI checks for lint, tests, and build

## License

Private project.
