import type { Locale, ServiceVariantRow } from '@/types/database';
import { formatAccessType, formatDurationMonths, formatMadPrice } from './formatters';
import { getEffectiveVariantPriceMad } from './catalog/pricing';

export interface WhatsAppOrderParams {
  phoneNumber: string;
  locale: Locale;
  serviceName: string;
  variant: ServiceVariantRow;
}

/**
 * Sanitizes a WhatsApp phone number to international digits without '+' or spaces.
 */
export function sanitizeWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits || '212600000000';
}

/**
 * Generates a localized prefilled WhatsApp inquiry message matching Section 11 of the Master Plan.
 */
export function buildWhatsAppOrderMessage({
  locale,
  serviceName,
  variant,
}: Omit<WhatsAppOrderParams, 'phoneNumber'>): string {
  const effectivePrice = getEffectiveVariantPriceMad(variant);
  const priceFormatted = formatMadPrice(effectivePrice, locale);
  const accessText = formatAccessType(variant.access_type, locale);
  const durationText = variant.duration_months
    ? formatDurationMonths(variant.duration_months, locale)
    : null;

  const titleParts = [serviceName];
  if (variant.tier) titleParts.push(variant.tier);
  if (variant.edition) titleParts.push(variant.edition);
  const fullServiceTitle = titleParts.join(' ');

  if (locale === 'ar') {
    const details: string[] = [];
    if (variant.platform) details.push(`ديال ${variant.platform}`);
    if (accessText) details.push(accessText);
    if (durationText) details.push(`لمدة ${durationText}`);
    details.push(`بثمن ${priceFormatted}`);
    if (variant.sku) details.push(`(Ref: ${variant.sku})`);

    return `سلام NovaStream، بغيت نسول على ${fullServiceTitle}، ${details.join('، ')}. واش مازال متوفر؟`;
  }

  if (locale === 'fr') {
    const details: string[] = [fullServiceTitle];
    if (variant.platform) details.push(variant.platform);
    if (accessText) details.push(accessText);
    if (durationText) details.push(durationText);
    const refSuffix = variant.sku ? ` (Réf: ${variant.sku})` : '';

    return `Bonjour NovaStream ! Je suis intéressé(e) par ${details.join(', ')}, à ${priceFormatted}${refSuffix}. Est-ce disponible ?`;
  }

  // English ('en')
  const details: string[] = [fullServiceTitle];
  if (variant.platform) details.push(variant.platform);
  if (accessText) details.push(accessText);
  if (durationText) details.push(durationText);
  const refSuffix = variant.sku ? ` (Ref: ${variant.sku})` : '';

  return `Hello NovaStream! I'm interested in ${details.join(', ')}, listed at ${priceFormatted}${refSuffix}. Is it available?`;
}

export function buildWhatsAppOrderUrl(params: WhatsAppOrderParams): string {
  const cleanPhone = sanitizeWhatsAppPhone(params.phoneNumber);
  const message = buildWhatsAppOrderMessage(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(phoneNumber: string, locale: Locale): string {
  const cleanPhone = sanitizeWhatsAppPhone(phoneNumber);
  const message =
    locale === 'ar'
      ? 'سلام NovaStream، بغيت نعرف أكثر على الخدمات الرقمية المتوفرة عندكم.'
      : locale === 'fr'
      ? 'Bonjour NovaStream ! Je souhaite avoir plus d’informations sur vos services numériques.'
      : 'Hello NovaStream! I would like to learn more about your available digital services.';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

