import { Link } from '@/i18n/routing';
import type { LocalizedCategory } from '@/types/catalog';
import styles from './CategoryGrid.module.scss';

interface CategoryCardProps {
  category: LocalizedCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className={styles.card}>
      <div className={styles.iconWrap}>
        {category.imagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.imagePath}
            alt={category.name}
            className={styles.iconImg}
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true">🎮</span>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{category.name}</h3>
        {category.description && (
          <p className={styles.cardDesc}>{category.description}</p>
        )}
      </div>
    </Link>
  );
}

