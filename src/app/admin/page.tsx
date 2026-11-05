import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { AdminServicesTable } from '@/components/admin/AdminServicesTable';
import {
  getAdminCategories,
  getAdminDashboardStats,
  getAdminServices,
} from '@/lib/catalog/repository';
import styles from '@/components/admin/AdminUI.module.scss';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [stats, services, categories] = await Promise.all([
    getAdminDashboardStats(),
    getAdminServices('en'),
    getAdminCategories('en'),
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

      <AdminServicesTable services={services} categories={categories} />
    </AdminProtectedShell>
  );
}
