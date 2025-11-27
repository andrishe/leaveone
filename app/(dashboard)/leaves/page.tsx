import { LeavesPageClient } from '@/components/leaves/leaves-page-client';
import { LeaveBalance } from '@/components/leaves/leave-balance';
import { requireAuth } from '@/lib/auth-helpers';

export default async function LeavesPage() {
  const session = await requireAuth();
  const userId = session.user.id;
  const userName = session.user.name ?? 'Vous';

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Mes congés
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Gérez vos demandes de congés et suivez vos soldes, {userName}
          </p>
        </div>
      </div>

      {/* Leave Balance Cards */}
      <LeaveBalance userId={userId} />

      {/* Leaves List with Modal */}
      <LeavesPageClient userId={userId} />
    </div>
  );
}
