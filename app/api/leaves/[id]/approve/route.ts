import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

export async function POST(
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

    const body = await request.json();
    const { action, reason } = body as {
      action: 'approve' | 'reject';
      reason?: string;
    };

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'MANAGER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    }

    const leave = await db.leave.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            managerId: true,
          },
        },
      },
    });

    if (!leave) {
      return NextResponse.json(
        { error: 'Demande introuvable' },
        { status: 404 }
      );
    }

    if (leave.companyId !== user.companyId) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    if (leave.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cette demande a déjà été traitée' },
        { status: 400 }
      );
    }

    if (user.role === 'MANAGER' && leave.user?.managerId !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    if (action === 'approve') {
      await db.leave.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: user.id,
          approvedAt: new Date(),
        },
      });

      // TODO: Mettre à jour le solde de congés
      // TODO: Envoyer notification à l'employé
    } else if (action === 'reject') {
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json(
          { error: 'Une raison est obligatoire pour un refus' },
          { status: 400 }
        );
      }

      await db.leave.update({
        where: { id },
        data: {
          status: 'REJECTED',
          approvedBy: user.id,
          approvedAt: new Date(),
          rejectedReason: reason,
        },
      });

      // TODO: Envoyer notification à l'employé
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/leaves/[id]/approve error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
