import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Clock, Mail, MessageCircle, ShieldAlert } from 'lucide-react';
import { getActiveLocale } from '@/i18n/request';
import { getPublicSiteSettings } from '@/lib/catalog/repository';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { buildLocalizedMetadata } from '@/lib/seo';
import styles from '../StorefrontPages.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getActiveLocale();
  const t = await getTranslations({
    locale,
    namespace: 'contactPage',
  });

  return buildLocalizedMetadata({
    locale,
    pathname: '/contact',
    title: `${t('title')} | NovaStream`,
    description: t('subtitle'),
  });
}

export default async function ContactPage() {
  const locale = await getActiveLocale();
  const [settings, t] = await Promise.all([
    getPublicSiteSettings(),
    getTranslations({ locale, namespace: 'contactPage' }),
  ]);

  const whatsappUrl = buildGeneralWhatsAppUrl(
    settings.whatsappNumber,
    locale
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t('title')}</h1>
        <p className={styles.pageSubtitle}>{t('subtitle')}</p>
      </div>

      <div className={styles.valuesGrid}>
        <div className={styles.stepCard}>
          <MessageCircle size={26} color="#25d366" />
          <h2 className={styles.stepTitle}>{t('whatsappCardTitle')}</h2>
          <p className={styles.stepText}>{t('whatsappCardText')}</p>
          <p className="ltrInline" style={{ fontWeight: 700, marginTop: '0.25rem' }}>
            +{settings.whatsappNumber}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '0.65rem',
              background: '#25d366',
              color: '#04150a',
              fontWeight: 800,
            }}
          >
            <MessageCircle size={18} />
            <span>{t('whatsappButton')}</span>
          </a>
        </div>

        <div className={styles.stepCard}>
          <Mail size={26} color="#06b6d4" />
          <h2 className={styles.stepTitle}>{t('emailCardTitle')}</h2>
          <a
            href={`mailto:${settings.contactEmail}`}
            className="ltrInline"
            style={{ color: '#22d3ee', fontWeight: 700, marginTop: '0.5rem' }}
          >
            {settings.contactEmail}
          </a>
        </div>

        <div className={styles.stepCard}>
          <Clock size={26} color="#3b82f6" />
          <h2 className={styles.stepTitle}>{t('hoursCardTitle')}</h2>
          <p className="ltrInline" style={{ fontWeight: 700, marginTop: '0.5rem' }}>
            {settings.supportHours}
          </p>
        </div>
      </div>

      <div
        className={styles.infoCard}
        style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}
      >
        <ShieldAlert size={22} color="#f59e0b" />
        <p className={styles.infoCardBody}>{t('noteText')}</p>
      </div>
    </div>
  );
}

