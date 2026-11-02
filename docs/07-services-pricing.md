# 07 — Services and Pricing

[← 06 — Authentication & Security](./06-authentication-security.md) | [Back to Index](./README.md) | [Next: 08 — Multilingual System →](./08-multilingual-system.md)

---

## 1. Why NovaStream Uses Dynamic Variants

Different digital services have completely different pricing structures:
- A **PlayStation 4 / PlayStation 5 game** varies by **Platform** (`PS4`, `PS5`), **Edition** (`Standard`, `Ultimate`), and **Access Type** (`Primary`, `Secondary`).
- A **PlayStation Plus membership** varies by **Platform** (`PS4`, `PS5`), **Tier** (`Essential`, `Extra`, `Premium`), **Duration** (`12 months`), and **Access Type** (`Primary`, `Secondary`).
- A **Music or Video Streaming subscription** varies only by **Edition/Plan** (`Individual`, `1 Screen 4K`) and **Duration** (`1 month`, `3 months`, `12 months`)—it has **no console platform** and **no Primary/Secondary access**.

If we hardcoded `ps4_primary_price` and `ps5_secondary_price` columns on the `services` table, we could not sell music or streaming subscriptions cleanly. Instead, NovaStream uses a **one-to-many relationship**:
- One row in `services` represents the product.
- One or more rows in `service_variants` represent the exact purchasable combinations and their prices in Moroccan Dirhams (`MAD`).

---

## 2. Understanding Primary vs. Secondary Access

For PlayStation services where account sharing applies:
- **`Primary` (`Principal` in French / `برايمري` in Moroccan Darija):** The customer activates the service on their console and plays directly from their own personal profile.
- **`Secondary` (`Secondaire` in French / `سيكندري` in Moroccan Darija):** The customer plays on the provided dedicated profile while connected to the internet, typically at a lower price in DH.
- **`null` (Not Applicable):** Used for Xbox Game Pass codes, music subscriptions, or streaming passes where Primary/Secondary does not apply. When all variants of a service have `access_type: null`, the `VariantSelector` component automatically hides the Primary/Secondary buttons!

---

## 3. The 10 Core Pricing Rules

All pricing calculations live in [`src/lib/catalog/pricing.ts`](../src/lib/catalog/pricing.ts):

1. **Integer MAD Storage:** Prices are stored as whole integer numbers (`price_mad: 350` = `350 DH` / `350 درهم`) to avoid floating-point rounding errors.
2. **Independent Variant Prices:** Every variant stores its own exact `price_mad` in the database. We never guess or calculate Secondary prices by subtracting a percentage from Primary.
3. **Discount Validation:** A variant can have an optional `sale_price_mad`. Both Zod and PostgreSQL enforce `sale_price_mad < price_mad`.
   ```typescript
   export function getEffectiveVariantPriceMad(variant: ServiceVariantRow): number {
     if (
       variant.sale_price_mad !== null &&
       variant.sale_price_mad >= 0 &&
       variant.sale_price_mad < variant.price_mad
     ) {
       return variant.sale_price_mad;
     }
     return variant.price_mad;
   }
   ```
4. **Catalog Card Starting Price (`computeServicePriceSummary`):**
   - If a service has only **1 variant**, the catalog card displays that exact price (`140 DH`).
   - If a service has **multiple variants**, the catalog card finds the lowest available effective price and displays `From 150 DH` (`Dès 150 DH` / `ابتداءً من 150 درهم`).
5. **Dynamic Dimension Extraction (`extractServiceVariantDimensions`):**
   - Inspects a service's variants and collects distinct non-null values for `platforms`, `editions`, `tiers`, `durations`, and `accessTypes`.
   - If a list is empty (e.g., `tiers = []` on a football game), that selector row is not rendered on the page.
6. **Option Compatibility (`checkOptionCompatibility`):**
   - Checks whether a button (such as `Premium`) exists for the currently selected `platform` (`PS4`).
   - If `PS4 + Premium` does not exist in `service_variants`, the `Premium` button is disabled when `PS4` is selected.
7. **Exact Variant Resolution (`resolveExactVariant`):**
   - Matches the user's current button selections against the `variants` array.
   - Returns the variant **only if exactly 1 database variant matches**.
8. **Never Fabricate Prices:** If an invalid combination is somehow selected, `resolveExactVariant` returns `null` and `PriceDisplay` shows a prompt to select a valid combination instead of inventing a number.
9. **Unavailable Variants (`is_available = false`):**
   - Shown with a dashed border (`optionUnavailable` CSS class) and a red `Unavailable` / `Indisponible` / `ما متوفرش دابا` badge.
   - The `WhatsAppOrderButton` is disabled (`disabled={true}`) when an unavailable variant is selected.
10. **At Least One Variant to Publish:** A service cannot be saved with `status = 'published'` unless it has at least one valid variant.

---

## 4. Practical Example: How to Add a New Service with Multiple Variants

Suppose you want to add a new PlayStation game called **"Spider-Hero 2"** with three options:
- PS5 Standard Primary — `320 DH` (on sale for `290 DH`)
- PS5 Standard Secondary — `170 DH`
- PS5 Deluxe Primary — `380 DH`

### How to Add It via the Admin Dashboard (`/admin/services/new`):
1. Log in at `http://localhost:3000/admin/login` and click **New Service** in the sidebar.
2. **Basic Info:**
   - **Category:** Select `PlayStation Games`.
   - **Canonical URL Slug:** Enter `spider-hero-2`.
   - **Publication Status:** Select `Published (Public Storefront)`.
3. **Multilingual Content Editor Tabs:**
   - Click **Français**, enter Name: `Spider-Hero 2`, and fill in the French descriptions.
   - Click **الدارجة**, enter Name: `لعبة Spider-Hero 2`, and fill in the Moroccan Darija descriptions.
   - Click **English**, enter Name: `Spider-Hero 2`, and fill in the English descriptions.
4. **Dynamic Service Variants & MAD Pricing:**
   - **Variant 1:** Label: `PS5 Standard Primary`, Platform: `PS5`, Edition: `Standard`, Access Type: `Primary`, Price (MAD): `320`, Sale Price (MAD): `290`, Available: `Checked`.
   - Click **Duplicate** to create Variant 2, then change Label to `PS5 Standard Secondary`, Access Type to `Secondary`, Price (MAD) to `170`, and clear Sale Price.
   - Click **Duplicate** to create Variant 3, then change Label to `PS5 Deluxe Primary`, Edition to `Deluxe`, Access Type to `Primary`, and Price (MAD) to `380`.
   - *(Notice we left `Tier` and `Duration (Months)` blank because this is a permanent game, not a monthly subscription!)*
5. Click **Save Service**.
6. Visit `http://localhost:3000/services/spider-hero-2`. The storefront will automatically render **Platform** (`PS5`), **Edition** (`Standard`, `Deluxe`), and **Access Type** (`Primary`, `Secondary`) buttons without showing Tier or Duration!

