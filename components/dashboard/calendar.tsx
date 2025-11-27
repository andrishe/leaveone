'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

export function Calendar() {
  const [currentDate] = useState(new Date(2021, 1)); // February 2021

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from(
    { length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 },
    (_, i) => null
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Date
        </h3>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        February 2021
      </p>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-slate-500 pb-2"
          >
            {day}
          </div>
        ))}

        {/* Empty days */}
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Days */}
        {days.map((day) => {
          const isSelected = day === 23;
          return (
            <button
              key={day}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition ${
                isSelected
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
