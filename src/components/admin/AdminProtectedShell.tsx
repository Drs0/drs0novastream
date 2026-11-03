import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getAdminSessionStatus } from '@/lib/supabase/auth';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import styles from './AdminUI.module.scss';

export async function AdminProtectedShell({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSessionStatus();

  if (!session.isAuthenticated || !session.isAuthorizedAdmin) {
    redirect('/admin/login');
  }

  return (
    <div className={styles.adminShell} dir="ltr" lang="en">
      <AdminSidebar />
      <div className={styles.mainArea}>
        <AdminHeader email={session.email} isMockMode={session.isMockMode} />
        <div className={styles.contentPad}>{children}</div>
      </div>
    </div>
  );
}

