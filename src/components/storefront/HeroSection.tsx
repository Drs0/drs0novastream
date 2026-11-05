import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import type { Locale } from '@/types/database';
import type { ServiceWithReviewStats } from '@/types/catalog';
import { HeroVerticalCarousel } from './HeroVerticalCarousel';
import styles from './HeroSection.module.scss';

interface HeroSectionProps {
  locale: Locale;
  whatsappNumber: string;
  topReviewed?: ServiceWithReviewStats[];
}

export function HeroSection({
  locale,
  whatsappNumber,
  topReviewed = [],
}: HeroSectionProps) {
  const t = useTranslations('hero');
  const whatsappUrl = buildGeneralWhatsAppUrl(whatsappNumber, locale);

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.contentCol}>
          <span className={styles.badge}>
            <Sparkles size={15} />
            <span>{t('badge')}</span>
          </span>

          <h1 className={styles.headline}>{t('headline')}</h1>
          <p className={styles.description}>{t('description')}</p>

          <div className={styles.ctaGroup}>
            <Link href="/services" className={styles.primaryBtn}>
              <span>{t('primaryCta')}</span>
              <ArrowRight size={18} className="directionalIcon" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              <MessageCircle size={18} />
              <span>{t('secondaryCta')}</span>
            </a>
          </div>
        </div>

        {topReviewed.length > 0 && (
          <div className={styles.carouselCol}>
            <HeroVerticalCarousel items={topReviewed} locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}

