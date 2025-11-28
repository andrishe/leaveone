import { MoreHorizontal, Check, X } from 'lucide-react';
import { db } from '@/lib/db';

interface PendingRequestsProps {
  userId: string;
  userRole: string;
}

export async function PendingRequests({
  userId,
  userRole,
}: PendingRequestsProps) {
  // Récupérer les demandes selon le rôle
  let requests;
  if (userRole === 'ADMIN') {
    // Pour l'admin, afficher toutes les demandes en attente de l'entreprise
    requests = await db.leave.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  } else if (userRole === 'MANAGER') {
    requests = await db.leave.findMany({
      where: {
        user: {
          managerId: userId,
        },
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  } else {
    requests = await db.leave.findMany({
      where: {
        userId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
  }

  return (
    <div className="rounded-xl border border-blue-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/70">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {userRole === 'ADMIN'
              ? 'Demandes en attente (toute l’entreprise)'
              : userRole === 'MANAGER'
                ? 'Demandes à valider'
                : 'Mes demandes en attente'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {requests.length} demande(s) en attente
          </p>
        </div>
        <button className="rounded-lg p-2 transition hover:bg-blue-50/70 dark:hover:bg-slate-900/60">
          <MoreHorizontal className="h-5 w-5 text-blue-500 dark:text-blue-300" />
        </button>
      </div>

      {/* Table */}
      {requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                  {userRole === 'MANAGER' ? 'Employé' : 'Type'}
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                  Période
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                  Jours
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                  Statut
                </th>
                {userRole === 'MANAGER' && (
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {requests.map(
                (request: {
                  id: string;
                  startDate: Date | string;
                  endDate: Date | string;
                  totalDays: number;
                  user: { name: string; email: string };
                  leaveType: { name: string };
                }) => (
                  <tr
                    key={request.id}
                    className="border-b border-blue-100/40 dark:border-slate-800/40"
                  >
                    <td className="py-4">
                      {userRole === 'MANAGER' ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 text-xs font-semibold text-white shadow-sm">
                            {request.user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {request.user.name}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-100/80 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {request.leaveType.name}
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(request.startDate).toLocaleDateString('fr-FR')}{' '}
                      - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 text-sm font-medium text-slate-900 dark:text-white">
                      {request.totalDays}j
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-yellow-100/80 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        En attente
                      </span>
                    </td>
                    {userRole === 'MANAGER' && (
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <button className="rounded bg-linear-to-br from-emerald-500 to-teal-500 p-1.5 text-white transition hover:brightness-110">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="rounded bg-linear-to-br from-rose-500 to-red-500 p-1.5 text-white transition hover:brightness-110">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Aucune demande en attente
          </p>
        </div>
      )}
    </div>
  );
}
