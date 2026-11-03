'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ShoppingCart } from 'lucide-react';
import type { AccessType, Locale, ServiceVariantRow } from '@/types/database';
import type { VariantSelectionState } from '@/types/catalog';
import {
  checkOptionCompatibility,
  extractServiceVariantDimensions,
  resolveExactVariant,
} from '@/lib/catalog/pricing';
import { formatAccessType, formatDurationMonths } from '@/lib/formatters';
import { useCart } from './CartContext';
import { PriceDisplay } from './PriceDisplay';
import { WhatsAppOrderButton } from './WhatsAppOrderButton';
import styles from './ServiceDetailClient.module.scss';

interface VariantSelectorProps {
  serviceId?: string;
  serviceSlug?: string;
  serviceName: string;
  coverImagePath?: string | null;
  variants: ServiceVariantRow[];
  locale: Locale;
  whatsappNumber: string;
}

export function VariantSelector({
  serviceId = '',
  serviceSlug = '',
  serviceName,
  coverImagePath = null,
  variants,
  locale,
  whatsappNumber,
}: VariantSelectorProps) {
  const t = useTranslations('serviceDetail');
  const cartT = useTranslations('cart');
  const { addItem, getItemQuantity, openCart, totalItems } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const dimensions = useMemo(
    () => extractServiceVariantDimensions(variants),
    [variants]
  );

  // Initialize selection from the first available variant (or first variant)
  const defaultVariant = useMemo(
    () => variants.find((v) => v.is_available) ?? variants[0] ?? null,
    [variants]
  );

  const [selection, setSelection] = useState<VariantSelectionState>(() => ({
    platform: defaultVariant?.platform ?? null,
    edition: defaultVariant?.edition ?? null,
    tier: defaultVariant?.tier ?? null,
    duration_months: defaultVariant?.duration_months ?? null,
    access_type: defaultVariant?.access_type ?? null,
  }));

  // When user clicks an option on a dimension, auto-adjust dependent dimensions if needed so a valid variant is selected
  function handleSelectDimension<K extends keyof VariantSelectionState>(
    dimension: K,
    value: VariantSelectionState[K]
  ) {
    const next: VariantSelectionState = {
      ...selection,
      [dimension]: value,
    };

    const exact = resolveExactVariant(variants, next, dimensions);
    if (exact) {
      setSelection(next);
      return;
    }

    // Find the best compatible variant that has this newly chosen dimension value
    const compatible =
      variants.find((v) => v[dimension] === value && v.is_available) ??
      variants.find((v) => v[dimension] === value);

    if (compatible) {
      setSelection({
        platform: compatible.platform,
        edition: compatible.edition,
        tier: compatible.tier,
        duration_months: compatible.duration_months,
        access_type: compatible.access_type,
      });
    } else {
      setSelection(next);
    }
  }

  const selectedVariant = useMemo(
    () => resolveExactVariant(variants, selection, dimensions),
    [variants, selection, dimensions]
  );

  const isSingleFlatVariant = variants.length === 1;
  const isOrderable = Boolean(selectedVariant && selectedVariant.is_available);
  const currentVariantQty = selectedVariant
    ? getItemQuantity(selectedVariant.id)
    : 0;

  function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.is_available) return;
    addItem({
      variantId: selectedVariant.id,
      serviceId: serviceId || selectedVariant.service_id,
      serviceSlug,
      serviceName,
      coverImagePath,
      variant: selectedVariant,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className={styles.selectorPanel}>
      {!isSingleFlatVariant && (
        <>
          {dimensions.platforms.length > 0 && (
            <div className={styles.dimensionGroup}>
              <span className={styles.dimensionLabel}>{t('choosePlatform')}</span>
              <div className={styles.optionsGrid}>
                {dimensions.platforms.map((platform) => {
                  const isSelected = selection.platform === platform;
                  const hasAnyForPlatform = variants.some(
                    (v) => v.platform === platform
                  );
                  const hasAvailableForPlatform = variants.some(
                    (v) => v.platform === platform && v.is_available
                  );

                  return (
                    <button
                      key={platform}
                      type="button"
                      disabled={!hasAnyForPlatform}
                      onClick={() => handleSelectDimension('platform', platform)}
                      className={`${styles.optionPill} ${
                        isSelected ? styles.optionSelected : ''
                      } ${
                        !hasAvailableForPlatform ? styles.optionUnavailable : ''
                      }`}
                    >
                      <span className="ltrInline">{platform}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {dimensions.editions.length > 0 && (
            <div className={styles.dimensionGroup}>
              <span className={styles.dimensionLabel}>{t('chooseEdition')}</span>
              <div className={styles.optionsGrid}>
                {dimensions.editions.map((edition) => {
                  const isSelected = selection.edition === edition;
                  const compat = checkOptionCompatibility(
                    variants,
                    { platform: selection.platform },
                    'edition',
                    edition
                  );

                  return (
                    <button
                      key={edition}
                      type="button"
                      disabled={!compat.exists}
                      onClick={() => handleSelectDimension('edition', edition)}
                      className={`${styles.optionPill} ${
                        isSelected ? styles.optionSelected : ''
                      } ${!compat.isAvailable ? styles.optionUnavailable : ''}`}
                    >
                      <span>{edition}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {dimensions.tiers.length > 0 && (
            <div className={styles.dimensionGroup}>
              <span className={styles.dimensionLabel}>{t('chooseTier')}</span>
              <div className={styles.optionsGrid}>
                {dimensions.tiers.map((tier) => {
                  const isSelected = selection.tier === tier;
                  const compat = checkOptionCompatibility(
                    variants,
                    {
                      platform: selection.platform,
                      edition: selection.edition,
                    },
                    'tier',
                    tier
                  );

                  return (
                    <button
                      key={tier}
                      type="button"
                      disabled={!compat.exists}
                      onClick={() => handleSelectDimension('tier', tier)}
                      className={`${styles.optionPill} ${
                        isSelected ? styles.optionSelected : ''
                      } ${!compat.isAvailable ? styles.optionUnavailable : ''}`}
                    >
                      <span className="ltrInline">{tier}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {dimensions.durations.length > 0 && (
            <div className={styles.dimensionGroup}>
              <span className={styles.dimensionLabel}>{t('chooseDuration')}</span>
              <div className={styles.optionsGrid}>
                {dimensions.durations.map((months) => {
                  const isSelected = selection.duration_months === months;
                  const compat = checkOptionCompatibility(
                    variants,
                    {
                      platform: selection.platform,
                      edition: selection.edition,
                      tier: selection.tier,
                    },
                    'duration_months',
                    months
                  );

                  return (
                    <button
                      key={months}
                      type="button"
                      disabled={!compat.exists}
                      onClick={() =>
                        handleSelectDimension('duration_months', months)
                      }
                      className={`${styles.optionPill} ${
                        isSelected ? styles.optionSelected : ''
                      } ${!compat.isAvailable ? styles.optionUnavailable : ''}`}
                    >
                      <span>{formatDurationMonths(months, locale)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {dimensions.accessTypes.length > 0 && (
            <div className={styles.dimensionGroup}>
              <span className={styles.dimensionLabel}>{t('chooseAccess')}</span>
              <div className={styles.optionsGrid}>
                {dimensions.accessTypes.map((access: NonNullable<AccessType>) => {
                  const isSelected = selection.access_type === access;
                  const compat = checkOptionCompatibility(
                    variants,
                    {
                      platform: selection.platform,
                      edition: selection.edition,
                      tier: selection.tier,
                      duration_months: selection.duration_months,
                    },
                    'access_type',
                    access
                  );

                  return (
                    <button
                      key={access}
                      type="button"
                      disabled={!compat.exists}
                      onClick={() => handleSelectDimension('access_type', access)}
                      className={`${styles.optionPill} ${
                        isSelected ? styles.optionSelected : ''
                      } ${!compat.isAvailable ? styles.optionUnavailable : ''}`}
                    >
                      <span>{formatAccessType(access, locale)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <PriceDisplay variant={selectedVariant} locale={locale} />

      <div className={styles.orderActionsGroup}>
        <div className={styles.cartActionsRow}>
          <button
            type="button"
            disabled={!isOrderable}
            onClick={handleAddToCart}
            className={`${styles.addToCartBtn} ${
              justAdded ? styles.addToCartSuccess : ''
            }`}
          >
            {justAdded ? <Check size={19} /> : <ShoppingCart size={19} />}
            <span>
              {justAdded
                ? cartT('addedToCart')
                : currentVariantQty > 0
                ? `${cartT('addToCart')} (${currentVariantQty})`
                : cartT('addToCart')}
            </span>
          </button>

          {totalItems > 0 && (
            <button
              type="button"
              onClick={openCart}
              className={styles.viewCartSecondaryBtn}
            >
              <span>
                {cartT('viewCartCount', { count: totalItems })}
              </span>
            </button>
          )}
        </div>

        <WhatsAppOrderButton
          phoneNumber={whatsappNumber}
          locale={locale}
          serviceName={serviceName}
          variant={selectedVariant}
        />
      </div>
    </div>
  );
}

