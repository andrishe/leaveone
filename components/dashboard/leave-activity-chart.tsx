'use client';

import { MoreHorizontal } from 'lucide-react';

export function LeaveActivityChart() {
  const data = [
    { month: 'Jan', value: 12 },
    { month: 'Fév', value: 18 },
    { month: 'Mar', value: 15 },
    { month: 'Avr', value: 22 },
    { month: 'Mai', value: 28 },
    { month: 'Juin', value: 35 },
    { month: 'Juil', value: 42 },
    { month: 'Août', value: 38 },
    { month: 'Sep', value: 20 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Activité des congés
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Nombre de jours de congés pris par mois
          </p>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
          <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-slate-500">
          <span>50</span>
          <span>40</span>
          <span>30</span>
          <span>20</span>
          <span>10</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="ml-10 h-full flex items-end justify-between gap-3 pb-8">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer relative group"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '8px',
                }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition">
                  {item.value}j
                </span>
              </div>
              <span className="text-xs text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
