# NovaStream — Multilingual Digital Services Storefront

**Version:** 1.2  
**Primary Market:** Morocco (`MAD / DH`)  
**Languages:** Français (`fr` — Default, LTR), Moroccan Darija (`ar` — RTL, Arabic script), English (`en` — LTR)  
**Stack:** Next.js 16.3.6 (App Router), React 19.2.8, TypeScript 5, SCSS Modules (No Tailwind CSS), `next-intl` 4.1.0, Zod 3.24, Supabase (PostgreSQL + Auth + Storage + RLS)

---

## 1. Project Overview

**NovaStream** is a multilingual digital services and gaming storefront built for the Moroccan market. Customers can browse digital subscriptions and PlayStation/Xbox games, filter by category, compare option combinations (`PS4` / `PS5`, `Primary` / `Secondary`, subscription tiers, and durations), view exact prices in **Moroccan Dirham (`MAD / DH` / `درهم`)**, and place orders directly through **WhatsApp** with a pre-filled localized order message.

Store owners manage the entire catalog—including categories, services, dynamic pricing variants, product images, and contact settings—through a private administration dashboard at `/admin` without touching source code.

---

## 2. Complete Technical Documentation (`docs/`)

For a comprehensive, beginner-friendly guide to every part of the NovaStream codebase, start at the **[Documentation Index (`docs/README.md`)](./docs/README.md)**:

| Guide | Topic |
|---|---|
| **[`docs/README.md`](./docs/README.md)** | Master Documentation Index & Recommended Reading Paths |
| **[`docs/01-project-overview.md`](./docs/01-project-overview.md)** | Business purpose, user roles, technology stack, and implementation status |
| **[`docs/02-getting-started.md`](./docs/02-getting-started.md)** | Local setup, `.env.local` configuration, Supabase setup, and npm scripts |
| **[`docs/03-project-architecture.md`](./docs/03-project-architecture.md)** | Complete folder tree, App Router route groups, and Server vs. Client data flow |
| **[`docs/04-frontend-components.md`](./docs/04-frontend-components.md)** | Storefront & admin React components, props, state, and SCSS Modules architecture |
| **[`docs/05-database.md`](./docs/05-database.md)** | PostgreSQL tables (`admin_profiles`, `categories`, `services`, `service_variants`, `site_settings`), relationships, and `JSONB` attributes |
| **[`docs/06-authentication-security.md`](./docs/06-authentication-security.md)** | Supabase Auth, Middleware route protection, Server Action guards, and Row Level Security (`RLS`) policies |
| **[`docs/07-services-pricing.md`](./docs/07-services-pricing.md)** | How dynamic variants, attribute pills, and integer `MAD` pricing work |
| **[`docs/08-multilingual-system.md`](./docs/08-multilingual-system.md)** | Cookie-based localization (`NEXT_LOCALE`), English/French/Darija translations, and RTL layout |
| **[`docs/09-admin-dashboard.md`](./docs/09-admin-dashboard.md)** | Step-by-step guide to `/admin` (Services CRUD, Categories, Variants, and Settings) |
| **[`docs/10-image-management.md`](./docs/10-image-management.md)** | Supabase Storage (`service-images` bucket), upload limits, primary images, and galleries |
| **[`docs/11-whatsapp-integration.md`](./docs/11-whatsapp-integration.md)** | How `buildWhatsAppOrderUrl()` formats localized WhatsApp order links |
| **[`docs/12-deployment.md`](./docs/12-deployment.md)** | Deploying on **Netlify Free** (recommended commercial host) or **Cloudflare Pages** |
| **[`docs/13-troubleshooting.md`](./docs/13-troubleshooting.md)** | Solutions for common setup, database, auth, storage, and build errors |
| **[`docs/14-maintenance.md`](./docs/14-maintenance.md)** | Updating dependencies safely, database backups, migrations, and translation workflow |
| **[`docs/15-future-improvements.md`](./docs/15-future-improvements.md)** | Transparent review of partially implemented features and optional future roadmap |
| **[`docs/glossary.md`](./docs/glossary.md)** | Plain-English definitions of technical terms (`RLS`, `SSR`, `Server Component`, `Slug`, `JSONB`, etc.) |

---

## 3. Technology Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| **Framework** | Next.js (App Router) | `16.3.6` |
| **UI Library** | React | `19.2.8` |
| **Language** | TypeScript | `^5.7.3` (strict mode) |
| **Styling** | SCSS Modules (`sass`) | `^1.85.1` (**No Tailwind CSS**) |
| **Database & Auth** | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) | PostgreSQL + Auth + Storage + RLS |
| **Localization** | `next-intl` | `^4.1.0` (`en`, `fr`, `ar` via `NEXT_LOCALE` cookie) |
| **Validation** | Zod | `^3.24.2` |
| **Testing** | Vitest + Testing Library | `^3.0.7` |
| **Hosting** | Netlify Free (Primary) / Cloudflare Pages (Alternative) | `netlify.toml` included |

---

## 4. Key Features Implemented

