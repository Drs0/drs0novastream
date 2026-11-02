'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldAlert } from 'lucide-react';
import { loginAdminAction } from '../actions';
import styles from '@/components/admin/AdminUI.module.scss';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set('email', email);
    formData.set('password', password);

    const res = await loginAdminAction(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.error ?? 'Authentication failed.');
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      dir="ltr"
      lang="en"
    >
      <div
        className={styles.panelCard}
        style={{ width: '100%', maxWidth: '28rem', marginBottom: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <Lock size={22} color="#06b6d4" />
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
            NovaStream Admin Login
          </h1>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Private administration portal. Only authenticated accounts explicitly listed in <code>admin_users</code> may access this dashboard. Public registration is disabled.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <div className={styles.field}>
            <label htmlFor="admin-email" className={styles.label}>
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@novastream.ma"
              className={styles.input}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="admin-password" className={styles.label}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className={styles.input}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'rgba(239,68,68,0.14)',
                color: '#f87171',
                fontSize: '0.85rem',
              }}
            >
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={styles.primaryBtn}
            style={{ width: '100%', marginTop: '0.25rem' }}
          >
            {loading ? 'Verifying Admin Allowlist...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(148,163,184,0.14)',
            fontSize: '0.8rem',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <span>
            <strong>Local Dev / Seed Demo Credentials:</strong>{' '}
            <code>admin@novastream.ma</code> / <code>NovaStreamAdmin2026!</code>
          </span>
          <Link href="/" style={{ color: '#06b6d4', fontWeight: 600 }}>
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

