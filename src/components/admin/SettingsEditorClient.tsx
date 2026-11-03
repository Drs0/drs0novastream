'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import type { PublicSiteSettings } from '@/types/catalog';
import type { Locale } from '@/types/database';
import { saveSiteSettingsAction } from '@/app/admin/actions';
import { Toast } from '@/components/common/Toast';
import styles from './AdminUI.module.scss';

interface SettingsEditorClientProps {
  initialSettings: PublicSiteSettings;
}

export function SettingsEditorClient({
  initialSettings,
}: SettingsEditorClientProps) {
  const router = useRouter();
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialSettings.whatsappNumber
  );
  const [contactEmail, setContactEmail] = useState(
    initialSettings.contactEmail
  );
  const [supportHours, setSupportHours] = useState(
    initialSettings.supportHours
  );
  const [defaultLocale, setDefaultLocale] = useState<Locale>(
    initialSettings.defaultLocale
  );
  const [instagram, setInstagram] = useState(
    initialSettings.socialLinks?.instagram ?? ''
  );
  const [facebook, setFacebook] = useState(
    initialSettings.socialLinks?.facebook ?? ''
  );
  const [tiktok, setTiktok] = useState(
    initialSettings.socialLinks?.tiktok ?? ''
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    const res = await saveSiteSettingsAction({
      whatsappNumber: whatsappNumber.trim(),
      contactEmail: contactEmail.trim(),
      supportHours: supportHours.trim(),
      defaultLocale,
      socialLinks: {
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        tiktok: tiktok.trim(),
      },
    });

    setSaving(false);
    if (!res.success) {
      setToast({
        message: res.error ?? 'Failed to save settings.',
        type: 'error',
      });
      return;
    }

    setToast({
      message: 'Website settings updated!',
      type: 'success',
    });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.panelCard}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Website &amp; WhatsApp Settings</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Configure the public WhatsApp ordering phone number (international format without +), contact details, and social links.
          </p>
        </div>

        <button type="submit" disabled={saving} className={styles.primaryBtn}>
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>
            WhatsApp Phone Number (International format, no + sign) *
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="212600000000"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Contact Email *</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Support Hours *</label>
          <input
            type="text"
            value={supportHours}
            onChange={(e) => setSupportHours(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Default Storefront Language</label>
          <select
            value={defaultLocale}
            onChange={(e) => setDefaultLocale(e.target.value as Locale)}
            className={styles.select}
          >
            <option value="fr">Français (fr)</option>
            <option value="ar">الدارجة (ar)</option>
            <option value="en">English (en)</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Instagram URL</label>
          <input
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Facebook URL</label>
          <input
            type="url"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>TikTok URL</label>
          <input
            type="url"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <Toast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
    </form>
  );
}

