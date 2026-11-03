import type { Locale, ServiceVariantRow } from '@/types/database';
import { formatAccessType, formatDurationMonths, formatMadPrice } from './formatters';
import { getEffectiveVariantPriceMad } from './catalog/pricing';

export interface WhatsAppOrderParams {
  phoneNumber: string;
  locale: Locale;
  serviceName: string;
  variant: ServiceVariantRow;
}

export interface WhatsAppCartItemInput {
  serviceName: string;
  variant: ServiceVariantRow;
  quantity?: number;
}

export interface WhatsAppCartOrderParams {
  phoneNumber: string;
  locale: Locale;
  items: WhatsAppCartItemInput[];
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

/**
 * Generates a single combined WhatsApp inquiry message for multiple games/services in the cart.
 */
export function buildWhatsAppCartOrderMessage({
  locale,
  items,
}: Omit<WhatsAppCartOrderParams, 'phoneNumber'>): string {
  if (items.length === 0) {
    return locale === 'ar'
      ? 'سلام NovaStream، بغيت نعرف أكثر على الخدمات الرقمية المتوفرة عندكم.'
      : locale === 'fr'
      ? 'Bonjour NovaStream ! Je souhaite avoir plus d’informations sur vos services numériques.'
      : 'Hello NovaStream! I would like to learn more about your available digital services.';
  }

  let totalMad = 0;

  const lines = items.map((item, idx) => {
    const qty = Math.max(1, item.quantity ?? 1);
    const unitPrice = getEffectiveVariantPriceMad(item.variant);
    const lineTotal = unitPrice * qty;
    totalMad += lineTotal;

    const unitFormatted = formatMadPrice(unitPrice, locale);
    const lineTotalFormatted = formatMadPrice(lineTotal, locale);
    const accessText = formatAccessType(item.variant.access_type, locale);
    const durationText = item.variant.duration_months
      ? formatDurationMonths(item.variant.duration_months, locale)
      : null;

    const titleParts = [item.serviceName];
    if (item.variant.tier) titleParts.push(item.variant.tier);
    if (item.variant.edition) titleParts.push(item.variant.edition);
    const fullServiceTitle = titleParts.join(' ');

    if (locale === 'ar') {
      const specs: string[] = [];
      if (item.variant.platform) specs.push(`ديال ${item.variant.platform}`);
      if (accessText) specs.push(accessText);
      if (durationText) specs.push(`لمدة ${durationText}`);
      const specsPart = specs.length > 0 ? ` (${specs.join('، ')})` : '';
      const qtyPart = qty > 1 ? ` ×${qty}` : '';
      const refPart = item.variant.sku ? ` [Ref: ${item.variant.sku}]` : '';
      return `${idx + 1}. ${fullServiceTitle}${specsPart}${qtyPart} — ${lineTotalFormatted}${refPart}`;
    }

    if (locale === 'fr') {
      const specs: string[] = [];
      if (item.variant.platform) specs.push(item.variant.platform);
      if (accessText) specs.push(accessText);
      if (durationText) specs.push(durationText);
      const specsPart = specs.length > 0 ? ` (${specs.join(', ')})` : '';
      const qtyPart = qty > 1 ? ` ×${qty} (${unitFormatted}/u)` : '';
      const refPart = item.variant.sku ? ` [Réf: ${item.variant.sku}]` : '';
      return `${idx + 1}. ${fullServiceTitle}${specsPart}${qtyPart} — ${lineTotalFormatted}${refPart}`;
    }

    // English ('en')
    const specs: string[] = [];
    if (item.variant.platform) specs.push(item.variant.platform);
    if (accessText) specs.push(accessText);
    if (durationText) specs.push(durationText);
    const specsPart = specs.length > 0 ? ` (${specs.join(', ')})` : '';
    const qtyPart = qty > 1 ? ` ×${qty} (${unitFormatted} each)` : '';
    const refPart = item.variant.sku ? ` [Ref: ${item.variant.sku}]` : '';
    return `${idx + 1}. ${fullServiceTitle}${specsPart}${qtyPart} — ${lineTotalFormatted}${refPart}`;
  });

  const totalFormatted = formatMadPrice(totalMad, locale);

  if (locale === 'ar') {
    return [
      'سلام NovaStream، بغيت نطلب هاد الألعاب / الخدمات:',
      ...lines,
      `المجموع: ${totalFormatted}`,
      'واش متوفرين دابا؟',
    ].join('\n');
  }

  if (locale === 'fr') {
    return [
      'Bonjour NovaStream ! Je souhaite commander les articles suivants :',
      ...lines,
      `Total : ${totalFormatted}`,
      'Sont-ils disponibles ?',
    ].join('\n');
  }

  return [
    'Hello NovaStream! I would like to order the following items:',
    ...lines,
    `Total: ${totalFormatted}`,
    'Are these available?',
  ].join('\n');
}

export function buildWhatsAppCartOrderUrl(params: WhatsAppCartOrderParams): string {
  const cleanPhone = sanitizeWhatsAppPhone(params.phoneNumber);
  const message = buildWhatsAppCartOrderMessage(params);
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

