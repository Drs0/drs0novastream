'use client';

import { useRouter } from 'next/navigation';
import { LogOut, ShieldCheck } from 'lucide-react';
import { logoutAdminAction } from '@/app/admin/actions';
import styles from './AdminUI.module.scss';

interface AdminHeaderProps {
  email: string | null;
  isMockMode: boolean;
}

export function AdminHeader({ email, isMockMode }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await logoutAdminAction();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <header className={styles.adminHeader}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck size={20} color="#06b6d4" />
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          Authorized Admin: {email ?? 'Admin'}
        </span>
        {isMockMode ? (
          <span className={styles.modeBanner}>
            Seed / Local Dev Mode (Configure .env.local for live Supabase DB)
          </span>
        ) : (
          <span className={styles.liveBanner}>Supabase Connected + RLS Active</span>
        )}
      </div>

      <button type="button" onClick={handleLogout} className={styles.secondaryBtn}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </header>
  );
}

