interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-blue-100/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl text-white shadow-sm ${color}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="mb-1 text-sm text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="mb-1 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
