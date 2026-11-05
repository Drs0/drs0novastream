'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown, ChevronUp, MessageSquare, Star, TrendingUp } from 'lucide-react';
import type { ServiceWithReviewStats } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { formatMadPrice, localizeOfferImagePath } from '@/lib/formatters';
import styles from './HeroVerticalCarousel.module.scss';

interface HeroVerticalCarouselProps {
  items: ServiceWithReviewStats[];
  locale: Locale;
}

const STEP_DURATION_MS = 3600;
const CARD_HEIGHT_DESKTOP = 100; // px (card + gap)

export function HeroVerticalCarousel({ items, locale }: HeroVerticalCarouselProps) {
  const t = useTranslations('hero');
  const catT = useTranslations('catalog');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [withTransition, setWithTransition] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If no items, return null safely
  if (!items || items.length === 0) {
    return null;
  }

  // Triple items for infinite looping
  const count = items.length;
  const loopItems = [...items, ...items, ...items];

  // Auto-advance vertically every STEP_DURATION_MS
  useEffect(() => {
    if (isPaused || count <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
      setWithTransition(true);
    }, STEP_DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, count]);

  function handleTransitionEnd() {
    // When reached end of second clone, seamlessly reset to middle clone without transition
    if (currentIndex >= count * 2) {
      setWithTransition(false);
      setCurrentIndex((prev) => prev - count);
    } else if (currentIndex < count) {
      // If went backwards past start
      setWithTransition(false);
      setCurrentIndex((prev) => prev + count);
    }
  }

  function handleNext() {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }

  function handlePrev() {
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }

  const activeOriginalIndex = ((currentIndex % count) + count) % count;

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label={t('topRatedBadge')}
    >
      <div className={styles.headerBar}>
        <div className={styles.badgeWrap}>
          <TrendingUp size={15} className={styles.flameIcon} />
          <span className={styles.badgeText}>{t('topRatedBadge')}</span>
        </div>

        <div className={styles.navControls}>
          <button
            type="button"
            onClick={handlePrev}
            className={styles.navBtn}
            aria-label="Previous service"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={styles.navBtn}
            aria-label="Next service"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div className={styles.topGradient} aria-hidden="true" />
        <div className={styles.bottomGradient} aria-hidden="true" />

        <div
          className={styles.track}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateY(-${currentIndex * CARD_HEIGHT_DESKTOP}px)`,
            transition: withTransition
              ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
          }}
        >
          {loopItems.map((item, idx) => {
            const { service, reviewCount, averageRating } = item;
            const isSpotlight = idx === currentIndex + 1; // Center card in 3-card window
            const imgSrc =
              localizeOfferImagePath(service.coverImagePath, locale) ||
              '/images/services/ps-plus-cover.svg';

            const minPrice = service.priceSummary.minPriceMad;
            const priceText =
              minPrice !== null
                ? service.priceSummary.hasSingleVariant
                  ? formatMadPrice(minPrice, locale)
                  : catT('fromPrice', { price: formatMadPrice(minPrice, locale) })
                : '—';

            return (
              <Link
                key={`${service.id}-${idx}`}
                href={`/services/${service.slug}`}
                className={`${styles.card} ${isSpotlight ? styles.cardSpotlight : ''}`}
                tabIndex={isSpotlight ? 0 : -1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={service.name}
                  className={styles.cardImage}
                  width={68}
                  height={68}
                  loading="lazy"
                />

                <div className={styles.cardContent}>
                  <div className={styles.metaRow}>
                    <span className={styles.categoryName}>
                      {service.categoryName}
                    </span>
                    <span className={styles.reviewBadge}>
                      <Star size={12} className={styles.starIcon} />
                      <span className={styles.avgRating}>{averageRating.toFixed(1)}</span>
                      {reviewCount > 0 && (
                        <span className={styles.countText}>
                          ({reviewCount})
                        </span>
                      )}
                    </span>
                  </div>

                  <h3 className={styles.serviceName}>{service.name}</h3>

                  <div className={styles.footerRow}>
                    <span className={styles.priceLabel}>{priceText}</span>
                    <span className={styles.viewBadge}>
                      {t('primaryCta')} →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles.dotsRow} aria-hidden="true">
        {items.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${
              i === activeOriginalIndex ? styles.dotActive : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}

