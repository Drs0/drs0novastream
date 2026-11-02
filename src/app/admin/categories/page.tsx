import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { CategoryManagerClient } from '@/components/admin/CategoryManagerClient';
import { getAdminCategories } from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories('en');

  return (
    <AdminProtectedShell>
      <CategoryManagerClient categories={categories} />
    </AdminProtectedShell>
  );
}

