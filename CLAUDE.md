# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run start    # run production build
```

No test runner or lint script is configured.

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Architecture

**Entre Maistros** is a local services marketplace for Tepeji del Río, Hidalgo — connecting residents with skilled tradespeople (plumbers, electricians, etc.).

### Stack

- **Next.js 16 App Router** with React 19 (see AGENTS.md warning — read `node_modules/next/dist/docs/` before writing Next.js code)
- **Clerk v7** — authentication and user metadata
- **Supabase** — PostgreSQL database + file storage (`work-photos` bucket)
- **Tailwind CSS v4** — configured entirely via `globals.css` `@theme` blocks, no `tailwind.config.js`
- **shadcn/ui** — component library, components live in `components/ui/`

### Data Model (`supabase/schema.sql`)

- `worker_profiles` — linked to Clerk via `clerk_user_id`; has a `slug` for public URLs
- `categories` / `worker_categories` — M2M; seeded with 10 fixed trades
- `worker_skills`, `work_photos` — child tables of worker_profiles
- `reviews` — one per (worker, reviewer) pair; upserted on conflict
- `workers_with_stats` — **DB view** that joins all above with `avg_rating` and `review_count`; used for all worker listing/search queries

### Auth & Data Access Pattern

- `middleware.ts` — Clerk middleware protects `/perfil(.*)` routes only
- **Server Components** fetch via `createServerSupabase()` (service role key, bypasses RLS)
- **API Routes** (`app/api/`) handle all mutations — also use `createServerSupabase()` after verifying Clerk auth via `auth()` / `currentUser()`
- `getSupabase()` (anon key) is available for client-side reads if needed, but is currently unused
- After creating a worker profile, the API patches Clerk `public_metadata` with `{ role: 'worker', worker_slug: slug }` so the header can show the worker link

### Key Routes

| Path | Purpose |
|------|---------|
| `/` | Home — featured workers, category grid |
| `/buscar` | Search page — queries `/api/workers?q=&categoria=` |
| `/categoria/[slug]` | Browse by trade |
| `/trabajador/[slug]` | Worker public profile + reviews |
| `/perfil/crear` | Create worker profile (protected) |
| `/perfil/editar` | Edit worker profile (protected) |
| `/sign-in`, `/sign-up` | Clerk-hosted auth pages |

### Design System

Brand colors (use `brand-*` prefixes in Tailwind classes):

- `brand-verde` (`#1A2E14`) — primary dark green
- `brand-naranja` (`#F07A30`) — accent orange
- `brand-amarillo` (`#F5C842`) — CTA yellow
- `brand-crema` (`#F5F0E8`) — background cream
- `brand-nopal` (`#9DC87A`) — secondary green

Fonts (set as CSS variables in `app/layout.tsx`):
- `font-display` — Fraunces (serif, for headings/hero)
- `font-sans` — Plus Jakarta Sans (for body text)

### Utilities (`lib/`)

- `cn(...classes)` — `clsx` + `tailwind-merge`
- `slugify(text)` — ASCII-safe URL slug (handles Spanish characters)
- `formatWhatsApp(number)` — returns `https://wa.me/52{digits}`
- `CATEGORIES` — static array mirroring the seeded DB categories; used for UI without a DB call
