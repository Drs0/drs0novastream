import type { Locale } from '@/types/database';

/**
 * Formats an integer MAD price according to the active locale.
 * Keeps digits in Western Arabic numerals (100, 350) as standard in Morocco.
 */
export function formatMadPrice(amountMad: number, locale: Locale): string {
  const rounded = Math.round(amountMad);
  if (locale === 'ar') {
    return `${rounded} درهم`;
  }
  return `${rounded} DH`;
}

/**
 * Formats duration in months for display in English, French, or Moroccan Darija.
 */
export function formatDurationMonths(months: number, locale: Locale): string {
  if (locale === 'ar') {
    if (months === 1) return 'شهر واحد';
    if (months === 2) return 'شهرين';
    if (months >= 3 && months <= 10) return `${months} شهور`;
    return `${months} شهر`;
  }
  if (locale === 'fr') {
    return `${months} mois`;
  }
  return months === 1 ? '1 month' : `${months} months`;
}

/**
 * Formats Primary / Secondary access type in the selected language.
 */
export function formatAccessType(
  accessType: 'Primary' | 'Secondary' | null | undefined,
  locale: Locale
): string | null {
  if (!accessType) return null;
  if (accessType === 'Primary') {
    if (locale === 'ar') return 'برايمري';
    if (locale === 'fr') return 'Principal';
    return 'Primary';
  }
  if (accessType === 'Secondary') {
    if (locale === 'ar') return 'سيكندري';
    if (locale === 'fr') return 'Secondaire';
    return 'Secondary';
  }
  return accessType;
}

/**
 * Resolves fallback order:
 * 1. Requested language
 * 2. French ('fr')
 * 3. English ('en')
 * Never substitutes Modern Standard Arabic when Darija ('ar') is missing.
 */
export function getTranslationFallbackOrder(requested: Locale): Locale[] {
  const order: Locale[] = [requested];
  if (!order.includes('fr')) order.push('fr');
  if (!order.includes('en')) order.push('en');
  return order;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolves a localized offer image path (`/images/offers/{en|fr|ar}/<file>`)
 * to match the requested locale so Arabic, English, and French visitors
 * automatically see the 1:1 cover and gallery image in their active language.
 */
export function localizeOfferImagePath(
  imagePath: string | null | undefined,
  locale: Locale
): string | null {
  if (!imagePath) return null;
  if (/^\/images\/offers\/(en|fr|ar)\//.test(imagePath)) {
    return imagePath.replace(/^\/images\/offers\/(en|fr|ar)\//, `/images/offers/${locale}/`);
  }
  return imagePath;
}


