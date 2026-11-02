# 13 — Troubleshooting

[← 12 — Deployment](./12-deployment.md) | [Back to Index](./README.md) | [Next: 14 — Maintenance →](./14-maintenance.md)

---

## 1. Quick Troubleshooting Table

The table below lists real issues you might encounter while running, editing, or deploying NovaStream, why they happen, and how to fix them:

| Problem | Possible Cause | How to Fix |
|---|---|---|
| **Admin header says `Seed / Local Dev Mode` even after creating `.env.local`** | `.env.local` still contains the placeholder URL (`YOUR_PROJECT.supabase.co`) or `npm run dev` was not restarted after editing `.env.local`. | Replace `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` with your real Supabase keys, then stop (`Ctrl+C`) and restart `npm run dev`. |
| **Admin login says `Access denied: Your account is not authorized in the admin_users allowlist`** | Your user exists in Supabase `auth.users`, but its UUID has not been added to `public.admin_users`. | Open Supabase Dashboard → Authentication → Users, copy your User UID, and run `INSERT INTO public.admin_users (user_id) VALUES ('YOUR-UID');` in the SQL Editor. |
| **Image upload in `/admin` fails with `new row violates row-level security policy`** | You are logged in as a user who is not in `public.admin_users`, or the storage policies in `0001_init.sql` were not applied. | Re-run the storage policy section of [`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql) and confirm `SELECT public.is_admin();` returns `true` for your user. |
| **Image upload fails with `Invalid file extension` or `Unsupported image MIME type`** | You tried to upload an SVG, GIF, BMP, or a file larger than `5 MB`. | Convert the image to `.webp`, `.avif`, `.png`, or `.jpg` under `5 MB` (validated by [`validateImageUpload`](../src/lib/validations/catalog.ts)). |
| **Saving a service fails with `variants: At least one valid variant is required before publishing`** | You set **Publication Status** to `Published` while the Variants list is empty. | Either click **Add Variant** and add at least one valid option, or change **Publication Status** to `Draft (Private)` until you know the price. |
| **Saving a service fails with `sale_price_mad: Sale price must be strictly lower than regular price`** | A variant's `Sale Price (MAD)` is equal to or higher than its regular `Price (MAD)`. | Clear the `Sale Price (MAD)` input (if there is no discount) or set it to a number lower than `Price (MAD)`. |
| **Saving a service fails with `Duplicate variant option combination is forbidden`** | Two variants on the same service have the exact same Platform, Edition, Tier, Duration, and Access Type. | Change one of the options (e.g., `Primary` vs. `Secondary` or `PS4` vs. `PS5`) or delete the duplicate variant row. |
| **Deleting a category fails with `Cannot delete category while services are still assigned to it`** | The PostgreSQL foreign key `services.category_id REFERENCES categories(id) ON DELETE RESTRICT` prevents orphaning services. | Reassign or delete the services in that category first, or simply uncheck **Active on Public Storefront** on the category instead of deleting it. |
| **A newly created service does not appear on `/services`** | Either the service's status is still `Draft (Private)`, or its parent category is marked `Inactive`. | Edit the service in `/admin`, set **Publication Status** to `Published`, and ensure its category is `Active` in `/admin/categories`. |
| **`npm run typecheck` fails with `.next/types/validator.ts: Cannot find module ...` after renaming or deleting a route** | Next.js cached old route type definitions inside `.next/types/`. | Delete the `.next` folder (`rm -rf .next` in WSL) and run `npm run typecheck` or `npm run build` again. |
| **Next.js image optimization error for an external image URL** | Next.js `<Image>` or configuration restricts external domains unless listed in `next.config.ts`. | Storefront components use standard `<img>` tags for flexible paths, or you can add your domain to `images.remotePatterns` in [`next.config.ts`](../next.config.ts). |

