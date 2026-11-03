# 04 — Frontend Components

[← 03 — Project Architecture](./03-project-architecture.md) | [Back to Index](./README.md) | [Next: 05 — Database →](./05-database.md)

---

## 1. Quick Introduction to Component Terms

If you are newer to React, here are the four terms used in this guide:
- **Component:** A reusable building block of the user interface (like a button, header, or product card).
- **Props (Properties):** Inputs passed from a parent component into a child component (similar to function arguments).
- **State (`useState`):** Data that changes over time inside a Client Component (for example, whether the mobile menu is open, or which platform button the user clicked).
- **Hooks (`useMemo`, `useEffect`, `useTranslations`):** Special React functions that let components remember state, run side effects, or read translations.

---

## 2. Layout Components (`src/components/layout/`)

### 2.1 `SiteHeader`
- **File:** [`src/components/layout/SiteHeader.tsx`](../src/components/layout/SiteHeader.tsx)
- **Styles:** [`src/components/layout/SiteHeader.module.scss`](../src/components/layout/SiteHeader.module.scss)
- **Type:** Client Component (`'use client'`)
- **Purpose:** Renders the sticky top navigation bar with the extracted neon NovaStream logo (`/logo.png`), navigation links (`Home`, `Services`, `Categories`, `About`, `Contact`), the `LanguageSwitcher`, and a mobile drawer menu.
- **Props:** None.
- **State & Hooks:**
  - `mobileOpen` (`useState<boolean>`): Tracks whether the mobile navigation drawer is open on small screens.
  - `pathname` (`usePathname()`): Highlights the currently active navigation link.
  - `t` (`useTranslations('nav')`): Reads localized link labels.
- **Where it is used:** [`src/app/(storefront)/layout.tsx`](../src/app/(storefront)/layout.tsx).
- **How to modify safely:** To add a new top-level navigation link, add its translation key to `nav` in `en.json`, `fr.json`, and `ar.json`, then append an object `{ href: '/your-path', label: t('yourKey') }` to the `links` array in `SiteHeader.tsx`.

---

### 2.2 `LanguageSwitcher`
- **File:** [`src/components/layout/LanguageSwitcher.tsx`](../src/components/layout/LanguageSwitcher.tsx)
- **Styles:** [`src/components/layout/LanguageSwitcher.module.scss`](../src/components/layout/LanguageSwitcher.module.scss)
- **Type:** Client Component (`'use client'`)
- **Purpose:** Displays the pill selector (`English | Français | الدارجة`) in the header.
- **Props:** None.
- **State & Hooks:**
  - `currentLocale` (`useLocale()`): Gets the active language (`'en'`, `'fr'`, or `'ar'`).
  - `isPending, startTransition` (`useTransition()`): Prevents UI freezing while updating the language cookie.
- **Important Function (`handleSelectLocale`):**
  ```typescript
  function handleSelectLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale) return;
    startTransition(async () => {
      await setLocaleCookieAction(nextLocale);
      router.refresh();
    });
  }
  ```
  1. Checks if the clicked language is already active.
  2. Calls the Server Action [`setLocaleCookieAction(nextLocale)`](../src/i18n/actions.ts) to save `NEXT_LOCALE` for 1 year.
  3. Calls `router.refresh()` so Next.js re-renders the current page in the new language **without changing the browser URL**.

---

### 2.3 `LocaleDocumentSync`
- **File:** [`src/components/layout/LocaleDocumentSync.tsx`](../src/components/layout/LocaleDocumentSync.tsx)
- **Type:** Client Component (`'use client'`)
- **Purpose:** Keeps `<html lang="..." dir="...">` synchronized immediately in the browser DOM whenever the user switches between LTR (`en`, `fr`) and RTL (`ar` Moroccan Darija).
- **Props:** `{ locale: Locale }`.

---

### 2.4 `SiteFooter`
- **File:** [`src/components/layout/SiteFooter.tsx`](../src/components/layout/SiteFooter.tsx)
- **Styles:** [`src/components/layout/SiteFooter.module.scss`](../src/components/layout/SiteFooter.module.scss)
- **Type:** Server-compatible Component
- **Purpose:** Displays the brand summary, social media links (Instagram, Facebook, TikTok), quick navigation links, legal links (Privacy, Terms), contact details (WhatsApp phone, email, support hours), and a link to `/admin`.
- **Props:** `{ settings: PublicSiteSettings }`.

---

## 3. Storefront Components (`src/components/storefront/`)

