import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';
import { parsePolicyPayload } from '../route';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Identifiant de politique manquant.' },
        { status: 400 }
      );
    }

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const policy = await db.leavePolicy.findUnique({
      where: { id },
    });

    if (!policy || policy.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Politique introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('GET /api/policies/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Identifiant de politique manquant.' },
        { status: 400 }
      );
    }
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const existing = await db.leavePolicy.findUnique({
      where: { id },
    });

    if (!existing || existing.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Politique introuvable' },
        { status: 404 }
      );
    }

    const payloadOrError = parsePolicyPayload(await request.json());

    if ('error' in payloadOrError) {
      return NextResponse.json(
        { error: payloadOrError.error },
        { status: 400 }
      );
    }

    const policy = await db.leavePolicy.update({
      where: { id },
      data: payloadOrError,
    });

    return NextResponse.json(policy);
  } catch (error) {
    console.error('PUT /api/policies/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Identifiant de politique manquant.' },
        { status: 400 }
      );
    }
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const existing = await db.leavePolicy.findUnique({
      where: { id },
    });

    if (!existing || existing.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Politique introuvable' },
        { status: 404 }
      );
    }

    await db.leavePolicy.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Politique introuvable ou déjà supprimée' },
        { status: 404 }
      );
    }

    console.error('DELETE /api/policies/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
