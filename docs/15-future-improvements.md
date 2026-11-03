# 15 — Future Improvements & Roadmap

This document provides an honest, transparent look at **NovaStream's** current implementation status. It separates features into:
1. **Partially Implemented Features** (areas where the database or UI foundation exists, and small enhancements will complete the loop).
2. **Recommended Technical & Security Enhancements** (high-value improvements to reliability, testing, and operations).
3. **Optional Future Product Features** (larger business expansions when NovaStream grows).

> **Important Note:** None of the items below are claimed as already finished. This roadmap helps any developer returning to the project know exactly what is complete today and what can be built next.

---

## 1. Partially Implemented Features (Quick Wins to Complete)

During the codebase review, the following three areas were identified as partially implemented:

### 1.1 Deleting Orphaned Files from Supabase Storage (`ImageUploader.tsx`)

- **What works today:**
  - In `src/components/admin/ImageUploader.tsx`, admins can upload `jpeg`, `png`, `webp`, and `avif` images to the Supabase Storage bucket `service-images`.
  - Clicking **Set primary** changes `primary_image` to the selected URL.
  - Clicking **Remove** removes the image URL from the service's `gallery_paths` array in the database.
- **What is missing:**
  - Clicking **Remove** updates the form state (and database row on save), but does not call `supabase.storage.from('service-images').remove([storagePath])` to delete the underlying image file from the `service-images` storage bucket.
- **Recommended improvement:**
  - Extract the relative bucket path (e.g., `services/<timestamp>-<filename>.webp`) from the public URL and call `supabase.storage.from('service-images').remove([path])` inside a Server Action after confirming no other service references that image.

### 1.2 Editable Homepage Hero Banner & Footer Copyright in `/admin/settings`

- **What works today:**
  - The `site_settings` table in PostgreSQL (`supabase/migrations/0001_initial_schema.sql`) includes a `hero_banner` JSON key (`{"enabled": true, "badge_en": "Instant WhatsApp Delivery", ...}`).
  - The `/admin/settings` page (`src/components/admin/SettingsFormClient.tsx` and `saveSettingsAction` in `src/app/admin/actions.ts`) allows the admin to edit:
    - WhatsApp Business Number
    - Support Email
    - Support Hours
    - Default Language (`en` / `fr` / `ar`)
    - Instagram, Facebook, and TikTok URLs
- **What is missing:**
  - The homepage hero title, subtitle, and footer copyright text are currently read from the static translation files (`src/i18n/messages/en.json`, `fr.json`, `ar.json`) rather than editable fields in `/admin/settings`.
- **Recommended improvement:**
  - Add inputs to `SettingsFormClient.tsx` for the `hero_banner` promotional badge (`badge_en`, `badge_fr`, `badge_ar`) and wire `src/app/(storefront)/page.tsx` to display the dynamic banner from `site_settings.hero_banner` when `enabled` is `true`.

### 1.3 Service & Category Reordering UX (`sort_order`)

- **What works today:**
  - Both `categories` and `services` have a `sort_order` integer column in PostgreSQL, and queries sort by `sort_order ASC`.
  - Admins can set the `sort_order` number when creating or editing a service or category.
- **What is missing:**
  - There are no quick Up/Down arrow buttons or drag-and-drop handles directly inside the `/admin` Services table or `/admin/categories` table to reorder items without opening the edit form.
- **Recommended improvement:**
  - Add quick `↑` / `↓` buttons or drag-and-drop row reordering in `src/app/admin/page.tsx` and `src/components/admin/CategoryManagerClient.tsx` that swap `sort_order` values via a Server Action.

---

## 2. Recommended Technical & Security Enhancements

### 2.1 End-to-End (E2E) Browser Tests with Playwright

- **Current state:**
  - Unit tests (`src/tests/*.test.ts`) run with Vitest and test pricing calculations, variant attribute matrices, WhatsApp message formatting, and Zod validation schemas.
- **Future improvement:**
  - Add Playwright E2E tests that spin up the Next.js server and test full browser flows automatically:
    - Switching languages (`English`, `Français`, `الدارجة`) and verifying `dir="rtl"` and clean URLs.
    - Filtering services on `/services` and selecting variant pills on `/services/[slug]`.
    - Signing in at `/admin/login`, creating a service, and deleting a service.

### 2.2 Client-Side Image Resizing Before Upload

- **Current state:**
  - `ImageUploader.tsx` enforces a 5 MB file size limit and checks MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).
- **Future improvement:**
  - Use the browser's HTML5 `<canvas>` API inside `ImageUploader.tsx` to automatically resize large images (e.g., max width `1200px`) and convert them to `.webp` before uploading to Supabase Storage. This will keep the 1 GB free Supabase Storage quota lasting much longer.

### 2.3 Audit Log for Admin Actions

- **Current state:**
  - Database rows track `created_at` and `updated_at` timestamps.
- **Future improvement:**
  - If NovaStream adds multiple admin staff members in the future, create an `admin_audit_logs` table that records which admin user (`auth.uid()`) created, updated, or deleted a service or price.

---

## 3. Optional Future Product Features (When the Business Grows)

NovaStream was intentionally designed as a lean, zero-monthly-cost storefront that closes orders via WhatsApp. As order volume grows, you can consider these optional expansions:

| Feature Idea | Description | Complexity |
|---|---|---|
| **WhatsApp Inquiry Click Tracking** | Record an anonymous row in an `order_inquiries` table whenever a customer clicks "Order on WhatsApp" so the admin can see which services and variants are requested most often. | Low |
| **Multi-Item Shopping Cart for WhatsApp** | Allow customers to add 2 or 3 services/variants into a temporary cart (`localStorage`) and send a single combined WhatsApp order message with the total MAD price. | Medium |
| **Promo Codes / Discount Badges** | Allow admins to create temporary discount codes (e.g., `RAMADAN10`) that calculate the discounted MAD price and include the promo code in the WhatsApp order message. | Medium |
| **Inventory / Code Vault Management** | Store pre-purchased digital voucher codes in a private admin-only table so staff can mark codes as "Sold" right from `/admin`. | Medium–High |
| **Online Payment Gateway (CMI / Stripe / PayPal)** | Accept online card payments in Morocco alongside WhatsApp cash/bank-transfer orders. Requires business registration and payment processor approval. | High |

---

## Next Step

Continue to the **[Glossary](./glossary.md)** for clear, beginner-friendly definitions of all technical terms used across this documentation.

