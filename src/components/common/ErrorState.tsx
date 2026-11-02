import styles from './CommonUI.module.scss';

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.stateBox} role="alert">
      <h3 className={styles.stateTitle}>{title}</h3>
      <p className={styles.stateDesc}>{description}</p>
      {onRetry && (
        <button type="button" className={styles.primaryActionBtn} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

