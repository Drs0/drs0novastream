import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import type { LocalizedService } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { formatMadPrice } from '@/lib/formatters';
import { QuickAddToCartButton } from './QuickAddToCartButton';
import styles from './ServiceCard.module.scss';

interface ServiceCardProps {
  service: LocalizedService;
  locale: Locale;
}

export function ServiceCard({ service, locale }: ServiceCardProps) {
  const t = useTranslations('catalog');
  const { priceSummary } = service;
  const isAvailable = priceSummary.availableCount > 0;
  const defaultAvailableVariant =
    service.variants.find((v) => v.is_available) ?? null;

  let priceText = '—';
  if (priceSummary.minPriceMad !== null) {
    const formattedMin = formatMadPrice(priceSummary.minPriceMad, locale);
    if (priceSummary.hasSingleVariant) {
      priceText = formattedMin;
    } else {
      priceText = t('fromPrice', { price: formattedMin });
    }
  }

  return (
    <article className={styles.serviceCard}>
      <Link href={`/services/${service.slug}`} className={styles.mediaWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.coverImagePath || '/images/services/ps-plus-cover.svg'}
          alt={service.imageAlt}
          className={styles.coverImg}
          loading="lazy"
          decoding="async"
          width={900}
          height={900}
        />
        <div className={styles.badgesOverlay}>
          {service.isFeatured && (
            <span className={styles.featuredBadge}>{t('featuredBadge')}</span>
          )}
          {priceSummary.hasDiscount && (
            <span className={styles.saleBadge}>{t('saleBadge')}</span>
          )}
        </div>
      </Link>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.categoryLabel}>{service.categoryName}</span>
          <span
            className={`${styles.statusDot} ${
              isAvailable ? styles.statusAvailable : styles.statusUnavailable
            }`}
          >
            ● {isAvailable ? t('available') : t('unavailable')}
          </span>
        </div>

        <h3 className={styles.cardTitle}>
          <Link href={`/services/${service.slug}`}>{service.name}</Link>
        </h3>

        {service.shortDescription && (
          <p className={styles.shortDesc}>{service.shortDescription}</p>
        )}

        <div className={styles.footerRow}>
          <span className={styles.priceLabel}>{priceText}</span>
          <div className={styles.footerActions}>
            <QuickAddToCartButton
              serviceId={service.id}
              serviceSlug={service.slug}
              serviceName={service.name}
              coverImagePath={service.coverImagePath}
              defaultVariant={defaultAvailableVariant}
            />
            <Link href={`/services/${service.slug}`} className={styles.ctaBtn}>
              <span>{t('viewDetails')}</span>
              <ArrowRight size={15} className="directionalIcon" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

