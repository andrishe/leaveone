import { db } from '@/lib/db';
import { TeamRequestsClient, TeamRequestItem } from './team-requests-client';

interface TeamRequestsProps {
  companyId: string;
  managerId?: string;
  isAdmin?: boolean;
}

export async function TeamRequests({
  companyId,
  managerId,
  isAdmin = false,
}: TeamRequestsProps) {
  const requests = await db.leave.findMany({
    where: {
      user: {
        companyId,
        ...(managerId ? { managerId } : {}),
      },
      status: 'PENDING',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      leaveType: {
        select: {
          name: true,
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const mapped: TeamRequestItem[] = requests.map((request) => ({
    id: request.id,
    employeeName: request.user?.name ?? 'Employé inconnu',
    employeeEmail: request.user?.email ?? '',
    leaveTypeName: request.leaveType.name,
    leaveTypeColor: request.leaveType.color,
    startDate: request.startDate.toISOString(),
    endDate: request.endDate.toISOString(),
    totalDays: request.totalDays,
    createdAt: request.createdAt.toISOString(),
    comment: request.comment ?? null,
  }));

  return <TeamRequestsClient initialRequests={mapped} isAdmin={isAdmin} />;
}
