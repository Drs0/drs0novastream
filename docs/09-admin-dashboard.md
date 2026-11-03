# 09 — Admin Dashboard

[← 08 — Multilingual System](./08-multilingual-system.md) | [Back to Index](./README.md) | [Next: 10 — Image Management →](./10-image-management.md)

---

## 1. Overview of Admin Routes

The private Administration Dashboard lives under `/admin` and is kept in English (`dir="ltr" lang="en"`) for fast daily catalog management, while providing multilingual content tabs (`English | Français | الدارجة`) for all customer-facing fields.

| URL Route | File Location | Purpose |
|---|---|---|
| `/admin/login` | [`src/app/admin/login/page.tsx`](../src/app/admin/login/page.tsx) | Email and password login form. Verifies membership in `admin_users`. |
| `/admin` | [`src/app/admin/page.tsx`](../src/app/admin/page.tsx) | Dashboard statistics + full Services Management table with Edit and Delete actions. |
| `/admin/services/new` | [`src/app/admin/services/new/page.tsx`](../src/app/admin/services/new/page.tsx) | Create a new multilingual service with variants and images. |
| `/admin/services/[id]/edit` | [`src/app/admin/services/[id]/edit/page.tsx`](../src/app/admin/services/[id]/edit/page.tsx) | Edit an existing service, its translations, images, and variants. |
| `/admin/categories` | [`src/app/admin/categories/page.tsx`](../src/app/admin/categories/page.tsx) | Create, edit, translate, reorder, activate/deactivate, and delete categories. |
| `/admin/settings` | [`src/app/admin/settings/page.tsx`](../src/app/admin/settings/page.tsx) | Update the WhatsApp phone number, contact email, support hours, default language, and social links. |

---

## 2. Dashboard Overview (`/admin`)

When you log in to `/admin`, [`getAdminDashboardStats()`](../src/lib/catalog/repository.ts) calculates six live metrics displayed at the top of the page:
1. **Total Services:** Total count of all services (published, draft, and archived).
2. **Published Services:** Services currently visible to customers on the public storefront.
3. **Draft Services:** Private services (`status = 'draft'`) hidden from customers.
4. **Categories:** Total count of categories.
5. **Unavailable Variants:** Count of individual product variants currently marked `is_available = false`.
6. **Featured Services:** Count of services marked `is_featured = true` (shown on the homepage).

Below the metrics is the **Catalog Services Management** table:
- Shows each service's display order, name, slug, category, publication badge (`PUBLISHED`, `DRAFT`, `ARCHIVED`), variant count, MAD price range, and translation status (`All 3 Locales Ready` in green, or `Missing: FR, AR` in red).
- The **Actions** column (rendered by [`ServiceRowActions.tsx`](../src/components/admin/ServiceRowActions.tsx)) provides:
  - **Edit:** Opens `/admin/services/[id]/edit`.
  - **Delete:** Opens a confirmation modal and permanently deletes the service directly from the table without needing to open the Edit page first.

---

## 3. Creating & Editing a Service (`ServiceEditor.tsx`)

Both `/admin/services/new` and `/admin/services/[id]/edit` render [`ServiceEditor`](../src/components/admin/ServiceEditor.tsx).

The editor is divided into four clear sections:

### Section 1: General Service Settings
- **Category:** Dropdown of all categories.
- **Canonical URL Slug:** Auto-generated from the service name when creating a new service (via `slugify()`), or editable manually (e.g., `playstation-plus`).
- **Publication Status:**
  - `Draft (Private)`: Saved in the database, but invisible to customers.
  - `Published (Public Storefront)`: Live on the website (requires at least 1 valid variant).
  - `Archived`: Hidden from the public storefront.
- **Sort Order:** Integer number (`1`, `2`, `3`...) controlling where the service appears in default catalog sorting.
- **Feature on Homepage:** Checkbox (`is_featured`).
- **Terms, Conditions & Usage Notes:** Textarea for service-specific rules (such as Primary vs. Secondary profile instructions).

### Section 2: Multilingual Content Editor (`English | Français | الدارجة`)
- Contains three language tabs. Each tab displays a green `Ready` badge if the service name is filled in for that language, or a red `Missing` badge if empty.
- When you click **الدارجة**, all inputs in the panel automatically switch to Right-to-Left (`dir="rtl"`) and use the `Cairo` Arabic font (`styles.rtlInput`) so typing Moroccan Darija feels natural.
- Fields per language:
  - `Service Name`
  - `Image Alt Text`
  - `Short Description`
  - `Full Description`
  - `SEO Title` & `SEO Description`

### Section 3: Images & Supabase Storage (`ImageUploader.tsx`)
- Lets you set the **Cover Image Path or URL** (or pick from quick preset buttons), upload a new image file to the `service-images` Supabase Storage bucket, and add/remove **Gallery Images**. (See [10 — Image Management](./10-image-management.md) for full details.)

### Section 4: Dynamic Service Variants (`VariantEditor.tsx`)
- Lets you manage all pricing options for the service:
  - **Add Variant:** Appends a new variant row.
  - **Duplicate:** Copies an existing variant row (very useful when adding `PS4 Primary`, `PS4 Secondary`, `PS5 Primary`, `PS5 Secondary`).
  - **Up / Down Arrows:** Changes the `sort_order` of variants.
  - **Delete (Trash Icon):** Removes a variant row.
  - **Available for WhatsApp Ordering Checkbox:** Toggles `is_available`.

---

## 4. Managing Categories (`/admin/categories`)

[`CategoryManagerClient.tsx`](../src/components/admin/CategoryManagerClient.tsx) provides a unified form and table:
- **Create Mode:** Fill in the `English | Français | الدارجة` name and description tabs, verify the auto-generated slug, set the icon path and sort order, and click **Create Category**.
- **Edit Mode:** Click **Edit** in any category row to load that category and all three of its translations into the top form, make your changes, and click **Update Category**.
- **Delete Action:** Click **Delete** in the category's **Actions** column. Note: [`deleteCategoryAction`](../src/app/admin/actions.ts) protects data integrity by refusing to delete a category if any services are still assigned to it (`Cannot delete category while services are still assigned to it.`).

---

## 5. Managing Website & WhatsApp Settings (`/admin/settings`)

[`SettingsEditorClient.tsx`](../src/components/admin/SettingsEditorClient.tsx) updates public rows in the `site_settings` table via [`saveSiteSettingsAction`](../src/app/admin/actions.ts):
- **WhatsApp Phone Number:** Must be entered in international format without `+` or spaces (for example, `212600000000` for a Moroccan `+212 6...` number).
- **Contact Email:** Displayed in the footer and `/contact` page.
- **Support Hours:** Displayed in the footer and `/contact` page (e.g., `10:00 - 23:00 (GMT+1)`).
- **Default Storefront Language:** Stored in `site_settings` (`fr`, `ar`, or `en`).
- **Social Media URLs:** Instagram, Facebook, and TikTok links shown in the footer.

