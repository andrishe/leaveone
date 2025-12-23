import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';
import { arrayToCSV, createCSVResponse } from '@/lib/csv';
import { errorResponse, AuthorizationError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    // Only managers and admins can export
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      throw new AuthorizationError('Seuls les managers et admins peuvent exporter les données');
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause based on role
    const whereClause: any = {
      companyId: user.companyId,
    };

    if (user.role === 'MANAGER') {
      whereClause.OR = [
        { user: { managerId: user.id } },
        { userId: user.id },
      ];
    }

    // Add filters
    if (status) {
      whereClause.status = status;
    }

    if (startDate) {
      whereClause.startDate = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      whereClause.endDate = {
        lte: new Date(endDate),
      };
    }

    // Fetch leaves
    const leaves = await db.leave.findMany({
      where: whereClause,
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
          },
        },
        approver: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    // Transform data for CSV
    const csvData = leaves.map((leave) => ({
      'Employé': leave.user.name,
      'Email': leave.user.email,
      'Type': leave.leaveType.name,
      'Date début': leave.startDate,
      'Date fin': leave.endDate,
      'Jours': leave.totalDays,
      'Statut': leave.status,
      'Approuvé par': leave.approver?.name || '-',
      'Date approbation': leave.approvedAt || '-',
      'Commentaire': leave.comment || '-',
      'Raison refus': leave.rejectedReason || '-',
    }));

    // Generate CSV
    const csv = arrayToCSV(csvData);

    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `conges_${date}.csv`;

    return createCSVResponse(csv, filename);
  } catch (error) {
    return errorResponse(error);
  }
}
