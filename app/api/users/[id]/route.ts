import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await context.params;

    const employee = await db.user.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        managerId: true,
        isActive: true,
        createdAt: true,
        manager: {
          select: { id: true, name: true },
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employé introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('GET /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existingUser = await db.user.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Employé introuvable' },
        { status: 404 }
      );
    }

    const { name, email, role, managerId, isActive } = body;
    const updates: Record<string, unknown> = {};

    if (typeof name === 'string' && name.trim()) {
      updates.name = name.trim();
    }

    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedEmail !== existingUser.email) {
        const emailExists = await db.user.findFirst({
          where: {
            email: normalizedEmail,
            companyId: user.companyId,
            id: { not: id },
          },
        });

        if (emailExists) {
          return NextResponse.json(
            { error: 'Cet email est déjà utilisé' },
            { status: 400 }
          );
        }

        updates.email = normalizedEmail;
      }
    }

    if (role && ['ADMIN', 'MANAGER', 'EMPLOYEE'].includes(role)) {
      updates.role = role;
    }

    if (managerId !== undefined) {
      if (managerId === '' || managerId === null) {
        updates.managerId = null;
      } else {
        const managerExists = await db.user.findFirst({
          where: {
            id: managerId,
            companyId: user.companyId,
            role: 'MANAGER',
          },
        });

        if (managerExists) {
          updates.managerId = managerId;
        }
      }
    }

    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Aucune modification fournie' },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        managerId: true,
        isActive: true,
        createdAt: true,
        manager: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await context.params;

    if (id === user.id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas supprimer votre propre compte' },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Employé introuvable' },
        { status: 404 }
      );
    }

    // Supprimer les sessions de l'utilisateur
    await db.session.deleteMany({
      where: { userId: id },
    });

    // Supprimer les soldes de congés
    await db.leaveBalance.deleteMany({
      where: { userId: id },
    });

    // Supprimer les demandes de congés
    await db.leave.deleteMany({
      where: { userId: id },
    });

    // Retirer ce manager des autres utilisateurs
    await db.user.updateMany({
      where: { managerId: id },
      data: { managerId: null },
    });

    // Supprimer l'utilisateur
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
