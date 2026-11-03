'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';
import { deleteServiceAction } from '@/app/admin/actions';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Toast } from '@/components/common/Toast';
import styles from './AdminUI.module.scss';

interface ServiceRowActionsProps {
  serviceId: string;
  serviceName: string;
}

export function ServiceRowActions({
  serviceId,
  serviceName,
}: ServiceRowActionsProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  async function handleConfirmDelete() {
    setDeleting(true);
    const res = await deleteServiceAction(serviceId);
    setDeleting(false);
    setConfirmOpen(false);

    if (!res.success) {
      setToast({
        message: res.error ?? 'Failed to delete service.',
        type: 'error',
      });
      return;
    }

    router.refresh();
  }

  return (
    <>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link
          href={`/admin/services/${serviceId}/edit`}
          className={styles.secondaryBtn}
          style={{
            minHeight: '2.1rem',
            padding: '0.25rem 0.7rem',
            fontSize: '0.82rem',
          }}
        >
          <Edit2 size={14} />
          <span>Edit</span>
        </Link>

        <button
          type="button"
          disabled={deleting}
          onClick={() => setConfirmOpen(true)}
          className={styles.dangerBtn}
          style={{
            minHeight: '2.1rem',
            padding: '0.25rem 0.7rem',
            fontSize: '0.82rem',
          }}
          title={`Delete ${serviceName}`}
        >
          <Trash2 size={14} />
          <span>{deleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Service"
        message={`Are you sure you want to permanently delete "${serviceName}" and all its variants?`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete Service'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <Toast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </>
  );
}

