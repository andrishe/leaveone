import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';
import { deductLeaveBalance, removePendingLeave } from '@/lib/leave-balance';
import { sendLeaveApprovedEmail, sendLeaveRejectedEmail } from '@/lib/email';

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
            email: true,
            name: true,
          },
        },
        leaveType: {
          select: {
            id: true,
            name: true,
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
      // Get the year from start date
      const year = leave.startDate.getFullYear();

      try {
        // Update leave status and deduct balance in a transaction
        await db.$transaction(async (tx) => {
          // Update leave status
          await tx.leave.update({
            where: { id },
            data: {
              status: 'APPROVED',
              approvedBy: user.id,
              approvedAt: new Date(),
            },
          });

          // Deduct from leave balance
          await deductLeaveBalance(
            leave.userId,
            leave.leaveTypeId,
            leave.totalDays,
            year
          );
        });

        // Send email notification (async, don't await to avoid blocking)
        sendLeaveApprovedEmail({
          to: leave.user.email,
          startDate: leave.startDate,
          endDate: leave.endDate,
          approverName: user.name,
        }).catch((error) => {
          console.error('Failed to send approval email:', error);
          // Don't throw - email failure shouldn't fail the approval
        });
      } catch (error) {
        console.error('Error approving leave:', error);
        return NextResponse.json(
          {
            error: error instanceof Error
              ? error.message
              : 'Erreur lors de l\'approbation du congé'
          },
          { status: 500 }
        );
      }
    } else if (action === 'reject') {
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json(
          { error: 'Une raison est obligatoire pour un refus' },
          { status: 400 }
        );
      }

      // Get the year from start date
      const year = leave.startDate.getFullYear();

      try {
        // Update leave status and remove pending balance in a transaction
        await db.$transaction(async (tx) => {
          // Update leave status
          await tx.leave.update({
            where: { id },
            data: {
              status: 'REJECTED',
              approvedBy: user.id,
              approvedAt: new Date(),
              rejectedReason: reason,
            },
          });

          // Remove pending days from balance
          await removePendingLeave(
            leave.userId,
            leave.leaveTypeId,
            leave.totalDays,
            year
          );
        });

        // Send email notification (async, don't await to avoid blocking)
        sendLeaveRejectedEmail({
          to: leave.user.email,
          startDate: leave.startDate,
          endDate: leave.endDate,
          approverName: user.name,
          reason: reason,
        }).catch((error) => {
          console.error('Failed to send rejection email:', error);
          // Don't throw - email failure shouldn't fail the rejection
        });
      } catch (error) {
        console.error('Error rejecting leave:', error);
        return NextResponse.json(
          {
            error: error instanceof Error
              ? error.message
              : 'Erreur lors du refus du congé'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/leaves/[id]/approve error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
