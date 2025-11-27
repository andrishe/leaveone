import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

// GET /api/users/balance
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;
    const currentYear = new Date().getFullYear();

    const balances = await db.leaveBalance.findMany({
      where: {
        userId: user.id,
        year: currentYear,
      },
      include: {
        leaveType: true,
      },
    });

    return NextResponse.json(balances);
  } catch (error) {
    console.error('GET /api/users/balance error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
