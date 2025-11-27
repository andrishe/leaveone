import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

// GET /api/leaves/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Identifiant de congé manquant.' },
        { status: 400 }
      );
    }

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    const leave = await db.leave.findUnique({
      where: { id },
      include: {
        leaveType: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            managerId: true,
          },
        },
        approver: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!leave || leave.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Demande introuvable' },
        { status: 404 }
      );
    }

    const isOwner = leave.userId === user.id;
    const isManager =
      user.role === 'MANAGER' && leave.user?.managerId === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isManager && !isAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    return NextResponse.json(leave);
  } catch (error) {
    console.error('GET /api/leaves/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE /api/leaves/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Identifiant de congé manquant.' },
        { status: 400 }
      );
    }

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    const leave = await db.leave.findUnique({
      where: { id },
      select: {
        id: true,
        companyId: true,
        userId: true,
        status: true,
        user: {
          select: { managerId: true },
        },
      },
    });

    if (!leave || leave.companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Demande introuvable' },
        { status: 404 }
      );
    }

    const isOwner = leave.userId === user.id;
    const isManager =
      user.role === 'MANAGER' && leave.user?.managerId === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isManager && !isAdmin) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    if (leave.status !== 'PENDING' && !isAdmin) {
      return NextResponse.json(
        { error: 'Seules les demandes en attente peuvent être supprimées' },
        { status: 400 }
      );
    }

    await db.leave.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/leaves/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
