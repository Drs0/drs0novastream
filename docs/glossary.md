# Glossary of Technical Terms

This glossary explains the technical terms used throughout the **NovaStream** codebase and documentation in plain, easy-to-understand English.

---

## A

### API (Application Programming Interface)
A structured way for two software programs to talk to each other. In NovaStream, the Next.js website uses the Supabase API to read and save products in the database.

### App Router
The modern routing system introduced in Next.js 13+ that uses folders inside `src/app/` to define web pages. Every `page.tsx` file inside a folder becomes a route on the website.

### Authentication (AuthN)
The process of verifying **who** a user is—for example, checking an email address and password on `/admin/login`.

### Authorization (AuthZ)
The process of verifying **what** an authenticated user is allowed to do—for example, checking whether the logged-in user's ID exists in the `admin_profiles` table before allowing them to edit services.

---

## C

### Client Component
A React component that begins with `'use client'` at the top of the file. Client Components are sent to the user's browser so they can handle interactive features like button clicks, typing in forms, and switching tabs (`useState`, `useEffect`).

### Cookie
A small piece of text stored by the browser and sent automatically with every request to the website. NovaStream uses cookies for two things:
1. Remembering the user's selected language (`NEXT_LOCALE`).
2. Keeping the admin logged into Supabase Auth (`sb-...-auth-token`).

### CRUD (Create, Read, Update, Delete)
The four basic operations for managing data in a database:
- **Create** a new service
- **Read** (view) services
- **Update** (edit) a service
- **Delete** a service

---

## D

### Darija (`ar`)
Moroccan Arabic—the everyday spoken and written language in Morocco. In NovaStream, the `ar` locale displays natural Moroccan Darija written in Arabic script with Right-to-Left (`RTL`) page layout.

### Database
An organized system for storing, searching, and protecting structured information (such as categories, services, and prices). NovaStream uses **PostgreSQL** hosted by Supabase.

### Deployment
The process of building the website code and publishing it to a cloud server (like **Netlify** or **Cloudflare Pages**) so customers can visit it on the internet.

---

## E

### Environment Variable (`.env.local`)
A configuration value stored outside the source code (for example, your Supabase project URL or WhatsApp phone number). Environment variables keep secret keys out of GitHub and allow you to use different settings on your laptop versus your live website.

---

## F

### Foreign Key (`REFERENCES`)
A column in one database table that points to the `id` (`PRIMARY KEY`) of a row in another table.
- *Example:* In `service_variants`, the `service_id` column is a **Foreign Key** pointing to `services.id`. It connects each price option to its parent product.

---

## H

### Hook (React Hook)
A special function in React (always starting with `use`, like `useState`, `useMemo`, or `useTranslations`) that lets components remember state or access shared features.

---

## J

### JSON / JSONB
**JSON (JavaScript Object Notation)** is a lightweight format for storing data as key-value pairs (such as `{"platform": "PS5", "access_type": "Primary"}`). **JSONB** is PostgreSQL's fast, binary version of JSON that allows flexible product attributes without needing new database columns for every product type.

---

## M

### MAD / DH (Moroccan Dirham)
The official currency of Morocco. In NovaStream, all prices are stored as whole numbers in `price_mad` and displayed to customers as `DH` (in English/French) or `درهم` (in Moroccan Darija).

### Middleware (`src/middleware.ts`)
A function in Next.js that runs on the server *before* a page finishes loading. NovaStream's middleware refreshes the Supabase login cookie and redirects unauthenticated visitors away from `/admin` pages to `/admin/login`.

### Migration (Database Migration)
A numbered `.sql` file (inside `supabase/migrations/`) that records step-by-step instructions for creating or updating database tables. Migrations let you recreate the exact same database structure on any Supabase project.

---

## P

### Primary Key (`id`)
A unique identifier for every row in a database table. NovaStream uses **UUIDs** (Universally Unique Identifiers, such as `b8a7e12c-3d4f-...`) as primary keys.

### Props (Properties)
Inputs passed from a parent React component down to a child component—similar to arguments passed into a function. For example, a page passes a `service` object as a prop into `<ServiceCard service={service} />`.

---

## R

### RLS (Row Level Security)
A security feature built directly into PostgreSQL. Even if someone tries to query the Supabase database directly from their browser, **RLS policies** check every single row to decide if the user is allowed to read, insert, update, or delete it.

### Route Group (`(storefront)`)
A folder name wrapped in parentheses inside `src/app/`, such as `src/app/(storefront)/`. Next.js uses Route Groups to share a common `layout.tsx` (like the public header and footer) across pages **without** adding `(storefront)` to the browser URL.

### RTL (Right-to-Left)
A page layout direction where text, menus, and grids flow from the right side of the screen to the left. Languages written in Arabic script (including Moroccan Darija) use `dir="rtl"`, whereas English and French use `dir="ltr"` (Left-to-Right).

---

## S

### SCSS Module (`*.module.scss`)
A CSS stylesheet that supports Sass features (variables, mixins, nested rules) and automatically scopes class names to a single React component so styles never accidentally clash across different pages.

### Seed Data (Local Seed Mode)
Sample starter data included in the project (`src/lib/data/mock-data.ts` and `supabase/migrations/0002_seed_catalog.sql`). If you run NovaStream before connecting a Supabase database, it uses this seed data so the site works right away.

### Server Action (`'use server'`)
A Next.js function that runs securely on the server when a user submits a form or clicks a button (for example, `saveServiceAction`, `deleteServiceAction`, or `setLocaleAction`). It replaces the need to manually write separate API endpoints for every form.

### Server Component
The default type of React component in the Next.js App Router. Server Components run on the server, can fetch data directly from Supabase, and send lightweight HTML to the browser without exposing backend logic.

### SKU (Stock Keeping Unit)
A short internal code used by store owners to identify a specific product variant (for example, `FC25-PS5-PRI`).

### Slug
The URL-friendly name of a category or service, using only lowercase letters, numbers, and hyphens (`-`).
- *Example:* A service named `"EA Sports FC 25"` has the slug `"ea-sports-fc-25"`, creating the URL `/services/ea-sports-fc-25`.

### SSG (Static Site Generation)
Pre-building web pages into fast HTML files at build time when content does not change on every request.

### SSR (Server-Side Rendering)
Generating the HTML for a web page dynamically on the server when a user requests it. NovaStream uses SSR so that cookie-based language switching (`NEXT_LOCALE`) and live price updates from `/admin` appear immediately.

### State
Data inside a Client Component that can change while the user interacts with the page—for example, which platform (`PS4` vs `PS5`) the customer currently has selected in `<ServiceOptionSelector />`.

---

## T

### Table (Database Table)
A collection of related data organized into rows and columns inside PostgreSQL—similar to a sheet in a spreadsheet. NovaStream has 5 tables: `admin_profiles`, `categories`, `services`, `service_variants`, and `site_settings`.

---

## Z

### Zod
A TypeScript validation library (`src/lib/validation/admin.ts`) used by NovaStream to verify that all form data submitted by an admin (such as prices, slugs, and translations) is valid and safe before saving it to the database.

