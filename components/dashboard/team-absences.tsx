import { MoreHorizontal } from 'lucide-react';

const absences = [
  {
    name: 'Sophie Martin',
    type: 'Congés Payés',
    dates: '15-19 Jan',
    days: '5 jours',
    color: 'bg-blue-500',
  },
  {
    name: 'Pierre Dubois',
    type: 'RTT',
    dates: '18 Jan',
    days: '1 jour',
    color: 'bg-purple-500',
  },
  {
    name: 'Marie Laurent',
    type: 'Maladie',
    dates: '16-17 Jan',
    days: '2 jours',
    color: 'bg-red-500',
  },
  {
    name: 'Luc Bernard',
    type: 'Congés Payés',
    dates: '22-26 Jan',
    days: '5 jours',
    color: 'bg-blue-500',
  },
];

export function TeamAbsences() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Absences à venir
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prochaines absences de l'équipe
          </p>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
          <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Absences List */}
      <div className="space-y-3">
        {absences.map((absence, i) => (
          <div
            key={i}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 ${absence.color} rounded-full shrink-0`}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {absence.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {absence.type}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {absence.dates}
                  </p>
                  <span className="text-xs text-slate-400">•</span>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {absence.days}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
