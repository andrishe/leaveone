import { MoreHorizontal, Check, X } from 'lucide-react';
import { db } from '@/lib/db';
import { PendingRequestsTable } from './pending-requests-table';

interface PendingRequestsProps {
  userId: string;
  userRole: string;
}

export async function PendingRequests({
  userId,
  userRole,
}: PendingRequestsProps) {
  // Récupérer les demandes selon le rôle
  let requests;
  if (userRole === 'ADMIN') {
    // Pour l'admin, afficher toutes les demandes en attente de l'entreprise
    requests = await db.leave.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  } else if (userRole === 'MANAGER') {
    requests = await db.leave.findMany({
      where: {
        user: {
          managerId: userId,
        },
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });
  } else {
    requests = await db.leave.findMany({
      where: {
        userId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
  }

  return (
    <PendingRequestsTable
      requests={requests}
      userRole={userRole}
    />
  );
}
