import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import { getPublicCategories, getPublicServices } from '@/lib/catalog/repository';
import { buildLocalizedMetadata } from '@/lib/seo';
import { ServiceFilters } from '@/components/storefront/ServiceFilters';
import styles from '../StorefrontPages.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'catalog' });

  return buildLocalizedMetadata({
    locale,
    pathname: '/services',
    title: `${t('title')} | NovaStream`,
    description: t('subtitle'),
  });
}

export default async function ServicesCatalogPage() {
  const locale = await getActiveLocale();

  const [services, categories, t] = await Promise.all([
    getPublicServices(locale),
    getPublicCategories(locale),
    getTranslations({ locale, namespace: 'catalog' }),
  ]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('title')}</h1>
        <p className={styles.pageSubtitle}>{t('subtitle')}</p>
      </div>

      <ServiceFilters
        services={services}
        categories={categories}
        locale={locale}
      />
    </div>
  );
}

