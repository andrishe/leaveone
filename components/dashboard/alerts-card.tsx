import { MoreHorizontal, AlertCircle, Info, CheckCircle } from 'lucide-react';

const alerts = [
  {
    icon: AlertCircle,
    title: '3 demandes en attente depuis plus de 48h',
    time: "Aujourd'hui",
    color: 'bg-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
  {
    icon: Info,
    title: "30% de l'équipe sera absente la semaine prochaine",
    time: 'Il y a 2h',
    color: 'bg-orange-500',
    bgColor: '',
  },
  {
    icon: CheckCircle,
    title: 'Marie Dubois a validé 5 demandes',
    time: 'Il y a 3h',
    color: 'bg-green-500',
    bgColor: '',
  },
];

export function AlertsCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Alertes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Notifications importantes
          </p>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
          <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={`${alert.bgColor} p-4 rounded-lg`}>
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 ${alert.color} rounded-lg flex items-center justify-center shrink-0`}
              >
                <alert.icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 dark:text-white mb-1">
                  {alert.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {alert.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
