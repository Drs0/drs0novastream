'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown, ChevronUp, Star, TrendingUp } from 'lucide-react';
import type { ServiceWithReviewStats } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { formatMadPrice, localizeOfferImagePath } from '@/lib/formatters';
import styles from './HeroVerticalCarousel.module.scss';

interface HeroVerticalCarouselProps {
  items: ServiceWithReviewStats[];
  locale: Locale;
}

const STEP_DURATION_MS = 3800;
const CARD_HEIGHT_DESKTOP = 100; // px (card 90px + gap 10px)

export function HeroVerticalCarousel({ items, locale }: HeroVerticalCarouselProps) {
  const t = useTranslations('hero');
  const catT = useTranslations('catalog');

  // Ensure we have at least 6 items for a seamless 3-card viewport infinite loop
  const baseItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (items.length >= 6) return items;
    const factor = Math.ceil(6 / items.length);
    const expanded: ServiceWithReviewStats[] = [];
    for (let i = 0; i < factor; i++) {
      expanded.push(...items);
    }
    return expanded;
  }, [items]);

  const count = baseItems.length;
  // Triple the items for clone buffers before and after
  const loopItems = useMemo(() => {
    if (count === 0) return [];
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems, count]);

  // Start in the middle clone set (index = count)
  const [currentIndex, setCurrentIndex] = useState(() => count);
  const [isPaused, setIsPaused] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [withTransition, setWithTransition] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor page visibility to prevent runaway timer ticks when browser tab is inactive
  useEffect(() => {
    function handleVisibilityChange() {
      setIsPageVisible(document.visibilityState === 'visible');
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const resetToSafeBounds = useCallback(() => {
    if (count === 0) return;
    if (currentIndex >= count * 2) {
      setWithTransition(false);
      setCurrentIndex((prev) => (prev >= count * 2 ? prev - count : prev));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
    } else if (currentIndex < count) {
      setWithTransition(false);
      setCurrentIndex((prev) => (prev < count ? prev + count : prev));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
    }
  }, [count, currentIndex]);

  // Fallback timer ensuring boundary resets happen even if onTransitionEnd is suppressed by the browser
  useEffect(() => {
    if (currentIndex >= count * 2 || currentIndex < count) {
      const timeout = setTimeout(() => {
        resetToSafeBounds();
      }, 520);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, count, resetToSafeBounds]);

  const handleNext = useCallback(() => {
    if (count <= 1) return;
    setWithTransition(true);
    setCurrentIndex((prev) => {
      // Normalize to middle range before advancing
      const safePrev = count + (((prev - count) % count) + count) % count;
      return safePrev + 1;
    });
  }, [count]);

  const handlePrev = useCallback(() => {
    if (count <= 1) return;
    setWithTransition(true);
    setCurrentIndex((prev) => {
      // Normalize to middle range before going backward
      const safePrev = count + (((prev - count) % count) + count) % count;
      return safePrev - 1;
    });
  }, [count]);

  // Auto-advance vertically every STEP_DURATION_MS
  useEffect(() => {
    if (isPaused || !isPageVisible || count <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, STEP_DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isPageVisible, count, handleNext]);

  function handleTransitionEnd() {
    resetToSafeBounds();
  }

  // If no items, return null safely
  if (!items || items.length === 0 || count === 0) {
    return null;
  }

  // Safety clamp: guarantees cards can NEVER scroll out of view or disappear into an empty container
  const maxSafeIndex = Math.max(0, loopItems.length - 3);
  const safeIndex = Math.max(0, Math.min(currentIndex, maxSafeIndex));

  // The center spotlight card is safeIndex + 1
  const spotlightIndex = safeIndex + 1;
  const activeOriginalIndex =
    (((spotlightIndex % items.length) + items.length) % items.length);

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
            transform: `translateY(-${safeIndex * CARD_HEIGHT_DESKTOP}px)`,
            transition: withTransition
              ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
          }}
        >
          {loopItems.map((item, idx) => {
            const { service, reviewCount, averageRating } = item;
            const isSpotlight = idx === spotlightIndex;
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

