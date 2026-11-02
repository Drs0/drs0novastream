import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getActiveLocale } from '@/i18n/request';
import { buildLocalizedMetadata } from '@/lib/seo';
import styles from '../StorefrontPages.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'legal' });

  return buildLocalizedMetadata({
    locale,
    pathname: '/terms',
    title: `${t('termsTitle')} | NovaStream`,
    description: t('termsContent1'),
  });
}

export default async function TermsPage() {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('termsTitle')}</h1>
        <p className={styles.pageSubtitle}>{t('termsUpdated')}</p>
      </div>

      <div className={styles.proseCard}>
        <p className={styles.infoCardBody}>{t('termsContent1')}</p>
        <p className={styles.infoCardBody}>{t('termsContent2')}</p>
        <p className={styles.infoCardBody}>{t('termsContent3')}</p>
      </div>
    </div>
  );
}

