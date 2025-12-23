'use client';

import { Umbrella, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from './stat-card';

interface DashboardStatsProps {
  totalRemaining: number;
  pendingCount: number;
  usedThisYear: number;
  totalDays: number;
  currentYear: number;
  userRole: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

export function DashboardStats({
  totalRemaining,
  pendingCount,
  usedThisYear,
  totalDays,
  currentYear,
  userRole,
}: DashboardStatsProps) {
  const usagePercentage = totalDays > 0 ? ((usedThisYear / totalDays) * 100).toFixed(0) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Solde disponible"
        value={totalRemaining.toFixed(1)}
        subtitle="jours restants"
        icon="🏖️"
        iconComponent={Umbrella}
        color="bg-linear-to-br from-blue-600 via-indigo-500 to-cyan-500"
        delay={0}
        trend="neutral"
        trendValue={`${totalDays.toFixed(1)} jours au total`}
      />
      {userRole !== 'ADMIN' && (
        <StatCard
          title="Demandes en attente"
          value={pendingCount.toString()}
          subtitle={userRole === 'MANAGER' ? 'À valider' : 'En cours'}
          icon="⏳"
          iconComponent={Clock}
          color="bg-linear-to-br from-indigo-500 via-violet-500 to-blue-500"
          delay={0.1}
        />
      )}
      <StatCard
        title={`Congés pris (${currentYear})`}
        value={usedThisYear.toFixed(1)}
        subtitle="jours utilisés"
        icon="✅"
        iconComponent={CheckCircle2}
        color="bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500"
        delay={0.2}
        trend={usedThisYear > 10 ? 'up' : 'neutral'}
        trendValue={`${usagePercentage}% utilisés`}
      />
    </div>
  );
}
