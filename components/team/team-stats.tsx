// import { Role } from '@prisma/client';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Role } from '@prisma/client';
import { db } from '@/lib/db';

interface TeamStatsProps {
  companyId: string;
  managerId?: string;
}

export async function TeamStats({ companyId, managerId }: TeamStatsProps) {
  const nonAdminRoles: Array<'EMPLOYEE' | 'MANAGER'> = ['EMPLOYEE', 'MANAGER'];
  const userScope = managerId
    ? { companyId, managerId }
    : { companyId, role: { in: nonAdminRoles } };

  const leaveScope = managerId
    ? { user: { companyId, managerId } }
    : { user: { companyId } };

  // Compter les membres de l'équipe ou de l'entreprise
  const teamCount = await db.user.count({
    where: {
      ...userScope,
      isActive: true,
    },
  });

  // Compter les demandes en attente
  const pendingCount = await db.leave.count({
    where: {
      ...leaveScope,
      status: 'PENDING',
    },
  });

  // Compter les demandes approuvées ce mois
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const approvedThisMonth = await db.leave.count({
    where: {
      ...leaveScope,
      status: 'APPROVED',
      approvedAt: {
        gte: currentMonth,
      },
    },
  });

  // Compter les demandes refusées ce mois
  const rejectedThisMonth = await db.leave.count({
    where: {
      ...leaveScope,
      status: 'REJECTED',
      approvedAt: {
        gte: currentMonth,
      },
    },
  });

  const stats = [
    {
      label: "Membres de l'équipe",
      value: teamCount.toString(),
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Demandes en attente',
      value: pendingCount.toString(),
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      label: 'Approuvées ce mois',
      value: approvedThisMonth.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Refusées ce mois',
      value: rejectedThisMonth.toString(),
      icon: XCircle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}
            >
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
