import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { AdminServicesTable } from '@/components/admin/AdminServicesTable';
import { getAdminCategories, getAdminServices } from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const [services, categories] = await Promise.all([
    getAdminServices('en'),
    getAdminCategories('en'),
  ]);

  return (
    <AdminProtectedShell>
      <AdminServicesTable services={services} categories={categories} />
    </AdminProtectedShell>
  );
}

