# House Share — GitHub Copilot Instructions

## Project Overview
House Share is a **mobile-first** collaborative expense management web app for people sharing a home. Primary language is **Portuguese (Brasil)**. Currency is **R$ (BRL)**. Date format is **DD/MM/YYYY**.

## Tech Stack
- **React 18** + **TypeScript 5**
- **Vite 5** (bundler)
- **Tailwind CSS 3** (utility-first styling)
- **shadcn/ui** (component library — Radix UI primitives, already installed)
- **React Router DOM v6** (routing)
- **React Hook Form** + **Zod** (forms and validation)
- **TanStack Query v5** (async state / data fetching)
- **Recharts** (charts)
- **Lucide React** (icons)
- **Sonner** (toast notifications)

## Reference Repository
The reference repo contains:
- `prototype/html-screens/` — 7 complete HTML+Tailwind prototypes. **Always use these as the visual and functional source of truth.**
- `docs/technical-docs.md` — Full technical spec and data models.
- `docs/screenshots/` — Design screenshots per screen.

## Current State (what Lovable already built)
✅ Login screen (`/login`)
✅ Register screen (`/register`)
✅ Dashboard screen (`/`)
✅ Sidebar / navigation

## Remaining Screens to Build
These must be implemented one at a time, faithfully following the HTML prototypes:
1. **Expenses List** (`/expenses`) — filterable list, category badges, split amounts
2. **Add Expense Modal** — 2-step modal: amount + description → split config
3. **Shopping List** (`/shopping`) — collaborative list with checkboxes, real-time feel
4. **Receipt Gallery** (`/receipts`) — photo grid + upload trigger
5. **Settings** (`/settings`) — 4 sub-tabs: Profile, Partner, Privacy, Notifications

## Coding Conventions
- **One component per file.** File name matches component name in PascalCase.
- **No backend calls yet.** Use hardcoded mock data or React state for all data.
- **Mobile-first.** Default styles are for mobile; use `md:` breakpoints for larger screens.
- **shadcn/ui first.** Always prefer an existing shadcn/ui component before writing custom UI.
- **No inline styles.** Use Tailwind utility classes only.
- **PT-BR UI text.** All labels, placeholders, button text, and messages must be in Portuguese (Brasil).
- **English for code.** Variable names, function names, file names, and comments in English.
- **Strict TypeScript.** Always type props with interfaces or types. No `any`.
- **Functional components only.** No class components.
- **Named exports** for components; default export at the bottom of the file.

## Design Tokens (from prototypes)
- Primary color: `#2563EB` (blue-600)
- Background: `#F9FAFB` (gray-50)
- Card background: `#FFFFFF`
- Destructive/debt accent: `#EF4444` (red-500)
- Success/credit accent: `#22C55E` (green-500)
- Border radius: `rounded-xl` for cards, `rounded-lg` for buttons
- Bottom navigation height: `h-16` fixed at bottom on mobile

## Folder Structure (follow this)
```
src/
  components/
    ui/          ← shadcn/ui auto-generated, do not edit
    layout/      ← Sidebar, BottomNav, AppShell
    expenses/    ← ExpenseCard, ExpenseList, AddExpenseModal
    shopping/    ← ShoppingItem, ShoppingList
    receipts/    ← ReceiptCard, ReceiptGallery
    settings/    ← SettingsTabs, ProfileForm, etc.
    dashboard/   ← BalanceSummary, RecentExpenses, etc.
  pages/         ← One file per route (Login, Register, Dashboard, etc.)
  hooks/         ← Custom hooks (useExpenses, useShopping, etc.)
  types/         ← TypeScript interfaces (Expense, User, ShoppingItem, etc.)
  lib/
    utils.ts     ← shadcn cn() helper
    mock-data.ts ← All hardcoded mock data goes here
```

## Key Data Types (from technical spec)
```typescript
interface Expense {
  id: string;
  description: string;
  amount: number; // in BRL cents
  category: 'alimentacao' | 'moradia' | 'transporte' | 'saude' | 'lazer' | 'outros';
  paidBy: 'me' | 'partner';
  splitRatio: number; // 0–1, my share
  date: string; // ISO
  receiptUrl?: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  addedBy: 'me' | 'partner';
}
```

## Important Constraints
- **Never break existing screens.** When adding a new screen, only touch files related to it.
- **Always add the new route** to the router in `src/App.tsx` (or wherever the router lives).
- **Bottom navigation** should highlight the active route.
- Amounts must be formatted as `R$ 1.234,56` (Brazilian format).
