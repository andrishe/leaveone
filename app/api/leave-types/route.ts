import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

// GET /api/leave-types
export async function GET(request: NextRequest) {
  try {
    const leaveTypes = await db.leaveType.findMany();
    return NextResponse.json(leaveTypes);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/leave-types
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      color,
      maxDaysPerYear,
      requiresApproval,
      carryOverAllowed,
      carryOverMaxDays,
    } = body;

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        { error: 'Nom et code requis' },
        { status: 400 }
      );
    }

    const leaveType = await db.leaveType.create({
      data: {
        companyId: user.companyId,
        name,
        code,
        color: color || '#3b82f6',
        maxDaysPerYear: maxDaysPerYear || 0,
        requiresApproval: requiresApproval ?? true,
        carryOverAllowed: carryOverAllowed ?? false,
        carryOverMaxDays: carryOverMaxDays || 0,
      },
    });

    return NextResponse.json(leaveType, { status: 201 });
  } catch (error) {
    console.error('POST /api/leave-types error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
