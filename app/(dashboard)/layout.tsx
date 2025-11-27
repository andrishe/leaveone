import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { requireAuth } from '@/lib/auth-helpers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-950 lg:h-screen lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
