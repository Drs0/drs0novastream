import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { ServiceEditor } from '@/components/admin/ServiceEditor';
import { getAdminCategories } from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

export default async function AdminNewServicePage() {
  const categories = await getAdminCategories('en');

  return (
    <AdminProtectedShell>
      <ServiceEditor categories={categories} />
    </AdminProtectedShell>
  );
}