### 3.1 `HeroSection`
- **File:** [`src/components/storefront/HeroSection.tsx`](../src/components/storefront/HeroSection.tsx)
- **Styles:** [`src/components/storefront/HeroSection.module.scss`](../src/components/storefront/HeroSection.module.scss)
- **Purpose:** Renders the homepage banner with a welcome badge, headline, description, primary CTA (`View services` → `/services`), and secondary CTA (`Contact us` → prefilled general WhatsApp chat).
- **Props:** `{ locale: Locale; whatsappNumber: string }`.
- **Where it is used:** Homepage ([`src/app/(storefront)/page.tsx`](../src/app/(storefront)/page.tsx)).

---

### 3.2 `CategoryGrid` & `CategoryCard`
- **Files:** [`src/components/storefront/CategoryGrid.tsx`](../src/components/storefront/CategoryGrid.tsx) and [`src/components/storefront/CategoryCard.tsx`](../src/components/storefront/CategoryCard.tsx)
- **Styles:** [`src/components/storefront/CategoryGrid.module.scss`](../src/components/storefront/CategoryGrid.module.scss)
- **Purpose:** Renders a responsive 3-column grid of active categories fetched from Supabase (or seed data). Each card links to `/categories/[slug]`.
- **Props:**
  - `CategoryGrid`: `{ categories: LocalizedCategory[]; showHeader?: boolean }`
  - `CategoryCard`: `{ category: LocalizedCategory }`

---

### 3.3 `FeaturedServices` & `ServiceCard`
- **Files:** [`src/components/storefront/FeaturedServices.tsx`](../src/components/storefront/FeaturedServices.tsx) and [`src/components/storefront/ServiceCard.tsx`](../src/components/storefront/ServiceCard.tsx)
- **Styles:** [`src/components/storefront/ServiceCard.module.scss`](../src/components/storefront/ServiceCard.module.scss)
- **Purpose:** `ServiceCard` renders a product card showing the cover image, `Featured` and `Special Offer` badges, category name, availability indicator (`Available` / `Unavailable`), localized title, short description, starting price (`From 150 DH` / `Dès 150 DH` / `ابتداءً من 150 درهم` or flat price if 1 variant), and a `View details` button.
- **Props (`ServiceCard`):** `{ service: LocalizedService; locale: Locale }`.

---

### 3.4 `ServiceFilters`
- **File:** [`src/components/storefront/ServiceFilters.tsx`](../src/components/storefront/ServiceFilters.tsx)
- **Styles:** [`src/components/storefront/ServiceFilters.module.scss`](../src/components/storefront/ServiceFilters.module.scss)
- **Type:** Client Component (`'use client'`)
- **Purpose:** Provides live search, category dropdown filter, platform dropdown filter, sorting (`Featured`, `Price: Low to High`, `Price: High to Low`, `Name: A to Z`), and "Load more" pagination.
- **Props:**
  - `services: LocalizedService[]`
  - `categories: LocalizedCategory[]`
  - `locale: Locale`
  - `initialCategorySlug?: string` (used on `/categories/[slug]` to pre-select that category)
- **State & Hooks:**
  - `searchQuery`, `selectedCategory`, `selectedPlatform`, `sortBy`, `visibleCount` (`useState`)
  - `availablePlatforms` (`useMemo`): Automatically collects all unique platform names (such as `PS4`, `PS5`, `Xbox / PC`) from the variants of published services.
  - `filteredServices` (`useMemo`): Filters and sorts the services array in real time.
- **Where it is used:** [`/services`](../src/app/(storefront)/services/page.tsx) and [`/categories/[slug]`](../src/app/(storefront)/categories/[slug]/page.tsx).

---

### 3.5 `ServiceGallery`
- **File:** [`src/components/storefront/ServiceGallery.tsx`](../src/components/storefront/ServiceGallery.tsx)
- **Type:** Client Component (`'use client'`)
- **Purpose:** Displays the main product image on the Service Detail page along with clickable thumbnail previews when multiple gallery images exist.
- **Props:** `{ coverImagePath: string | null; galleryPaths: string[]; imageAlt: string }`.

---

### 3.6 `VariantSelector`, `PriceDisplay`, & `WhatsAppOrderButton`
- **Files:**
  - [`src/components/storefront/VariantSelector.tsx`](../src/components/storefront/VariantSelector.tsx)
  - [`src/components/storefront/PriceDisplay.tsx`](../src/components/storefront/PriceDisplay.tsx)
  - [`src/components/storefront/WhatsAppOrderButton.tsx`](../src/components/storefront/WhatsAppOrderButton.tsx)
