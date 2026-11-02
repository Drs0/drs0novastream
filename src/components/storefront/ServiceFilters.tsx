'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import type { LocalizedCategory, LocalizedService } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { ServiceCard } from './ServiceCard';
import { EmptyState } from '@/components/common/EmptyState';
import styles from './ServiceFilters.module.scss';

interface ServiceFiltersProps {
  services: LocalizedService[];
  categories: LocalizedCategory[];
  locale: Locale;
  initialCategorySlug?: string;
}

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'name_asc';

const PAGE_SIZE = 6;

export function ServiceFilters({
  services,
  categories,
  locale,
  initialCategorySlug = 'all',
}: ServiceFiltersProps) {
  const t = useTranslations('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Extract distinct platforms across all published services
  const availablePlatforms = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      s.variants.forEach((v) => {
        if (v.platform) set.add(v.platform);
      });
    });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = services.filter((service) => {
      if (selectedCategory !== 'all' && service.categorySlug !== selectedCategory) {
        return false;
      }

      if (selectedPlatform !== 'all') {
        const hasPlatform = service.variants.some(
          (v) => v.platform === selectedPlatform
        );
        if (!hasPlatform) return false;
      }

      if (query) {
        const inName = service.name.toLowerCase().includes(query);
        const inShortDesc = (service.shortDescription ?? '')
          .toLowerCase()
          .includes(query);
        const inCategory = service.categoryName.toLowerCase().includes(query);
        return inName || inShortDesc || inCategory;
      }

      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (a.priceSummary.minPriceMad ?? 999999) - (b.priceSummary.minPriceMad ?? 999999);
      }
      if (sortBy === 'price_desc') {
        return (b.priceSummary.minPriceMad ?? 0) - (a.priceSummary.minPriceMad ?? 0);
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name, locale);
      }
      // Default: featured first, then sortOrder
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return a.sortOrder - b.sortOrder;
    });

    return list;
  }, [services, searchQuery, selectedCategory, selectedPlatform, sortBy, locale]);

  const displayedServices = filteredServices.slice(0, visibleCount);
  const hasFiltersActive =
    searchQuery.trim().length > 0 ||
    selectedCategory !== initialCategorySlug ||
    selectedPlatform !== 'all' ||
    sortBy !== 'featured';

  function handleReset() {
    setSearchQuery('');
    setSelectedCategory(initialCategorySlug);
    setSelectedPlatform('all');
    setSortBy('featured');
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBar}>
        <div className={styles.fieldGroup}>
          <label htmlFor="catalog-search" className={styles.fieldLabel}>
            {t('searchPlaceholder')}
          </label>
          <div className={styles.inputWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder={t('searchPlaceholder')}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="catalog-category" className={styles.fieldLabel}>
            {t('filterCategory')}
          </label>
          <select
            id="catalog-category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={styles.selectInput}
          >
            <option value="all">{t('allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="catalog-platform" className={styles.fieldLabel}>
            {t('filterPlatform')}
          </label>
          <select
            id="catalog-platform"
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className={styles.selectInput}
          >
            <option value="all">{t('allPlatforms')}</option>
            {availablePlatforms.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="catalog-sort" className={styles.fieldLabel}>
            {t('sortBy')}
          </label>
          <select
            id="catalog-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className={styles.selectInput}
          >
            <option value="featured">{t('sortFeatured')}</option>
            <option value="price_asc">{t('sortPriceAsc')}</option>
            <option value="price_desc">{t('sortPriceDesc')}</option>
            <option value="name_asc">{t('sortNameAsc')}</option>
          </select>
        </div>
      </div>

      <div className={styles.resultsMeta}>
        <span>{t('showingCount', { count: filteredServices.length })}</span>
        {hasFiltersActive && (
          <button type="button" onClick={handleReset} className={styles.resetBtn}>
            {t('resetFilters')}
          </button>
        )}
      </div>

      {filteredServices.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={t('emptyDescription')}
          actionLabel={t('resetFilters')}
          onAction={handleReset}
        />
      ) : (
        <>
          <div className={styles.grid}>
            {displayedServices.map((service) => (
              <ServiceCard key={service.id} service={service} locale={locale} />
            ))}
          </div>

          {visibleCount < filteredServices.length && (
            <div className={styles.loadMoreRow}>
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

