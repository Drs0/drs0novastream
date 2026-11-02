# 12 — Deployment

[← 11 — WhatsApp Integration](./11-whatsapp-integration.md) | [Back to Index](./README.md) | [Next: 13 — Troubleshooting →](./13-troubleshooting.md)

---

## 1. Important Commercial Hosting Rule

NovaStream is a commercial storefront.
- **Do NOT use Vercel Hobby** for the live commercial website, because Vercel's Hobby plan terms restrict it to personal, non-commercial use.
- **Recommended Free Host:** **Netlify Free** (which supports Next.js App Router Server Components and Server Actions and allows commercial projects within its free tier quotas).
- **Alternative Host:** **Cloudflare Pages** (see Section 5 below for static export vs. worker requirements).
- If the business grows later, the codebase is standard Next.js 16 and can be deployed to a paid Vercel Pro plan or any Node.js server without code changes.

---

## 2. Required Environment Variables

Whether deploying on Netlify or another Next.js host, configure these three environment variables in your hosting dashboard:

| Variable Name | Example Format | Required? | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Yes | Your Supabase project URL (found in Supabase → Project Settings → API). |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` | Yes | Your Supabase `anon` / public publishable key. (Code also accepts `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a fallback in [`src/lib/supabase/config.ts`](../src/lib/supabase/config.ts)). |
| `NEXT_PUBLIC_SITE_URL` | `https://novastream.netlify.app` | Yes | Your public website domain (without a trailing slash), used by [`src/lib/seo.ts`](../src/lib/seo.ts), `/sitemap.xml`, and `/robots.txt`. |

> **Security Warning:** Never add your Supabase `service_role` secret key or PostgreSQL database password to `NEXT_PUBLIC_*` environment variables.

---

## 3. Step-by-Step Supabase Production Setup

1. Create a new project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard and execute:
   - [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql)
   - [`supabase/migrations/0002_localization.sql`](../supabase/migrations/0002_localization.sql)
   - [`supabase/seed.sql`](../supabase/seed.sql) *(optional, if you want the initial 6 categories and 5 published services pre-loaded)*
3. Go to **Authentication → Users** and click **Add user → Create new user** to create your administrator login.
4. Copy the user's `UUID` and run this command in the **SQL Editor**:
   ```sql
   INSERT INTO public.admin_users (user_id)
   VALUES ('YOUR-ADMIN-USER-UUID');
   ```
5. Verify in **Storage** that the `service-images` bucket was created and is marked `Public`.

---

## 4. Step-by-Step Deployment on Netlify Free

1. **Push your code to GitHub:**
   ```bash
   cd /home/drs0/Projects/novastream
   git init
   git add .
   git commit -m "Initial NovaStream v1.2 release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/novastream.git
   git push -u origin main
   ```
   *(Make sure `.env.local` is not committed—it is already listed in [`.gitignore`](../.gitignore).)*

2. **Connect GitHub to Netlify:**
   - Log in to [https://app.netlify.com](https://app.netlify.com).
   - Click **Add new site → Import an existing project → GitHub** and choose your `novastream` repository.

3. **Verify Build Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next` (Netlify automatically detects Next.js and enables its Next.js runtime).

4. **Add Environment Variables:**
   - Before clicking Deploy, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` under **Environment variables**.

5. **Post-Deployment Checklist:**
   - Open your live Netlify URL (`/`).
   - Switch between **Français**, **الدارجة**, and **English** in the header and confirm the language changes and RTL layout activates for الدارجة.
   - Open a service page (`/services/playstation-plus`), click different variants, and verify the WhatsApp button opens `wa.me` with the right price.
   - Log in at `/admin/login`, update your WhatsApp number in `/admin/settings`, and test uploading an image.

---

## 5. Cloudflare Pages Alternative (Important Limitations)

If you want to host on **Cloudflare Pages**:
- NovaStream uses Next.js Server Components (`cookies()` for reading the `NEXT_LOCALE` language cookie and Supabase Auth session cookies) and Server Actions (`src/app/admin/actions.ts` and `src/i18n/actions.ts`).
- Therefore, **pure static export (`output: 'export'`) is NOT compatible** without removing Server Actions and cookie-based server rendering.
- If you deploy to Cloudflare, you must either use Cloudflare's OpenNext Worker adapter (`@opennextjs/cloudflare`) for SSR support, or use **Netlify Free**, which supports Next.js Server Components and Server Actions out of the box.

