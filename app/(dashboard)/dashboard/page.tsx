import type {
  CalendarLegendItem,
  CalendarLeaveDTO,
} from '@/components/calendar/calendar-month';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
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
    (sum: number, b: { remaining: number }) => sum + b.remaining,
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

  const usedThisYear = balances.reduce(
    (sum: number, b: { used: number }) => sum + b.used,
    0
  );

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

  const calendarLeaves: CalendarLeaveDTO[] = approvedLeaves.map(
    (leave: {
      id: string;
      startDate: Date;
      endDate: Date;
      leaveType?: { id?: string; name?: string; color?: string };
    }) => ({
      id: leave.id,
      startDate: leave.startDate.toISOString(),
      endDate: leave.endDate.toISOString(),
      color: leave.leaveType?.color ?? '#22c55e',
      label: `${leave.leaveType?.name ?? 'Congé'} · ${leave.startDate.toLocaleDateString('fr-FR')}`,
    })
  );

  const typeLegend = new Map<string, CalendarLegendItem>();
  approvedLeaves.forEach(
    (leave: { leaveType?: { id?: string; name?: string; color?: string } }) => {
      const typeId = leave.leaveType?.id;
      if (!typeId || typeLegend.has(typeId)) {
        return;
      }

      typeLegend.set(typeId, {
        color: leave.leaveType?.color ?? '#22c55e',
        label: leave.leaveType?.name ?? 'Congé',
      });
    }
  );

  const calendarLegend: CalendarLegendItem[] = [
    { label: "Aujourd'hui", color: '#3b82f6' },
    ...Array.from(typeLegend.values()),
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-linear-to-br from-blue-50 via-indigo-50/50 to-cyan-50/30 p-8 shadow-lg dark:border-slate-800/60 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/40">
        {/* Decorative gradient orbs */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="mb-2 bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:via-blue-100 dark:to-indigo-100">
              Tableau de bord
            </h1>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Bonjour <span className="font-semibold text-blue-600 dark:text-blue-400">{user.name}</span>, bienvenue sur votre espace
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 rounded-xl border border-blue-200/60 bg-white/60 px-4 py-3 backdrop-blur-sm dark:border-blue-900/40 dark:bg-slate-800/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Système actif</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        totalRemaining={totalRemaining}
        pendingCount={pendingCount}
        usedThisYear={usedThisYear}
        totalDays={balances.reduce((sum: number, b: { allocated: number }) => sum + b.allocated, 0)}
        currentYear={currentYear}
        userRole={user.role}
      />

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
