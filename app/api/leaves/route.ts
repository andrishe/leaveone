import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateBusinessDays } from '@/lib/utils';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

// GET /api/leaves - Liste des congés
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    const whereClause =
      user.role === 'ADMIN'
        ? { companyId: user.companyId }
        : user.role === 'MANAGER'
          ? {
              companyId: user.companyId,
              OR: [{ user: { managerId: user.id } }, { userId: user.id }],
            }
          : {
              companyId: user.companyId,
              userId: user.id,
            };

    const leaves = await db.leave.findMany({
      where: whereClause,
      include: {
        leaveType: true,
        approver: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('GET /api/leaves error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/leaves - Créer une demande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      leaveTypeId,
      startDate,
      endDate,
      halfDayStart,
      halfDayEnd,
      comment,
      documentUrl,
    } = body;

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;
    const { id: userId, companyId } = user;

    if (!leaveTypeId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
    }

    if (start > end) {
      return NextResponse.json(
        { error: 'La date de fin doit être postérieure à la date de début' },
        { status: 400 }
      );
    }

    const leaveType =
      (await db.leaveType.findFirst({
        where: {
          id: leaveTypeId,
          companyId,
          isActive: true,
        },
      })) ||
      (await db.leaveType.findFirst({
        where: {
          code: leaveTypeId,
          companyId,
          isActive: true,
        },
      }));

    if (!leaveType) {
      return NextResponse.json(
        { error: 'Type de congé introuvable pour cette entreprise' },
        { status: 404 }
      );
    }

    const company = await db.company.findUnique({
      where: { id: companyId },

      select: { workingDays: true },
    });

    const workingDays = (company as { workingDays?: number[] } | null)
      ?.workingDays;

    const totalDays = calculateBusinessDays(start, end, {
      workingDays:
        workingDays && workingDays.length > 0 ? workingDays : undefined,
      halfDayStart,
      halfDayEnd,
    });

    if (totalDays <= 0) {
      return NextResponse.json(
        { error: 'La période sélectionnée ne contient aucun jour ouvré' },
        { status: 400 }
      );
    }

    const policies = await db.leavePolicy.findMany({
      where: {
        companyId,
        isActive: true,
      },
    });

    for (const policy of policies) {
      if (
        policy.maxConsecutiveDays !== null &&
        policy.maxConsecutiveDays !== undefined &&
        totalDays > policy.maxConsecutiveDays
      ) {
        return NextResponse.json(
          {
            error: `La demande dépasse la limite de ${policy.maxConsecutiveDays} jour(s) consécutif(s) définie par la politique "${policy.name}"`,
          },
          { status: 400 }
        );
      }

      if (policy.blackoutDates && policy.blackoutDates.length > 0) {
        const containsBlackout = policy.blackoutDates.some((blackout: Date) => {
          const blackoutDay = new Date(blackout);
          blackoutDay.setHours(0, 0, 0, 0);

          const cursor = new Date(start);
          cursor.setHours(0, 0, 0, 0);

          while (cursor <= end) {
            if (cursor.getTime() === blackoutDay.getTime()) {
              return true;
            }
            cursor.setDate(cursor.getDate() + 1);
          }
          return false;
        });

        if (containsBlackout) {
          return NextResponse.json(
            {
              error: `Les dates sélectionnées chevauchent une période bloquée par la politique "${policy.name}"`,
            },
            { status: 400 }
          );
        }
      }

      if (policy.requiresDocument && !documentUrl) {
        return NextResponse.json(
          {
            error: `Un justificatif est requis par la politique "${policy.name}" pour cette demande.`,
          },
          { status: 400 }
        );
      }
    }

    const leave = await db.leave.create({
      data: {
        companyId,
        userId,
        leaveTypeId: leaveType.id, // <-- Correction ici
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        halfDayStart,
        halfDayEnd,
        totalDays,
        comment,
        documentUrl: documentUrl || null,
        status: 'PENDING',
      },
      include: {
        leaveType: true,
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error('POST /api/leaves error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
