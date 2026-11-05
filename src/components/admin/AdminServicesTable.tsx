'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, X } from 'lucide-react';
import type { LocalizedCategory, LocalizedService } from '@/types/catalog';
import { ServiceRowActions } from './ServiceRowActions';
import styles from './AdminUI.module.scss';

interface AdminServicesTableProps {
  services: LocalizedService[];
  categories: LocalizedCategory[];
}

export function AdminServicesTable({
  services,
  categories,
}: AdminServicesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      // Category filter
      if (selectedCategory !== 'all' && service.categoryId !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && service.status !== selectedStatus) {
        return false;
      }

      // Text search
      if (!term) return true;

      const matchName = service.name.toLowerCase().includes(term);
      const matchSlug = service.slug.toLowerCase().includes(term);
      const matchCategory = service.categoryName.toLowerCase().includes(term);
      const matchSku = service.variants.some(
        (v) => v.sku && v.sku.toLowerCase().includes(term)
      );
      const matchTier = service.variants.some(
        (v) =>
          (v.tier && v.tier.toLowerCase().includes(term)) ||
          (v.platform && v.platform.toLowerCase().includes(term)) ||
          (v.edition && v.edition.toLowerCase().includes(term))
      );

      return matchName || matchSlug || matchCategory || matchSku || matchTier;
    });
  }, [services, searchTerm, selectedCategory, selectedStatus]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all';

  function handleResetFilters() {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  }

  return (
    <div className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Catalog Services Management</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Manage published &amp; draft services, variants, MAD pricing, and translations.
          </p>
        </div>

        <Link href="/admin/services/new" className={styles.primaryBtn}>
          <Plus size={16} />
          <span>Create Service</span>
        </Link>
      </div>

      {/* Search and Filters Toolbar */}
      <div className={styles.searchToolbar}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by service name, slug, SKU, or console..."
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className={styles.clearSearchBtn}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.searchSelect}
            aria-label="Filter by category"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.searchSelect}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className={styles.secondaryBtn}
              style={{ minHeight: '2.5rem', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            >
              <X size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className={styles.filterMetaRow}>
        <span className={styles.resultCount}>
          Showing <strong>{filteredServices.length}</strong> of{' '}
          <strong>{services.length}</strong> services
        </span>
      </div>

      <div className={styles.tableWrap}>
        {filteredServices.length === 0 ? (
          <div className={styles.emptyTable}>
            <p>No services match your search or filter criteria.</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className={styles.secondaryBtn}
                style={{ marginTop: '0.75rem' }}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Service</th>
                <th>Category</th>
                <th>Status</th>
                <th>Variants &amp; Price (MAD)</th>
                <th>Translations (EN / FR / AR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => {
                const statusBadgeClass =
                  service.status === 'published'
                    ? styles.badgePublished
                    : service.status === 'draft'
                    ? styles.badgeDraft
                    : styles.badgeArchived;

                return (
                  <tr key={service.id}>
                    <td>{service.sortOrder}</td>
                    <td>
                      <strong>{service.name}</strong>
                      {service.isFeatured && (
                        <span
                          className={`${styles.badge} ${styles.badgePublished}`}
                          style={{ marginInlineStart: '0.5rem' }}
                        >
                          Featured
                        </span>
                      )}
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        <code>/{service.slug}</code>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryTag}>
                        {service.categoryName}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${statusBadgeClass}`}>
                        {service.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong>{service.variants.length}</strong> variant(s)
                      {service.priceSummary.minPriceMad !== null && (
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                          {service.priceSummary.minPriceMad} DH –{' '}
                          {service.priceSummary.maxPriceMad} DH
                        </div>
                      )}
                    </td>
                    <td>
                      {service.missingLocales.length === 0 ? (
                        <span
                          className={`${styles.badge} ${styles.badgePublished}`}
                        >
                          All 3 Locales Ready
                        </span>
                      ) : (
                        <span
                          className={`${styles.badge} ${styles.badgeMissing}`}
                        >
                          Missing:{' '}
                          {service.missingLocales.join(', ').toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td>
                      <ServiceRowActions
                        serviceId={service.id}
                        serviceName={service.name}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

