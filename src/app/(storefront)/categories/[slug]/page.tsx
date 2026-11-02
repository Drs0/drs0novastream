import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getActiveLocale } from '@/i18n/request';
import {
  getPublicCategories,
  getPublicCategoryBySlug,
  getPublicServices,
} from '@/lib/catalog/repository';
import { buildLocalizedMetadata } from '@/lib/seo';
import { ServiceFilters } from '@/components/storefront/ServiceFilters';
import styles from '../../StorefrontPages.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getActiveLocale()]);
  const category = await getPublicCategoryBySlug(slug, locale);

  if (!category) {
    return { title: 'Category Not Found | NovaStream' };
  }

  return buildLocalizedMetadata({
    locale,
    pathname: `/categories/${category.slug}`,
    title: `${category.name} | NovaStream`,
    description: category.description ?? category.name,
    imagePath: category.imagePath,
  });
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getActiveLocale()]);

  const [category, categories, services] = await Promise.all([
    getPublicCategoryBySlug(slug, locale),
    getPublicCategories(locale),
    getPublicServices(locale),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{category.name}</h1>
        {category.description && (
          <p className={styles.pageSubtitle}>{category.description}</p>
        )}
      </div>

      <ServiceFilters
        services={services}
        categories={categories}
        locale={locale}
        initialCategorySlug={category.slug}
      />
    </div>
  );
}

