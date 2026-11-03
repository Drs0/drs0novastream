import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import { getPublicCategories } from '@/lib/catalog/repository';
import { buildLocalizedMetadata } from '@/lib/seo';
import { CategoryGrid } from '@/components/storefront/CategoryGrid';
import styles from '../StorefrontPages.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale();
  const t = await getTranslations({
    locale,
    namespace: 'categoriesPage',
  });

  return buildLocalizedMetadata({
    locale,
    pathname: '/categories',
    title: `${t('title')} | NovaStream`,
    description: t('subtitle'),
  });
}

export default async function CategoriesIndexPage() {
  const locale = await getActiveLocale();
  const [categories, t] = await Promise.all([
    getPublicCategories(locale),
    getTranslations({ locale, namespace: 'categoriesPage' }),
  ]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('title')}</h1>
        <p className={styles.pageSubtitle}>{t('subtitle')}</p>
      </div>

      <CategoryGrid categories={categories} showHeader={false} />
    </div>
  );
}

