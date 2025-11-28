import { Calendar, User } from 'lucide-react';
import { db } from '@/lib/db';

interface ApprovedLeavesProps {
  companyId: string;
}

export async function ApprovedLeaves({ companyId }: ApprovedLeavesProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Congés validés (tous)
  const approvedLeaves = await db.leave.findMany({
    where: {
      companyId,
      status: 'APPROVED',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      leaveType: {
        select: {
          name: true,
          color: true,
        },
      },
    },
    orderBy: {
      startDate: 'desc',
    },
    take: 20,
  });

  // Séparer les congés en cours, à venir et passés
  type Leave = {
    id: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    user: { name: string; email: string };
    leaveType?: { name: string; color: string };
  };

  const currentLeaves = approvedLeaves.filter(
    (leave: Leave) => leave.startDate <= today && leave.endDate >= today
  );
  const upcomingLeaves = approvedLeaves.filter(
    (leave: Leave) => leave.startDate > today
  );
  const pastLeaves = approvedLeaves.filter(
    (leave: Leave) => leave.endDate < today
  );

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
    const endStr = end.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
    return start.getTime() === end.getTime()
      ? startStr
      : `${startStr} → ${endStr}`;
  };

  return (
    <div className="rounded-xl border border-green-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/70">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Congés validés
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentLeaves.length} en cours · {upcomingLeaves.length} à venir
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
          <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      </div>

      {approvedLeaves.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          Aucun congé validé
        </p>
      ) : (
        <div className="space-y-4">
          {/* Congés en cours */}
          {currentLeaves.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3">
                En cours
              </h3>
              <div className="space-y-2">
                {currentLeaves.map((leave: Leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white">
                        {leave.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {leave.user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {leave.leaveType?.name ?? 'Congé'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {formatDateRange(leave.startDate, leave.endDate)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {leave.totalDays} jour{leave.totalDays > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Congés à venir */}
          {upcomingLeaves.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 mt-4">
                À venir
              </h3>
              <div className="space-y-2">
                {upcomingLeaves.map((leave: Leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: leave.leaveType?.color ?? '#3b82f6',
                        }}
                      >
                        {leave.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {leave.user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {leave.leaveType?.name ?? 'Congé'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {formatDateRange(leave.startDate, leave.endDate)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {leave.totalDays} jour{leave.totalDays > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Historique des congés validés */}
          {pastLeaves.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 mt-4">
                Historique
              </h3>
              <div className="space-y-2">
                {pastLeaves.map((leave: Leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: leave.leaveType?.color ?? '#6b7280',
                        }}
                      >
                        {leave.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">
                          {leave.user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {leave.leaveType?.name ?? 'Congé'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {formatDateRange(leave.startDate, leave.endDate)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {leave.totalDays} jour{leave.totalDays > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
