import { MoreHorizontal, Info, AlertCircle } from 'lucide-react';

const reports = [
  {
    icon: Info,
    title: 'There was a breakdown in the elevator on the 1st floor',
    time: '12 minutes ago',
    color: 'bg-cyan-500',
  },
  {
    icon: Info,
    title: 'There was a breakdown in the elevator on the 1st floor',
    time: '15 minutes ago',
    color: 'bg-slate-400',
  },
  {
    icon: AlertCircle,
    title: 'There Was Damage To The Main Door',
    time: '3 hours ago',
    color: 'bg-red-500',
  },
];

export function ReportsCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Reports
        </h2>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
          <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report, i) => (
          <div
            key={i}
            className={`${
              i === 0 ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
            } p-4 rounded-lg`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 ${report.color} rounded-lg flex items-center justify-center shrink-0`}
              >
                <report.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white mb-1">
                  {report.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {report.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
