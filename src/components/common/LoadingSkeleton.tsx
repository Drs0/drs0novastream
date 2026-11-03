import styles from './CommonUI.module.scss';

export function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.skeletonGrid} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.skeletonCard} />
      ))}
    </div>
  );
}

