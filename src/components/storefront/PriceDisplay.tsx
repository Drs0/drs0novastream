import { useTranslations } from 'next-intl';
import type { Locale, ServiceVariantRow } from '@/types/database';
import { formatMadPrice } from '@/lib/formatters';
import { getEffectiveVariantPriceMad } from '@/lib/catalog/pricing';
import styles from './ServiceDetailClient.module.scss';

interface PriceDisplayProps {
  variant: ServiceVariantRow | null;
  locale: Locale;
}

export function PriceDisplay({ variant, locale }: PriceDisplayProps) {
  const t = useTranslations('serviceDetail');
  const catT = useTranslations('catalog');

  if (!variant) {
    return (
      <div className={styles.priceBox}>
        <p className={styles.noticeText}>{t('selectValidCombination')}</p>
      </div>
    );
  }

  const effectivePrice = getEffectiveVariantPriceMad(variant);
  const hasDiscount =
    variant.sale_price_mad !== null && variant.sale_price_mad < variant.price_mad;

  return (
    <div className={styles.priceBox}>
      <div className={styles.priceHeader}>
        <span>{t('exactPriceLabel')}</span>
        <span
          className={`${styles.statusBadge} ${
            variant.is_available ? styles.badgeAvailable : styles.badgeUnavailable
          }`}
        >
          ● {variant.is_available ? catT('available') : catT('unavailable')}
        </span>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.currentPrice}>
          {formatMadPrice(effectivePrice, locale)}
        </span>
        {hasDiscount && (
          <span className={styles.oldPrice} title={t('regularPriceLabel')}>
            {formatMadPrice(variant.price_mad, locale)}
          </span>
        )}
      </div>

      {variant.sku && (
        <div className={styles.priceHeader}>
          <span>
            {t('skuLabel')}: <strong className="ltrInline">{variant.sku}</strong>
          </span>
        </div>
      )}

      {!variant.is_available && (
        <p className={styles.noticeText}>{t('variantUnavailableNotice')}</p>
      )}
    </div>
  );
}

