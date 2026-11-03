'use client';

import styles from './CommonUI.module.scss';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  if (!message) return null;

  const variantClass =
    type === 'success'
      ? styles.toastSuccess
      : type === 'error'
      ? styles.toastError
      : '';

  return (
    <div className={`${styles.toast} ${variantClass}`} role="status" aria-live="polite">
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.75,
          }}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