- **Styles:** [`src/components/storefront/ServiceDetailClient.module.scss`](../src/components/storefront/ServiceDetailClient.module.scss)
- **Purpose:** This trio powers the interactive product configuration panel on `/services/[slug]`.
  1. `VariantSelector` inspects the service's variants using `extractServiceVariantDimensions(variants)`. It **only** renders selector buttons for dimensions that actually exist on that service (for example, a music subscription never shows `Platform` or `Primary`/`Secondary` buttons).
  2. When a customer clicks an option (e.g., switching from `PS4` to `PS5`), `handleSelectDimension` checks if the current combination exists using `resolveExactVariant`. If not, it automatically switches dependent options to the first compatible variant for `PS5`.
  3. `PriceDisplay` shows the exact integer MAD price (`350 DH` / `350 درهم`), strikethrough regular price if on sale, SKU reference, and availability badge.
  4. `WhatsAppOrderButton` generates the localized `https://wa.me/...` link via `buildWhatsAppOrderUrl` (or disables the button if the selected variant is marked unavailable).

---

### 3.7 `FAQAccordion`
- **File:** [`src/components/storefront/FAQAccordion.tsx`](../src/components/storefront/FAQAccordion.tsx)
- **Styles:** [`src/components/storefront/FAQAccordion.module.scss`](../src/components/storefront/FAQAccordion.module.scss)
- **Type:** Client Component (`'use client'`)
- **Purpose:** Renders the collapsible Frequently Asked Questions section on the homepage (`q1`–`q4` from `src/i18n/messages/*.json`).

---

## 4. Common UI Components (`src/components/common/`)

All common components share [`src/components/common/CommonUI.module.scss`](../src/components/common/CommonUI.module.scss):

| Component | File | Purpose |
|---|---|---|
| `LoadingSkeleton` | [`LoadingSkeleton.tsx`](../src/components/common/LoadingSkeleton.tsx) | Displays animated pulsing placeholder cards while catalog content loads. |
| `EmptyState` | [`EmptyState.tsx`](../src/components/common/EmptyState.tsx) | Shown when a search or filter returns 0 matching services, with a button to reset filters. |
| `ErrorState` | [`ErrorState.tsx`](../src/components/common/ErrorState.tsx) | Displays a user-friendly alert box with an optional retry button. |
| `ConfirmDialog` | [`ConfirmDialog.tsx`](../src/components/common/ConfirmDialog.tsx) | Modal dialog asking for confirmation before destructive actions (deleting a service or category). |
| `Toast` | [`Toast.tsx`](../src/components/common/Toast.tsx) | Floating notification banner at the bottom corner for save/delete success or error messages. |

---

## 5. Admin Components (`src/components/admin/`)

All admin components share [`src/components/admin/AdminUI.module.scss`](../src/components/admin/AdminUI.module.scss) and are explained in detail in [09 — Admin Dashboard](./09-admin-dashboard.md):

- [`AdminProtectedShell.tsx`](../src/components/admin/AdminProtectedShell.tsx): Server Component wrapper that checks `getAdminSessionStatus()` and redirects unauthenticated/unauthorized users to `/admin/login`.
- [`AdminSidebar.tsx`](../src/components/admin/AdminSidebar.tsx) & [`AdminHeader.tsx`](../src/components/admin/AdminHeader.tsx): Navigation sidebar, connection mode badge (`Seed / Local Dev Mode` vs. `Supabase Connected + RLS Active`), and Logout button.
- [`ServiceRowActions.tsx`](../src/components/admin/ServiceRowActions.tsx): Renders the **Edit** and direct **Delete** buttons inside the `/admin` services table.
- [`ServiceEditor.tsx`](../src/components/admin/ServiceEditor.tsx): Full form for creating/editing a service, including the `English | Français | الدارجة` translation tabs.
- [`VariantEditor.tsx`](../src/components/admin/VariantEditor.tsx): Dynamic table/card editor to add, edit, duplicate, reorder, and delete variants and MAD prices.
- [`ImageUploader.tsx`](../src/components/admin/ImageUploader.tsx): Validates and uploads images to Supabase Storage (`service-images`) or lets admins pick preset SVG paths.
- [`CategoryManagerClient.tsx`](../src/components/admin/CategoryManagerClient.tsx): Create, edit, translate, and directly delete categories.
- [`SettingsEditorClient.tsx`](../src/components/admin/SettingsEditorClient.tsx): Edit WhatsApp phone number, contact email, support hours, default language, and social media URLs.

