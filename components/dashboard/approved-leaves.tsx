import { Calendar } from 'lucide-react';
import { db } from '@/lib/db';
import { ApprovedLeavesTable } from './approved-leaves-table';

interface ApprovedLeavesProps {
  companyId: string;
}

export async function ApprovedLeaves({ companyId }: ApprovedLeavesProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Congés validés (tous)
  const approvedLeaves = await db.leave.findMany({
    where: {
      companyId,
      status: 'APPROVED',
    },
    include: {
      user: {
        select: {
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
      startDate: 'desc',
    },
    take: 20,
  });

  // Séparer les congés en cours, à venir et passés
  type Leave = {
    id: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    user: { name: string; email: string };
    leaveType?: { name: string; color: string };
  };

  const currentLeaves = approvedLeaves.filter(
    (leave: Leave) => leave.startDate <= today && leave.endDate >= today
  );
  const upcomingLeaves = approvedLeaves.filter(
    (leave: Leave) => leave.startDate > today
  );
  const pastLeaves = approvedLeaves.filter(
    (leave: Leave) => leave.endDate < today
  );

  return (
    <ApprovedLeavesTable
      currentLeaves={currentLeaves}
      upcomingLeaves={upcomingLeaves}
      pastLeaves={pastLeaves}
    />
  );
}
