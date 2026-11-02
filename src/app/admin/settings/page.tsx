import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { SettingsEditorClient } from '@/components/admin/SettingsEditorClient';
import { getPublicSiteSettings } from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await getPublicSiteSettings();

  return (
    <AdminProtectedShell>
      <SettingsEditorClient initialSettings={settings} />
    </AdminProtectedShell>
  );
}

