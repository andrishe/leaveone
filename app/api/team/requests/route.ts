import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

// GET /api/team/requests - Demandes de l'équipe
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const requests = await db.leave.findMany({
      where: {
        companyId: user.companyId,
        ...(user.role === 'MANAGER' ? { user: { managerId: user.id } } : {}),
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
        leaveType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('GET /api/team/requests error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
