import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import type { LocalizedService } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { ServiceCard } from './ServiceCard';
import styles from './ServiceCard.module.scss';

interface FeaturedServicesProps {
  services: LocalizedService[];
  locale: Locale;
}

export function FeaturedServices({ services, locale }: FeaturedServicesProps) {
  const t = useTranslations('home');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.title}>{t('featuredTitle')}</h2>
            <p className={styles.subtitle}>{t('featuredSubtitle')}</p>
          </div>
          <Link href="/services" className={styles.viewAllLink}>
            <span>{t('viewAllServices')}</span>
            <ArrowRight size={16} className="directionalIcon" />
          </Link>
        </div>

        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

