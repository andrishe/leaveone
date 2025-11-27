import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { requireRole } from '@/lib/auth-helpers';

export default async function AdminPage() {
  await requireRole(['ADMIN']);
  return <AdminDashboard />;
}
