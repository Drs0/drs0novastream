import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import {
  getPublicCategories,
  getPublicServices,
  getPublicSiteSettings,
} from '@/lib/catalog/repository';
import { buildLocalizedMetadata } from '@/lib/seo';
import { HeroSection } from '@/components/storefront/HeroSection';
import { CategoryGrid } from '@/components/storefront/CategoryGrid';
import { FeaturedServices } from '@/components/storefront/FeaturedServices';
import { FAQAccordion } from '@/components/storefront/FAQAccordion';
import styles from './StorefrontPages.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'meta' });

  return buildLocalizedMetadata({
    locale,
    pathname: '/',
    title: t('defaultTitle'),
    description: t('defaultDescription'),
  });
}

export default async function HomePage() {
  const locale = await getActiveLocale();

  const [categories, services, settings, homeT] = await Promise.all([
    getPublicCategories(locale),
    getPublicServices(locale),
    getPublicSiteSettings(),
    getTranslations({ locale, namespace: 'home' }),
  ]);

  const featuredServices = services.filter((s) => s.isFeatured).slice(0, 6);
  const displayFeatured =
    featuredServices.length > 0 ? featuredServices : services.slice(0, 6);

  return (
    <>
      <HeroSection locale={locale} whatsappNumber={settings.whatsappNumber} />

      <CategoryGrid categories={categories} />

      <FeaturedServices services={displayFeatured} locale={locale} />

      <section className={styles.howItWorksSection}>
        <div className={styles.pageContainer} style={{ paddingBlock: '0.5rem' }}>
          <h2 className={styles.pageTitle} style={{ fontSize: '1.85rem' }}>
            {homeT('howItWorksTitle')}
          </h2>
          <p className={styles.pageSubtitle}>{homeT('howItWorksSubtitle')}</p>

          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <h3 className={styles.stepTitle}>{homeT('step1Title')}</h3>
              <p className={styles.stepText}>{homeT('step1Text')}</p>
            </div>
            <div className={styles.stepCard}>
              <h3 className={styles.stepTitle}>{homeT('step2Title')}</h3>
              <p className={styles.stepText}>{homeT('step2Text')}</p>
            </div>
            <div className={styles.stepCard}>
              <h3 className={styles.stepTitle}>{homeT('step3Title')}</h3>
              <p className={styles.stepText}>{homeT('step3Text')}</p>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion />
    </>
  );
}

