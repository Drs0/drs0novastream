import styles from './CommonUI.module.scss';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className={styles.stateBox} role="status">
      <h3 className={styles.stateTitle}>{title}</h3>
      <p className={styles.stateDesc}>{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className={styles.primaryActionBtn}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

