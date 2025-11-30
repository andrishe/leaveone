import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';
import { parsePolicyPayload } from '@/lib/validators/policy';

// Supprimer la fonction parsePolicyPayload d'ici
// et supprimer l'export

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const policies = await db.leavePolicy.findMany({
      where: { companyId: user.companyId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(policies);
  } catch (error) {
    console.error('GET /api/policies error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const payloadOrError = parsePolicyPayload(await request.json());

    if ('error' in payloadOrError) {
      return NextResponse.json(
        { error: payloadOrError.error },
        { status: 400 }
      );
    }

    const policy = await db.leavePolicy.create({
      data: {
        companyId: user.companyId,
        ...payloadOrError,
      },
    });

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error('POST /api/policies error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
