# NovaStream — Zero-Cost Commercial Deployment Guide

This guide explains how to deploy **NovaStream** on **0 MAD/month** infrastructure while respecting commercial-use terms.

> **Important Hosting Note:** Do not deploy the live commercial storefront on Vercel Hobby (which is restricted to non-commercial personal use). Use **Netlify Free** as the primary commercial-friendly deployment target, or **Cloudflare Pages** (with documented static/edge considerations), and keep the codebase portable for future upgrades.

---

## Step 1 — Supabase Free Project Setup

1. Create a new project at [https://supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the migrations in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_localization.sql`
   - (Optional initial catalog) `supabase/seed.sql`
3. Verify in **Database → Policies** that Row Level Security (RLS) is active on all 7 tables:
   - `admin_users`
   - `categories`
   - `category_translations`
   - `services`
   - `service_translations`
   - `service_variants`
   - `site_settings`
4. Verify in **Storage** that the public bucket `service-images` exists with its 5 MB limit and MIME-type restrictions (`image/webp`, `image/avif`, `image/png`, `image/jpeg`).

---

## Step 2 — Create & Allowlist Your Admin User

Public sign-up is disabled for the admin dashboard. To authorize yourself:

1. In Supabase Dashboard → **Authentication → Users**, click **Add user → Create new user** with your admin email and strong password.
2. Copy the newly created user's `UUID`.
3. In the **SQL Editor**, add that UUID to the explicit `admin_users` allowlist:

```sql
INSERT INTO public.admin_users (user_id)
VALUES ('YOUR-ADMIN-USER-UUID-HERE');
```

Only users present in `public.admin_users` pass `public.is_admin()` and can access `/admin` or mutate database/storage records.

---

## Step 3 — Environment Variables

Configure the following environment variables in `.env.local` (and in Netlify site settings):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
```

**Security Rule:** Never place your Supabase `service_role` secret key or database password in `NEXT_PUBLIC_*` or client-accessible environment variables.

---

## Step 4 — Deploying on Netlify Free (Recommended)

1. Push the repository to a private **GitHub** repository.
2. Log in to [Netlify](https://app.netlify.com) and click **Add new site → Import an existing project**.
3. Select your GitHub repository.
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (handled automatically by `@netlify/plugin-nextjs` on Netlify)
5. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` under **Site configuration → Environment variables**.
6. Deploy and verify:
   - `/` redirects to `/fr`
   - `/fr`, `/ar` (RTL Darija), and `/en` load localized catalog content
   - `/admin/login` authenticates your allowlisted admin user
   - WhatsApp ordering buttons open prefilled `https://wa.me/...` inquiries in the active language.

---

## Step 5 — Cloudflare Pages Alternative (Static Export Considerations)

If you choose to deploy on **Cloudflare Pages** as a pure static export (`output: 'export'`):
- Dynamic server functions (`cookies()`, Server Actions in `/admin`, and on-demand dynamic routes created after build time) are not supported in pure static export without Cloudflare Workers (`@opennextjs/cloudflare`) or client-only Supabase calls.
- Newly added service slugs in static export mode require triggering a site rebuild via a Supabase Database Webhook → Cloudflare Deploy Hook so static HTML and localized SEO metadata are generated for the new slug.
- Therefore, **Netlify Free** (with Next.js SSR support) is strongly preferred for dynamic service SEO and seamless `/admin` management.

