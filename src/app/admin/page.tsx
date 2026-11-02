import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { ServiceRowActions } from '@/components/admin/ServiceRowActions';
import {
  getAdminDashboardStats,
  getAdminServices,
} from '@/lib/catalog/repository';
import styles from '@/components/admin/AdminUI.module.scss';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [stats, services] = await Promise.all([
    getAdminDashboardStats(),
    getAdminServices('en'),
  ]);

  return (
    <AdminProtectedShell>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Services</span>
          <span className={styles.statValue}>{stats.totalServices}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Published Services</span>
          <span className={styles.statValue} style={{ color: '#34d399' }}>
            {stats.publishedServices}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Draft Services</span>
          <span className={styles.statValue} style={{ color: '#fbbf24' }}>
            {stats.draftServices}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Categories</span>
          <span className={styles.statValue}>{stats.totalCategories}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Unavailable Variants</span>
          <span className={styles.statValue} style={{ color: '#f87171' }}>
            {stats.unavailableVariants}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Featured Services</span>
          <span className={styles.statValue} style={{ color: '#06b6d4' }}>
            {stats.featuredServices}
          </span>
        </div>
      </div>

      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <h1 className={styles.panelTitle}>Catalog Services Management</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Manage published &amp; draft services, variants, MAD pricing, and English / French / Moroccan Darija translations.
            </p>
          </div>

          <Link href="/admin/services/new" className={styles.primaryBtn}>
            <Plus size={16} />
            <span>Create Service</span>
          </Link>
        </div>

        <div className={styles.tableWrap}>
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
              {services.map((service) => {
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
                    <td>{service.categoryName}</td>
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
        </div>
      </div>
    </AdminProtectedShell>
  );
}
