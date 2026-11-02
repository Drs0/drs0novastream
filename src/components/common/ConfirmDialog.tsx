'use client';

import styles from './CommonUI.module.scss';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className={styles.dialogBackdrop} role="dialog" aria-modal="true">
      <div className={styles.dialogPanel}>
        <h3 className={styles.stateTitle}>{title}</h3>
        <p className={styles.stateDesc}>{message}</p>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={styles.dangerBtn} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

