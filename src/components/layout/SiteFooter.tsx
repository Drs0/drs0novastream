import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { PublicSiteSettings } from '@/types/catalog';
import styles from './SiteFooter.module.scss';

interface SiteFooterProps {
  settings: PublicSiteSettings;
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <Link href="/" className={`${styles.brandTitle} ltrInline`}>
              Nova<span className={styles.brandAccent}>Stream</span>
            </Link>
            <p className={styles.tagline}>{t('tagline')}</p>
            <div className={styles.socialRow}>
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialPill} ltrInline`}
                >
                  Instagram
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialPill} ltrInline`}
                >
                  Facebook
                </a>
              )}
              {settings.socialLinks?.tiktok && (
                <a
                  href={settings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.socialPill} ltrInline`}
                >
                  TikTok
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className={styles.colTitle}>{t('navigation')}</h2>
            <ul className={styles.linkList}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  {nav('home')}
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.footerLink}>
                  {nav('services')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className={styles.footerLink}>
                  {nav('categories')}
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  {nav('about')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.colTitle}>{t('legal')}</h2>
            <ul className={styles.linkList}>
              <li>
                <Link href="/privacy" className={styles.footerLink}>
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.footerLink}>
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className={styles.colTitle}>{t('contact')}</h2>
            <ul className={styles.linkList}>
              <li>
                <span className={`${styles.footerLink} ltrInline`}>
                  +{settings.whatsappNumber}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className={`${styles.footerLink} ltrInline`}
                >
                  {settings.contactEmail}
                </a>
              </li>
              <li>
                <span className={`${styles.footerLink} ltrInline`}>
                  {settings.supportHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>{t('rights', { year: currentYear })}</span>
          <NextLink href="/admin" className={styles.footerLink}>
            {nav('admin')}
          </NextLink>
        </div>
      </div>
    </footer>
  );
}

