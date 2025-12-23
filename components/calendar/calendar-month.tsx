'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={containerClassName}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="rounded-lg p-1.5 transition hover:bg-blue-100/70 dark:hover:bg-slate-800/60"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextMonth}
            className="rounded-lg p-1.5 transition hover:bg-blue-100/70 dark:hover:bg-slate-800/60"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      <motion.p
        key={`${year}-${month}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4 text-base font-bold bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-indigo-100"
      >
        {monthNames[month]} {year}
      </motion.p>

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

        {days.map((day, dayIndex) => {
          const currentDay = new Date(year, month, day);
          const key = formatKey(currentDay);
          const entries = leaveMap.get(key) ?? [];
          const hasLeaves = entries.length > 0;
          const isToday = sameDay(currentDay, today);
          const tooltip = entries
            .map((entry) => entry.label ?? 'Congé approuvé')
            .join('\n');

          // Get the primary leave color (first entry)
          const primaryLeaveColor = entries[0]?.color ?? defaultLeaveColor;

          const baseClasses =
            'relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden';

          // Use the leave type color for the background
          const getBackgroundStyle = () => {
            if (isToday) {
              return 'bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500 text-white shadow-md';
            }
            if (hasLeaves) {
              // Use semi-transparent version of the leave color
              const rgb = primaryLeaveColor.match(/\w\w/g)?.map((x) => parseInt(x, 16));
              if (rgb) {
                return `text-slate-900 dark:text-white`;
              }
              return 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
            }
            return 'text-slate-700 hover:bg-blue-50/70 dark:text-slate-300 dark:hover:bg-slate-900/60';
          };

          const stateClasses = getBackgroundStyle();

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: dayIndex * 0.01, duration: 0.2 }}
              className="flex flex-col items-center gap-1"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`${baseClasses} ${stateClasses} group`}
                title={tooltip || undefined}
                style={
                  hasLeaves && !isToday
                    ? {
                        backgroundColor: `${primaryLeaveColor}20`,
                        borderWidth: '2px',
                        borderColor: primaryLeaveColor,
                      }
                    : undefined
                }
              >
                <span className="relative z-10">{day}</span>
                {hasLeaves && !isToday && (
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${primaryLeaveColor}40, ${primaryLeaveColor}20)`,
                    }}
                  />
                )}
              </motion.button>
              {hasLeaves ? (
                <div className="flex items-center gap-1">
                  {entries.slice(0, 3).map((entry, entryIndex) => (
                    <motion.span
                      key={`${key}-dot-${entryIndex}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: dayIndex * 0.01 + 0.1 + entryIndex * 0.05 }}
                      className="h-1.5 w-1.5 rounded-full shadow-sm"
                      style={{
                        backgroundColor: entry.color ?? defaultLeaveColor,
                      }}
                      title={entry.label}
                    />
                  ))}
                  {entries.length > 3 ? (
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      +{entries.length - 3}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="h-1.5" />
              )}
            </motion.div>
          );
        })}
      </div>

      {legend.length ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 flex flex-wrap items-center gap-4 border-t border-blue-100/60 pt-4 text-xs dark:border-slate-800/60"
        >
          {legend.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <motion.span
                whileHover={{ scale: 1.2, rotate: 180 }}
                className="h-3 w-3 rounded shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