1. **Dynamic Service Variants & Exact MAD Pricing (`src/lib/pricing.ts`)**
   - Supports any digital product structure (PlayStation Plus tiers, PS4/PS5 Primary & Secondary games, Xbox Game Pass durations, individual music/streaming subscriptions) using flexible `JSONB` attributes (`platform`, `tier`, `access_type`, `duration`, `edition`).
   - All prices are stored as whole Moroccan Dirhams (`price_mad`, `compare_at_mad`).
   - Irrelevant selectors (such as `Primary` / `Secondary` on music or streaming plans) are automatically hidden when a service does not use them.
   - Unavailable combinations are visibly marked and never invent or guess prices.

2. **Clean-URL Multilingual & Moroccan Darija RTL System (`src/i18n/`)**
   - Customer storefront supports **Français (`fr`)**, **Moroccan Darija (`ar`)**, and **English (`en`)**.
   - **Natural Moroccan Darija** written in Arabic script (`مرحبا بيك فـ NovaStream`, `شوف الخدمات`, `طلب عبر واتساب`, `برايمري`, `سيكندري`).
   - Full Right-to-Left (`dir="rtl"`) layout support with the `Cairo` Arabic font and directional isolation for prices, SKUs, and phone numbers.
   - Switching languages updates the `NEXT_LOCALE` cookie and refreshes the page **without changing the browser URL** (`/`, `/services`, `/services/[slug]`).
   - Fallback chain for database content: `Requested Locale → French ('fr') → English ('en')`.

3. **WhatsApp Customer Ordering (`src/lib/whatsapp.ts`)**
   - Generates localized pre-filled WhatsApp inquiry links (`https://wa.me/{phone}?text=...`) containing the service title, selected variant options, SKU code, exact MAD price (`DH` / `درهم`), and page URL.
   - The business WhatsApp number is configurable directly from `/admin/settings`.

4. **Private Administration Dashboard (`/admin`)**
   - Protected by Supabase Auth + explicit `public.admin_profiles` table check (`role IN ('owner', 'admin')` and `is_active = true`).
   - Full CRUD for **Services** (`/admin/services/new`, `/admin/services/[id]`, plus direct **Delete** button in the `/admin` table), **Categories** (`/admin/categories`), **Product Images** (`service-images` storage bucket), and **Website Settings** (`/admin/settings`).
   - Built-in **Local Seed Mode** (`src/lib/data/mock-data.ts`) allows running and testing the entire storefront and `/admin` dashboard locally before connecting a live Supabase project.

5. **Supabase Security & Row Level Security (`supabase/migrations/`)**
   - Versioned SQL migrations in [`supabase/migrations/0001_initial_schema.sql`](./supabase/migrations/0001_initial_schema.sql) and [`supabase/migrations/0002_seed_catalog.sql`](./supabase/migrations/0002_seed_catalog.sql).
   - Row Level Security (`RLS`) enabled on all 5 tables (`admin_profiles`, `categories`, `services`, `service_variants`, `site_settings`) plus `storage.objects` policies for the `service-images` bucket.
   - `public.is_admin()` `SECURITY DEFINER` helper function verifies admin permissions safely.

---

## 5. Quick Start (Local Development)

```bash
# 1. Navigate to the project folder
cd /home/drs0/Projects/novastream

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

- **Public Storefront:** Open `http://localhost:3000`
- **Admin Dashboard:** Open `http://localhost:3000/admin` (or `http://localhost:3000/admin/login`)

> **Local Seed Mode vs. Live Supabase Mode:**  
> If `.env.local` still has the placeholder values from `.env.example`, NovaStream automatically runs in **Local Seed Mode** using realistic Moroccan catalog data from `src/lib/data/mock-data.ts`. To connect a real Supabase database, follow **[02 — Getting Started (`docs/02-getting-started.md`)](./docs/02-getting-started.md)**.

---

## 6. Environment Variables (`.env.local`)

Only variable names are listed below (never commit actual keys to Git):

| Variable Name | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for live DB) | Your Supabase project URL (`https://<project-ref>.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes (for live DB) | Your Supabase public anon/publishable key (protected by RLS) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Base URL of the site (`http://localhost:3000` locally or your production domain) |
| `NEXT_PUBLIC_DEFAULT_WHATSAPP` | Optional | Fallback WhatsApp number in international digits (`212600000000`) |

---

## 7. Available npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the local Next.js development server on `http://localhost:3000` |
| `npm run build` | Compiles and validates the production Next.js application |
| `npm run start` | Runs the compiled production server locally |
| `npm test` | Runs all automated unit test suites with Vitest (`src/tests/*.test.ts`) |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run typecheck` | Runs TypeScript (`tsc --noEmit`) to check all types |
| `npm run lint` | Runs ESLint across the codebase |

---

## 8. Deployment Overview

Because NovaStream is a commercial storefront, **do not use Vercel Hobby** (which is restricted to non-commercial personal use).

- **Recommended Hosting:** **Netlify Free** (configured via [`netlify.toml`](./netlify.toml)).
- **Alternative Hosting:** **Cloudflare Pages** (`@cloudflare/next-on-pages`).

For complete step-by-step deployment instructions, see **[`docs/12-deployment.md`](./docs/12-deployment.md)** and [`DEPLOYMENT.md`](./DEPLOYMENT.md).
