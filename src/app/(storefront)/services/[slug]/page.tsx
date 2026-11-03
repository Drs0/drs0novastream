import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getActiveLocale } from '@/i18n/request';
import {
  getPublicServiceBySlug,
  getPublicServiceReviews,
  getPublicServices,
  getPublicSiteSettings,
} from '@/lib/catalog/repository';
import { buildLocalizedMetadata } from '@/lib/seo';
import { ServiceGallery } from '@/components/storefront/ServiceGallery';
import { VariantSelector } from '@/components/storefront/VariantSelector';
import { ServiceCard } from '@/components/storefront/ServiceCard';
import { ServiceReviews } from '@/components/storefront/ServiceReviews';
import styles from '../../StorefrontPages.module.scss';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getActiveLocale()]);
  const service = await getPublicServiceBySlug(slug, locale);

  if (!service) {
    return { title: 'Service Not Found | NovaStream' };
  }

  return buildLocalizedMetadata({
    locale,
    pathname: `/services/${service.slug}`,
    title: service.seoTitle,
    description: service.seoDescription,
    imagePath: service.coverImagePath,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, locale] = await Promise.all([params, getActiveLocale()]);

  const [service, allServices, settings, t] = await Promise.all([
    getPublicServiceBySlug(slug, locale),
    getPublicServices(locale),
    getPublicSiteSettings(),
    getTranslations({ locale, namespace: 'serviceDetail' }),
  ]);

  if (!service) {
    notFound();
  }

  const reviews = await getPublicServiceReviews(service.id);

  const relatedServices = allServices
    .filter(
      (s) => s.id !== service.id && s.categoryId === service.categoryId
    )
    .slice(0, 3);

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>
          {t('breadcrumbHome')}
        </Link>
        <span>/</span>
        <Link href="/services" className={styles.breadcrumbLink}>
          {t('breadcrumbServices')}
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${service.categorySlug}`}
          className={styles.breadcrumbLink}
        >
          {service.categoryName}
        </Link>
        <span>/</span>
        <span aria-current="page">{service.name}</span>
      </nav>

      <div className={styles.detailLayout}>
        <div>
          <ServiceGallery
            coverImagePath={service.coverImagePath}
            galleryPaths={service.galleryPaths}
            imageAlt={service.imageAlt}
          />
        </div>

        <div>
          <div className={styles.detailHeader}>
            <Link
              href={`/categories/${service.categorySlug}`}
              className={styles.categoryPill}
            >
              {service.categoryName}
            </Link>
            <h1 className={styles.detailTitle}>{service.name}</h1>
            {service.shortDescription && (
              <p className={styles.detailShortDesc}>
                {service.shortDescription}
              </p>
            )}
          </div>

          <VariantSelector
            serviceId={service.id}
            serviceSlug={service.slug}
            serviceName={service.name}
            coverImagePath={service.coverImagePath}
            variants={service.variants}
            locale={locale}
            whatsappNumber={settings.whatsappNumber}
          />
        </div>
      </div>

      <div className={styles.infoSections}>
        {service.description && (
          <section className={styles.infoCard}>
            <h2 className={styles.infoCardTitle}>{t('descriptionHeading')}</h2>
            <div className={styles.infoCardBody}>{service.description}</div>
          </section>
        )}

        {service.termsText && (
          <section className={styles.infoCard}>
            <h2 className={styles.infoCardTitle}>{t('termsHeading')}</h2>
            <div className={styles.infoCardBody}>{service.termsText}</div>
          </section>
        )}
      </div>

      <ServiceReviews
        serviceId={service.id}
        serviceSlug={service.slug}
        initialReviews={reviews}
        locale={locale}
      />

      {relatedServices.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.infoCardTitle} style={{ fontSize: '1.45rem' }}>
            {t('relatedHeading')}
          </h2>
          <div className={styles.relatedGrid}>
            {relatedServices.map((rel) => (
              <ServiceCard key={rel.id} service={rel} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

