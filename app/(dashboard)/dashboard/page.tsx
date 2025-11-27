import type {
  CalendarLegendItem,
  CalendarLeaveDTO,
} from '@/components/calendar/calendar-month';
import { StatCard } from '@/components/dashboard/stat-card';
import { MiniCalendar } from '@/components/dashboard/mini-calendar';
import { PendingRequests } from '@/components/dashboard/pending-requests';
import { ApprovedLeaves } from '@/components/dashboard/approved-leaves';
import { requireAuth } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = session.user.id;
  const currentYear = new Date().getFullYear();

  // Récupérer les données utilisateur
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  const balances = await db.leaveBalance.findMany({
    where: { userId, year: currentYear },
    include: { leaveType: true },
  });

  const totalRemaining = balances.reduce(
    (sum: number, b) => sum + b.remaining,
    0
  );

  const pendingCount = await db.leave.count({
    where:
      user.role === 'ADMIN' || user.role === 'MANAGER'
        ? {
            companyId: user.companyId,
            status: 'PENDING',
          }
        : {
            userId,
            status: 'PENDING',
          },
  });

  const usedThisYear = balances.reduce((sum, b) => sum + b.used, 0);

  const approvedLeaves = await db.leave.findMany({
    where: {
      userId,
      status: 'APPROVED',
      endDate: { gte: new Date(currentYear - 1, 0, 1) },
    },
    include: {
      leaveType: {
        select: { id: true, name: true, color: true },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  const calendarLeaves: CalendarLeaveDTO[] = approvedLeaves.map((leave) => ({
    id: leave.id,
    startDate: leave.startDate.toISOString(),
    endDate: leave.endDate.toISOString(),
    color: leave.leaveType?.color ?? '#22c55e',
    label: `${leave.leaveType?.name ?? 'Congé'} · ${leave.startDate.toLocaleDateString('fr-FR')}`,
  }));

  const typeLegend = new Map<string, CalendarLegendItem>();
  approvedLeaves.forEach((leave) => {
    const typeId = leave.leaveType?.id;
    if (!typeId || typeLegend.has(typeId)) {
      return;
    }

    typeLegend.set(typeId, {
      color: leave.leaveType?.color ?? '#22c55e',
      label: leave.leaveType?.name ?? 'Congé',
    });
  });

  const calendarLegend: CalendarLegendItem[] = [
    { label: "Aujourd'hui", color: '#3b82f6' },
    ...Array.from(typeLegend.values()),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Bonjour {user.name}, bienvenue sur votre espace
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Solde disponible"
          value={totalRemaining.toFixed(1)}
          subtitle="jours restants"
          icon="🏖️"
          color="bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500"
        />
        {user.role !== 'ADMIN' && (
          <StatCard
            title="Demandes en attente"
            value={pendingCount.toString()}
            subtitle={user.role === 'MANAGER' ? 'À valider' : 'En cours'}
            icon="⏳"
            color="bg-linear-to-br from-indigo-500 via-violet-500 to-blue-500"
          />
        )}
        <StatCard
          title={`Congés pris (${currentYear})`}
          value={usedThisYear.toFixed(1)}
          subtitle="jours utilisés"
          icon="✅"
          color="bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests (2/3 width) */}
        <div className="lg:col-span-2">
          {user.role === 'ADMIN' ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Demandes en attente
              </h2>
              <PendingRequests userId={userId} userRole="ADMIN" />
            </div>
          ) : (
            <PendingRequests userId={userId} userRole={user.role} />
          )}
        </div>

        {/* Calendar (1/3 width) */}
        <div>
          <MiniCalendar leaves={calendarLeaves} legend={calendarLegend} />
        </div>
      </div>

      {/* Approved Leaves - Visible pour Admin/Manager */}
      {(user.role === 'ADMIN' || user.role === 'MANAGER') && (
        <ApprovedLeaves companyId={user.companyId} />
      )}
    </div>
  );
}
