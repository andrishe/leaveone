import { db } from '@/lib/db';

interface LeaveBalanceProps {
  userId: string;
}

export async function LeaveBalance({ userId }: LeaveBalanceProps) {
  const currentYear = new Date().getFullYear();

  const balances = await db.leaveBalance.findMany({
    where: {
      userId,
      year: currentYear,
    },
    include: {
      leaveType: true,
    },
    orderBy: {
      leaveType: {
        name: 'asc',
      },
    },
  });

  if (balances.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-300">
          Aucun solde de congés configuré pour cette année.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {balances.map((balance) => (
        <div
          key={balance.id}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {balance.leaveType.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {balance.leaveType.code}
              </p>
            </div>
            <div
              className={`w-3 h-3 rounded-full`}
              style={{ backgroundColor: balance.leaveType.color }}
            ></div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Alloués
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {balance.allocated}j
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Utilisés
              </span>
              <span className="text-sm font-semibold text-orange-600">
                {balance.used}j
              </span>
            </div>
            {balance.pending > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  En attente
                </span>
                <span className="text-sm font-semibold text-yellow-600">
                  {balance.pending}j
                </span>
              </div>
            )}
            {balance.carryOver > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Report {currentYear - 1}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  +{balance.carryOver}j
                </span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Restants
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {balance.remaining}j
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
