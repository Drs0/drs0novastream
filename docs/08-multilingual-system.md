# 08 — Multilingual System & Moroccan Darija RTL

[← 07 — Services & Pricing](./07-services-pricing.md) | [Back to Index](./README.md) | [Next: 09 — Admin Dashboard →](./09-admin-dashboard.md)

---

## 1. Overview of Supported Languages

NovaStream supports three languages out of the box:

| Language | Locale Code | Text Direction | Font Family | Role |
|---|---|---|---|---|
| **Français** | `fr` | `ltr` (Left-to-Right) | `Inter` | **Default language** when a visitor first opens the site. |
| **الدارجة (Moroccan Darija)** | `ar` | `rtl` (Right-to-Left) | `Cairo` | Natural Moroccan Darija written in Arabic script. |
| **English** | `en` | `ltr` (Left-to-Right) | `Inter` | International English. |

### Crucial Rule: Moroccan Darija, NOT Modern Standard Arabic
The `ar` locale in NovaStream is **Moroccan Darija** (الدارجة المغربية), not formal newspaper Arabic (العربية الفصحى) and not Latin-letter Arabizi.

Examples from [`src/i18n/messages/ar.json`](../src/i18n/messages/ar.json):
- *"Welcome to NovaStream"* → `مرحبا بيك فـ NovaStream`
- *"View services"* → `شوف الخدمات`
- *"Search services"* → `قلّب على شي خدمة`
- *"Available / Unavailable"* → `متوفر` / `ما متوفرش دابا`
- *"Primary / Secondary"* → `برايمري` / `سيكندري`
- *"Choose your platform"* → `اختار البلاط فورم ديالك`

---

## 2. How Clean URL Cookie Localization Works

Unlike websites that change the URL to `/en/services` or `/ar/services`, NovaStream keeps URLs clean (`/`, `/services`, `/services/playstation-plus`) and stores the visitor's chosen language in a first-party browser cookie named **`NEXT_LOCALE`**.

### Step-by-Step Flow

1. **Reading the Active Language ([`src/i18n/request.ts`](../src/i18n/request.ts)):**
   ```typescript
   export const SUPPORTED_LOCALES: Locale[] = ['en', 'fr', 'ar'];
   export const DEFAULT_LOCALE: Locale = 'fr';
   export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

   export async function getActiveLocale(): Promise<Locale> {
     const cookieStore = await cookies();
     const saved = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
     if (saved && SUPPORTED_LOCALES.includes(saved as Locale)) {
       return saved as Locale;
     }
     return DEFAULT_LOCALE;
   }
   ```
   - When a page loads on the server, `getActiveLocale()` checks if the browser sent a `NEXT_LOCALE` cookie.
   - If the cookie is `'en'`, `'fr'`, or `'ar'`, that language is used.
   - If no cookie exists yet (first visit), it returns `'fr'` (French).

2. **Switching Languages ([`src/i18n/actions.ts`](../src/i18n/actions.ts) & [`LanguageSwitcher.tsx`](../src/components/layout/LanguageSwitcher.tsx)):**
   - When the user clicks `English`, `Français`, or `الدارجة` in the header, `LanguageSwitcher` calls the Server Action `setLocaleCookieAction(nextLocale)`:
     ```typescript
     export async function setLocaleCookieAction(nextLocale: Locale): Promise<void> {
       if (!SUPPORTED_LOCALES.includes(nextLocale)) {
         return;
       }

       const cookieStore = await cookies();
       cookieStore.set(LOCALE_COOKIE_NAME, nextLocale, {
         path: '/',
         maxAge: 60 * 60 * 24 * 365, // 1 year
         sameSite: 'lax',
       });

       revalidatePath('/', 'layout');
     }
     ```
   - `LanguageSwitcher` then calls `router.refresh()`, which re-fetches the server components on the exact same URL in the new language.

---

## 3. Two Layers of Translations: UI JSON vs. Database Tables

NovaStream separates translations into two layers:

### Layer 1: Static UI Translations (`src/i18n/messages/*.json`)
Buttons, navigation links, filter labels, FAQ questions, and legal pages live in three JSON files:
- [`src/i18n/messages/en.json`](../src/i18n/messages/en.json)
- [`src/i18n/messages/fr.json`](../src/i18n/messages/fr.json)
- [`src/i18n/messages/ar.json`](../src/i18n/messages/ar.json)

Automated test #1 in [`src/__tests__/run-tests.ts`](../src/__tests__/run-tests.ts) checks that all three JSON files have the exact same nested keys so a translation key is never missing in one language.

### Layer 2: Dynamic Catalog Translations (`category_translations` & `service_translations`)
Category names/descriptions and service names/descriptions/SEO metadata are stored in PostgreSQL translation tables so the store owner can add new products in `/admin` without editing JSON files.

#### Fallback Order (`src/lib/formatters.ts` & `src/lib/catalog/repository.ts`)
What happens if an admin creates a new service and enters the French and English text, but forgets to fill in the Darija (`ar`) tab?

[`getTranslationFallbackOrder`](../src/lib/formatters.ts) defines the strict fallback order:
1. **Requested language** (e.g., `ar`)
2. **French (`fr`)**
3. **English (`en`)**

And inside [`resolveLocalizedService`](../src/lib/catalog/repository.ts), the repository also calculates `missingLocales: Locale[]` (e.g., `['ar']`). This allows the `/admin` dashboard to display a red badge (`Missing: AR`) so the admin can immediately spot which services still need Darija or French translations!

---

## 4. How Right-to-Left (RTL) Support Works for Darija

When the active locale is `'ar'`:

1. **HTML Direction Attributes:**
   - [`src/app/layout.tsx`](../src/app/layout.tsx), [`src/app/(storefront)/layout.tsx`](../src/app/(storefront)/layout.tsx), and [`LocaleDocumentSync.tsx`](../src/components/layout/LocaleDocumentSync.tsx) set `lang="ar"` and `dir="rtl"` on the HTML document.
2. **Arabic Font Selection (`src/app/globals.scss`):**
   ```scss
   html[dir='rtl'] body {
     font-family: var(--font-arabic, 'Cairo', 'Noto Sans Arabic', system-ui, sans-serif);
     line-height: 1.75;
   }
   ```
3. **CSS Logical Properties:**
   - Components use `padding-inline`, `margin-inline-start`, `border-inline-start`, and `inset-inline-start` so cards, borders, search icons, and toasts automatically flip to the right side in RTL mode.
4. **Directional Icon Mirroring (`.directionalIcon`):**
   - Arrows (such as `ArrowRight` on CTA buttons) have `className="directionalIcon"`. In [`src/app/globals.scss`](../src/app/globals.scss):
     ```scss
     html[dir='rtl'] .directionalIcon {
       transform: scaleX(-1);
     }
     ```
     This flips right-pointing arrows to point left in Darija RTL mode.
5. **Protecting Latin Names, SKUs, and Phone Numbers (`.ltrInline`):**
   - Mixed Arabic/Latin text (like `+212600000000`, `NovaStream`, or `PSP-PS5-EXT-PRI-12`) can sometimes get scrambled in RTL paragraphs. Wrapping them in `<span className="ltrInline">` applies `direction: ltr; unicode-bidi: isolate;` so they always render cleanly.

