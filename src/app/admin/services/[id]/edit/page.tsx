import { notFound } from 'next/navigation';
import { AdminProtectedShell } from '@/components/admin/AdminProtectedShell';
import { ServiceEditor } from '@/components/admin/ServiceEditor';
import {
  getAdminCategories,
  getAdminServiceById,
} from '@/lib/catalog/repository';

export const dynamic = 'force-dynamic';

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, service] = await Promise.all([
    getAdminCategories('en'),
    getAdminServiceById(id),
  ]);

  if (!service) {
    notFound();
  }

  return (
    <AdminProtectedShell>
      <ServiceEditor categories={categories} initialService={service} />
    </AdminProtectedShell>
  );
}

