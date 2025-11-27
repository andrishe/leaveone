import {
  CalendarLegendItem,
  CalendarLeaveDTO,
  CalendarMonth,
} from '@/components/calendar/calendar-month';
import { db } from '@/lib/db';

interface TeamCalendarProps {
  companyId: string;
  managerId?: string;
}

export async function TeamCalendar({
  companyId,
  managerId,
}: TeamCalendarProps) {
  const now = new Date();
  const windowStart = new Date(now.getFullYear() - 1, 0, 1);
  const windowEnd = new Date(now.getFullYear() + 1, 11, 31, 23, 59, 59, 999);

  const approvedLeaves = await db.leave.findMany({
    where: {
      status: 'APPROVED',
      startDate: { lte: windowEnd },
      endDate: { gte: windowStart },
      user: {
        companyId,
        ...(managerId ? { managerId } : {}),
      },
    },
    include: {
      user: {
        select: { name: true },
      },
      leaveType: {
        select: { id: true, name: true, color: true },
      },
    },
  });

  const upcomingAbsences = approvedLeaves
    .filter((leave) => leave.endDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 8);

  const calendarLeaves: CalendarLeaveDTO[] = approvedLeaves.map((leave) => ({
    id: leave.id,
    startDate: leave.startDate.toISOString(),
    endDate: leave.endDate.toISOString(),
    color: leave.leaveType?.color ?? '#22c55e',
    label: `${leave.user?.name ?? 'Employé'} · ${leave.leaveType?.name ?? 'Congé'}`,
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

  const legend: CalendarLegendItem[] = [
    { label: "Aujourd'hui", color: '#3b82f6' },
    ...Array.from(typeLegend.values()),
  ];

  return (
    <div className="space-y-6">
      <CalendarMonth leaves={calendarLeaves} legend={legend} />

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
          Prochaines absences
        </h3>
        <div className="space-y-3">
          {upcomingAbsences.length ? (
            upcomingAbsences.map((absence) => (
              <div
                key={absence.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-xs font-semibold text-white">
                  {absence.user?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {absence.user?.name ?? 'Employé'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {absence.leaveType?.name ?? 'Congé'} ·{' '}
                    {absence.startDate.toLocaleDateString('fr-FR')} -{' '}
                    {absence.endDate.toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: absence.leaveType?.color ?? '#22c55e',
                  }}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Aucune absence à venir pour l’instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
