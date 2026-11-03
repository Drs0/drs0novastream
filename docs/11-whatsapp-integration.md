# 11 — WhatsApp Integration

[← 10 — Image Management](./10-image-management.md) | [Back to Index](./README.md) | [Next: 12 — Deployment →](./12-deployment.md)

---

## 1. Why NovaStream Uses WhatsApp Ordering

In Morocco, customers strongly prefer confirming product availability, asking questions about `Primary` vs. `Secondary` setup, and arranging payment (such as bank transfer / CIH / Attijari / CashPlus) directly over **WhatsApp** rather than entering credit card details on a new website.

Therefore, NovaStream does not charge payments automatically on the website. Instead, once a customer selects a valid product variant on `/services/[slug]`, clicking the green **Order on WhatsApp** button opens WhatsApp (`https://wa.me/...`) with a complete, localized message containing all details of their selected offer.

---

## 2. How the WhatsApp Message Builder Works (`src/lib/whatsapp.ts`)

All WhatsApp logic is located in [`src/lib/whatsapp.ts`](../src/lib/whatsapp.ts).

### 2.1 Sanitizing the Phone Number (`sanitizeWhatsAppPhone`)

WhatsApp's `https://wa.me/` links require the phone number in international format using **only digits** (no `+` sign, spaces, or dashes).

```typescript
export function sanitizeWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits || '212600000000';
}
```
For example, if someone enters `+212 600-000000`, `sanitizeWhatsAppPhone` converts it to `212600000000`.

---

### 2.2 Building the Localized Product Message (`buildWhatsAppOrderMessage`)

[`buildWhatsAppOrderMessage`](../src/lib/whatsapp.ts) takes:
- `locale`: `'en'`, `'fr'`, or `'ar'`
- `serviceName`: The localized service name
- `variant`: The exact selected `ServiceVariantRow`

It formats the effective price (`formatMadPrice`), access mode (`formatAccessType`), and duration (`formatDurationMonths`) in the customer's active language, and omits any `null` fields automatically.

#### Real Output Examples for Each Language

Suppose a customer selects **PlayStation Plus**, Tier: **Extra**, Platform: **PS5**, Access: **Primary**, Duration: **12 months**, Price: **350 DH**, SKU: **`PSP-PS5-EXT-PRI-12`**:

1. **When browsing in Français (`fr`):**
   > `Bonjour NovaStream ! Je suis intéressé(e) par PlayStation Plus Extra, PS5, Principal, 12 mois, à 350 DH (Réf: PSP-PS5-EXT-PRI-12). Est-ce disponible ?`

2. **When browsing in Moroccan Darija (`ar`):**
   > `سلام NovaStream، بغيت نسول على PlayStation Plus بلايستيشن بلس Extra، ديال PS5، برايمري، لمدة 12 شهر، بثمن 350 درهم، (Ref: PSP-PS5-EXT-PRI-12). واش مازال متوفر؟`

3. **When browsing in English (`en`):**
   > `Hello NovaStream! I'm interested in PlayStation Plus Extra, PS5, Primary, 12 months, listed at 350 DH (Ref: PSP-PS5-EXT-PRI-12). Is it available?`

And what if the customer orders a **Premium Music Subscription** (`Individual`, `3 months`, `110 DH`) where `platform`, `tier`, and `access_type` are `null`?
- **French output:**
  > `Bonjour NovaStream ! Je suis intéressé(e) par Abonnement Musique Premium Individual, 3 mois, à 110 DH (Réf: MUS-IND-3M). Est-ce disponible ?`
  *(Notice that PS4/PS5 and Principal/Secondaire are cleanly left out!)*

---

### 2.3 Encoding the URL (`buildWhatsAppOrderUrl`)

```typescript
export function buildWhatsAppOrderUrl(params: WhatsAppOrderParams): string {
  const cleanPhone = sanitizeWhatsAppPhone(params.phoneNumber);
  const message = buildWhatsAppOrderMessage(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
```
- `encodeURIComponent(message)` safely encodes spaces, accents (`é`, `à`), and Arabic script (`سلام`) so every mobile and desktop browser opens WhatsApp without breaking the URL.

---

## 3. How to Change the Business WhatsApp Phone Number

The phone number is **never hardcoded** inside product components. Instead, it is fetched dynamically from the `site_settings` table (`key = 'whatsapp_number'`).

To update it:
1. Log in to `/admin` and click **Website Settings** (`/admin/settings`).
2. In the **WhatsApp Phone Number** field, enter your Moroccan phone number in international format without `+` (for example: `212612345678`).
3. Click **Save Settings**.
4. Every WhatsApp button on the Homepage hero, Service Detail pages, and Contact page will immediately use your new number.

