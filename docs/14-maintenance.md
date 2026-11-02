# 14 — Maintenance Guide

This guide explains how to maintain **NovaStream** over time—including updating packages, backing up your database, creating database migrations, modifying UI components safely, and adding new translations.

---

## 1. Before You Make Any Code Changes

Whenever you return to the project after a few weeks or months, always run the baseline health check first to make sure your local environment is clean and working:

```bash
cd /home/drs0/Projects/novastream

# 1. Run automated unit tests (Vitest)
npm test

# 2. Check TypeScript types across the entire project
npm run typecheck

# 3. Run ESLint code quality checks
npm run lint
```

If all three commands pass with 0 errors, you have a clean starting point.

---

## 2. Updating Dependencies Safely

Software packages (like Next.js, React, and Supabase libraries) receive regular security and performance updates.

### Step 1 — Check for outdated packages

Run:

```bash
npm outdated
```

This prints a table showing:
- **Current:** The version currently installed in `node_modules/`.
- **Wanted:** The newest version that matches the version range in `package.json` (safe minor/patch updates).
- **Latest:** The absolute latest version available on npm (which may include major breaking changes).

### Step 2 — Apply safe minor and patch updates

To update packages to their **Wanted** versions without breaking changes:

```bash
npm update
```

### Step 3 — Check for security vulnerabilities

Run:

```bash
npm audit
```

If safe fixes are available, run:

```bash
npm audit fix
```

> **Warning:** Avoid running `npm audit fix --force` automatically, because `--force` can upgrade packages across major versions and introduce breaking changes. Always test major upgrades one package at a time.

### Step 4 — Verify the project after updating

After any dependency update, run the full verification suite:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Only commit `package.json` and `package-lock.json` if all four commands succeed.

---

## 3. Backing Up the Supabase Database & Storage

Even though Supabase manages the PostgreSQL server in the cloud, keeping your own backups of your catalog data is an important safety practice.

### Method A — Quick JSON/CSV Export from Supabase Table Editor

For a quick backup before editing many services:
1. Open the **Supabase Dashboard** → **Table Editor**.
2. Select the table (`categories`, `services`, `service_variants`, `site_settings`).
3. Click **Export to CSV** in the top bar and save the files to a safe backup folder on your computer.

### Method B — Full PostgreSQL Dump (`pg_dump` or Supabase CLI)

To back up the entire database schema and data:

1. In the Supabase Dashboard, go to **Project Settings → Database** and copy your connection string.
2. Run `pg_dump` from your terminal (replace `<CONNECTION_STRING>` with your database URI):

```bash
pg_dump "<CONNECTION_STRING>" \
  --schema=public \
  --file="novastream_backup_$(date +%Y%m%d).sql"
```

### Backing Up Product Images

All uploaded service images live in the **`service-images`** bucket in Supabase Storage.
- Keep a local folder of your original product artwork (`webp` / `png` / `jpg` files) organized by service slug.
- You can also download files directly from **Supabase Dashboard → Storage → `service-images`**.

---

## 4. Creating New Database Migrations

Never change production database tables without recording the SQL in `supabase/migrations/`. Keeping SQL migrations in Git ensures you can always recreate your database from scratch.

### How to add a migration

1. Create a new numbered SQL file inside `supabase/migrations/`:
   - Existing files:
     - `0001_initial_schema.sql`
     - `0002_seed_catalog.sql`
   - Name your new file `0003_<short_description>.sql` (for example, `0003_add_service_promo_label.sql`).
2. Write idempotent SQL (using `IF NOT EXISTS` where possible):

```sql
-- supabase/migrations/0003_add_service_promo_label.sql
alter table public.services
  add column if not exists promo_label_en text,
  add column if not exists promo_label_fr text,
  add column if not exists promo_label_ar text;
```

3. Test and run the SQL in the **Supabase SQL Editor**.
4. Update the TypeScript types and data mappers to match:
   - `src/types/database.ts` — Add the new field to the TypeScript interface.
   - `src/lib/validation/admin.ts` — Add the new field to the Zod validation schema.
   - `src/lib/data/repository.ts` — Map the new column in `mapServiceRow()` and include it in `upsertService()`.
   - `src/lib/data/mock-data.ts` — Provide a default value in the local seed catalog.

---

## 5. Safely Modifying Components and SCSS Styles

### Component Organization Rules

1. **Keep styling in SCSS Modules (`*.module.scss`):**
   - Every component in `src/components/` has a paired `.module.scss` file.
   - Do not install or use Tailwind CSS.
   - Use the shared variables in `src/styles/_variables.scss` and mixins in `src/styles/_mixins.scss` so colors, spacing, and breakpoints remain consistent.
2. **Test RTL (Arabic / Moroccan Darija) layout whenever you change CSS:**
   - Switch the website language to **الدارجة** (`ar`) in the header.
   - Check that margins, padding, icons, and text alignment look balanced in Right-to-Left (`dir="rtl"`) mode.
   - Prefer CSS logical properties (`margin-inline-start`, `padding-inline`, `text-align: start`) or `[dir="rtl"] &` selectors over hardcoded `left` and `right` values where direction matters.
3. **Keep Server vs. Client boundaries clean:**
   - Do not import server-only modules (`next/headers`, `@/lib/supabase/server`) inside files marked with `'use client'`.
   - Keep `src/i18n/routing.ts` free of client hooks (`usePathname`, `useRouter`) so Server Components can safely import `<Link>`.

---

## 6. Adding New UI Text and Translations

Whenever you add a new button, label, or heading to a component:

1. **Never hardcode English text directly in JSX** if customers will see it.
2. Add the translation key to **all three** message files at the same time:
   - `src/i18n/messages/en.json` (English)
   - `src/i18n/messages/fr.json` (French)
   - `src/i18n/messages/ar.json` (Moroccan Darija in Arabic script)
3. Verify that all three JSON files have valid syntax (no trailing commas) by running `npm run build`.

---

## 7. Pre-Release Maintenance Checklist

Before pushing any new feature or maintenance update to GitHub (which deploys to Netlify or Cloudflare Pages), verify:

- [ ] `npm test` passes all unit tests.
- [ ] `npm run typecheck` reports 0 TypeScript errors.
- [ ] `npm run lint` reports 0 ESLint warnings or errors.
- [ ] `npm run build` completes a full production build without errors.
- [ ] All new UI labels exist in `en.json`, `fr.json`, and `ar.json`.
- [ ] Any database schema change has a matching `.sql` file in `supabase/migrations/` and updated RLS policies if a new table was added.

---

## Next Step

Continue to **[15 — Future Improvements](./15-future-improvements.md)** for a transparent review of partially implemented areas and planned roadmap features.

