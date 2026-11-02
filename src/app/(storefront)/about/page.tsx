import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import { buildLocalizedMetadata } from '@/lib/seo';
import styles from '../StorefrontPages.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'aboutPage' });

  return buildLocalizedMetadata({
    locale,
    pathname: '/about',
    title: `${t('title')} | NovaStream`,
    description: t('subtitle'),
  });
}

export default async function AboutPage() {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'aboutPage' });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('title')}</h1>
        <p className={styles.pageSubtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.proseCard}>
        <p className={styles.infoCardBody}>{t('p1')}</p>
        <p className={styles.infoCardBody}>{t('p2')}</p>
        <p className={styles.infoCardBody}>{t('p3')}</p>
      </div>

      <h2
        className={styles.pageTitle}
        style={{ fontSize: '1.55rem', marginTop: '3rem' }}
      >
        {t('valuesTitle')}
      </h2>

      <div className={styles.valuesGrid}>
        <div className={styles.stepCard}>
          <h3 className={styles.stepTitle}>{t('v1Title')}</h3>
          <p className={styles.stepText}>{t('v1Text')}</p>
        </div>
        <div className={styles.stepCard}>
          <h3 className={styles.stepTitle}>{t('v2Title')}</h3>
          <p className={styles.stepText}>{t('v2Text')}</p>
        </div>
        <div className={styles.stepCard}>
          <h3 className={styles.stepTitle}>{t('v3Title')}</h3>
          <p className={styles.stepText}>{t('v3Text')}</p>
        </div>
      </div>
    </div>
  );
}

