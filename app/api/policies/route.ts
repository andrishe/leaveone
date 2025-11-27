import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

export function parsePolicyPayload(body: any) {
  const {
    name,
    description,
    requiresDocument,
    maxConsecutiveDays,
    blackoutDates,
    autoApprovalThreshold,
    isActive,
  } = body ?? {};

  if (!name || typeof name !== 'string') {
    return { error: 'Le nom de la politique est requis.' };
  }

  const parsedBlackoutDates = Array.isArray(blackoutDates)
    ? blackoutDates
        .map((value) => {
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? null : date;
        })
        .filter((value): value is Date => value !== null)
    : [];

  const parsedMaxConsecutive =
    maxConsecutiveDays !== undefined && maxConsecutiveDays !== null
      ? Number(maxConsecutiveDays)
      : undefined;

  const parsedAutoApproval =
    autoApprovalThreshold !== undefined && autoApprovalThreshold !== null
      ? Number(autoApprovalThreshold)
      : undefined;

  if (parsedMaxConsecutive !== undefined && parsedMaxConsecutive <= 0) {
    return {
      error: 'Le nombre maximum de jours consécutifs doit être positif.',
    };
  }

  if (parsedAutoApproval !== undefined && parsedAutoApproval < 0) {
    return {
      error: "Le seuil d'approbation automatique doit être positif.",
    };
  }

  return {
    name,
    description: description ?? null,
    requiresDocument: Boolean(requiresDocument),
    maxConsecutiveDays: parsedMaxConsecutive,
    blackoutDates: parsedBlackoutDates,
    autoApprovalThreshold: parsedAutoApproval,
    isActive: isActive === undefined ? true : Boolean(isActive),
  };
}

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
