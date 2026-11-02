# 02 — Getting Started

[← 01 — Project Overview](./01-project-overview.md) | [Back to Index](./README.md) | [Next: 03 — Project Architecture →](./03-project-architecture.md)

---

## 1. Prerequisites

Before running NovaStream on your computer, make sure you have:

1. **Node.js (v20 or v22 recommended)** and **npm** installed.
   - In this workspace, Node.js (`v22.22.1`) and npm (`9.2.0`) are installed inside **WSL (Windows Subsystem for Linux — Ubuntu)**.
2. **Git** (optional, for version control).
3. **A Supabase account** (optional for local development, required for production).
   - *Why is Supabase optional locally?* NovaStream includes a **Local Seed / Demo Mode**. If you do not configure Supabase credentials yet, the website still runs using realistic sample data stored in memory (`src/lib/catalog/seed-data.ts`).

---

## 2. Step-by-Step Local Installation

Open your WSL Ubuntu terminal and run these commands:

### Step 1: Navigate to the project folder

```bash
cd /home/drs0/Projects/novastream
```

### Step 2: Install npm dependencies

```bash
npm install
```

This reads [`package.json`](../package.json) and downloads Next.js, React, `next-intl`, Supabase libraries, Sass, and Zod into the `node_modules/` folder.

### Step 3: Create your `.env.local` file

Copy the example environment file [`.env.example`](../.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

Let's look at what is inside `.env.example`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- **What is an Environment Variable?** An environment variable is a setting stored outside the source code (in `.env.local`) so that each environment (your laptop vs. production hosting) can connect to its own database URL without hardcoding keys in TypeScript files.
- **If you leave the placeholder values (`YOUR_PROJECT.supabase.co`):** [`getSupabaseEnv()`](../src/lib/supabase/config.ts) detects that Supabase is not configured yet and runs the app in **Local Seed Mode**.

---

## 3. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Once it starts, open your browser:

- **Public Storefront:** `http://localhost:3000`
- **Services Catalog:** `http://localhost:3000/services`
- **Service Detail Example:** `http://localhost:3000/services/playstation-plus`
- **Admin Login:** `http://localhost:3000/admin/login`
- **Admin Dashboard:** `http://localhost:3000/admin`

### How to Log In to `/admin` in Local Seed Mode

When `.env.local` still has placeholder Supabase values, the header in `/admin` shows a yellow badge:
`Seed / Local Dev Mode (Configure .env.local for live Supabase DB)`

In this mode, you can test the entire Admin Dashboard using the local demo credentials defined in [`src/lib/supabase/auth.ts`](../src/lib/supabase/auth.ts) and [`src/app/admin/actions.ts`](../src/app/admin/actions.ts):

- **Email:** `admin@novastream.ma`
- **Password:** `NovaStreamAdmin2026!`

*(Note: Any changes you make in Local Seed Mode are saved in the Node.js server memory until you restart `npm run dev`.)*

---

## 4. Connecting a Real Supabase Project

When you are ready to connect a real PostgreSQL database:

1. Create a free project at [https://supabase.com](https://supabase.com).
2. In your Supabase Dashboard, open **SQL Editor** and run these three files in order:
   1. [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) — Creates core tables, constraints, triggers, RLS policies, and the `service-images` storage bucket.
   2. [`supabase/migrations/0002_localization.sql`](../supabase/migrations/0002_localization.sql) — Creates `category_translations` and `service_translations` with RLS policies.
   3. [`supabase/seed.sql`](../supabase/seed.sql) — Inserts initial categories, services, variants, and translations.
3. In Supabase Dashboard → **Authentication → Users**, click **Add user → Create new user** and create your admin account (email + password).
4. Copy your new user's `UUID` and run this SQL query in the **SQL Editor** to add yourself to the admin allowlist:
   ```sql
   INSERT INTO public.admin_users (user_id)
   VALUES ('PASTE-YOUR-USER-UUID-HERE');
   ```
5. In Supabase Dashboard → **Project Settings → API**, copy your **Project URL** and **anon / public key** into `.env.local`:
   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
6. Restart `npm run dev`. The admin header badge will now turn green: `Supabase Connected + RLS Active`.

---

## 5. Available npm Commands

All scripts are defined in [`package.json`](../package.json):

| Command | What It Does | When to Run It |
|---|---|---|
| `npm run dev` | Starts the local development server on `http://localhost:3000` with hot reloading. | Every day while coding or testing locally. |
| `npm test` | Runs the 12 automated test suites in [`src/__tests__/run-tests.ts`](../src/__tests__/run-tests.ts). | After changing pricing, translations, WhatsApp formatting, or validation rules. |
| `npm run typecheck` | Runs `tsc --noEmit` to check all TypeScript files for type errors. | Before committing code or building for production. |
| `npm run lint` | Runs ESLint (`eslint.config.mjs`) to check for code quality and React rules. | Before committing code. |
| `npm run build` | Compiles an optimized production build inside `.next/`. | Before deploying to Netlify or production. |
| `npm start` | Starts the compiled production server (requires `npm run build` first). | To test the production build locally. |

