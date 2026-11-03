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
    pathname: '/privacy',
    title: `${t('privacyTitle')} | NovaStream`,
    description: t('privacyContent1'),
  });
}

export default async function PrivacyPage() {
  const locale = await getActiveLocale();
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('privacyTitle')}</h1>
        <p className={styles.pageSubtitle}>{t('privacyUpdated')}</p>
      </div>

      <div className={styles.proseCard}>
        <p className={styles.infoCardBody}>{t('privacyContent1')}</p>
        <p className={styles.infoCardBody}>{t('privacyContent2')}</p>
        <p className={styles.infoCardBody}>{t('privacyContent3')}</p>
      </div>
    </div>
  );
}

