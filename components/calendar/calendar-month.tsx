'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CalendarLegendItem = {
  label: string;
  color: string;
};

export type CalendarLeaveDTO = {
  id: string;
  startDate: string;
  endDate: string;
  color?: string;
  label?: string;
};

interface CalendarMonthProps {
  leaves: CalendarLeaveDTO[];
  title?: string;
  legend?: CalendarLegendItem[];
  className?: string;
  initialDate?: string;
}

const monthNames = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const weekdayHeaders = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const defaultLegend: CalendarLegendItem[] = [
  { label: "Aujourd'hui", color: '#3b82f6' },
  { label: 'Congés approuvés', color: '#22c55e' },
];

const defaultLeaveColor = '#22c55e';

const pad = (value: number) => value.toString().padStart(2, '0');

const formatKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export function CalendarMonth({
  leaves,
  title = 'Calendrier',
  legend = defaultLegend,
  className,
  initialDate,
}: CalendarMonthProps) {
  const initial = initialDate ? new Date(initialDate) : new Date();
  const [viewDate, setViewDate] = useState(startOfDay(initial));

  const leaveMap = useMemo(() => {
    const map = new Map<string, CalendarLeaveDTO[]>();

    leaves.forEach((leave) => {
      const start = startOfDay(new Date(leave.startDate));
      const end = startOfDay(new Date(leave.endDate));
      const entry = leave;

      let cursor = new Date(start);
      while (cursor.getTime() <= end.getTime()) {
        const key = formatKey(cursor);
        const existing = map.get(key) ?? [];
        existing.push(entry);
        map.set(key, existing);
        cursor = addDays(cursor, 1);
      }
    });

    return map;
  }, [leaves]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Monday-first grid
  const emptyCells = Array.from({ length: firstWeekday });
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const today = startOfDay(new Date());

  const containerClassName = [
    'rounded-xl border border-blue-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/70',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  return (
    <div className={containerClassName}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded p-1 transition hover:bg-blue-50/70 dark:hover:bg-slate-900/60"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded p-1 transition hover:bg-blue-50/70 dark:hover:bg-slate-900/60"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mb-4 text-base font-bold text-slate-900 dark:text-white">
        {monthNames[month]} {year}
      </p>

      <div className="grid grid-cols-7 gap-1">
        {weekdayHeaders.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="pb-2 text-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}

        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {days.map((day) => {
          const currentDay = new Date(year, month, day);
          const key = formatKey(currentDay);
          const entries = leaveMap.get(key) ?? [];
          const hasLeaves = entries.length > 0;
          const isToday = sameDay(currentDay, today);
          const tooltip = entries
            .map((entry) => entry.label ?? 'Congé approuvé')
            .join('\n');

          const baseClasses =
            'relative flex aspect-square items-center justify-center rounded-lg text-sm transition';

          const stateClasses = isToday
            ? 'bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 font-semibold text-white'
            : hasLeaves
              ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'text-slate-700 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:bg-slate-900/60';

          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <button
                type="button"
                className={`${baseClasses} ${stateClasses}`}
                title={tooltip || undefined}
              >
                {day}
              </button>
              {hasLeaves ? (
                <div className="flex items-center gap-1">
                  {entries.slice(0, 3).map((entry, entryIndex) => (
                    <span
                      key={`${key}-dot-${entryIndex}`}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: entry.color ?? defaultLeaveColor,
                      }}
                      title={entry.label}
                    />
                  ))}
                  {entries.length > 3 ? (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      +{entries.length - 3}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="h-1.5" />
              )}
            </div>
          );
        })}
      </div>

      {legend.length ? (
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-blue-100/60 pt-4 text-xs dark:border-slate-800/60">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
