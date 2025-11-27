import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from 'better-auth/crypto';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

// GET /api/users - Liste des employés
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user: sessionUser } = authContext;

    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const users = await db.user.findMany({
      where: {
        companyId: sessionUser.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        manager: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST /api/users - Créer un employé
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, managerId } = body;

    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user: sessionUser } = authContext;

    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nom et email requis' },
        { status: 400 }
      );
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    // Créer un mot de passe temporaire
    const tempPassword = Math.random().toString(36).slice(-8);
    const passwordHash = await hashPassword(tempPassword);

    const createdUser = await db.user.create({
      data: {
        companyId: sessionUser.companyId,
        name,
        email,
        passwordHash,
        role: role || 'EMPLOYEE',
        managerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // TODO: Envoyer email avec mot de passe temporaire

    return NextResponse.json({ ...createdUser, tempPassword }, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
