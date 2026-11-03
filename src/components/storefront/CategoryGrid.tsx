import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import type { LocalizedCategory } from '@/types/catalog';
import { CategoryCard } from './CategoryCard';
import styles from './CategoryGrid.module.scss';

interface CategoryGridProps {
  categories: LocalizedCategory[];
  showHeader?: boolean;
}

export function CategoryGrid({ categories, showHeader = true }: CategoryGridProps) {
  const t = useTranslations('home');

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {showHeader && (
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.title}>{t('categoriesTitle')}</h2>
              <p className={styles.subtitle}>{t('categoriesSubtitle')}</p>
            </div>
            <Link href="/categories" className={styles.viewAllLink}>
              <span>{t('viewAllCategories')}</span>
              <ArrowRight size={16} className="directionalIcon" />
            </Link>
          </div>
        )}

        <div className={styles.grid}>
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

