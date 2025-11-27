import { NextRequest, NextResponse } from 'next/server';
import { Plan } from '@prisma/client';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

const allowedPlans = new Set(Object.values(Plan));
const allowedThemes = new Set(['light', 'dark', 'system']);

const companySelect = {
  id: true,
  name: true,
  plan: true,
  contactEmail: true,
  contactPhone: true,
  address: true,
  notificationNewRequestEmail: true,
  notificationPendingReminder: true,
  notificationPush: true,
  defaultTheme: true,
  workingDays: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    const company = await db.company.findUnique({
      where: { id: user.companyId },
      select: companySelect,
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Entreprise introuvable' },
        { status: 404 }
      );
    }

    const employeeCount = await db.user.count({
      where: { companyId: user.companyId },
    });

    return NextResponse.json({ ...company, employeeCount });
  } catch (error) {
    console.error('GET /api/company error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user } = authContext;

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const {
      name,
      contactEmail,
      contactPhone,
      address,
      plan,
      workingDays,
      notificationNewRequestEmail,
      notificationPendingReminder,
      notificationPush,
      defaultTheme,
    } = body ?? {};
    const updates: Record<string, unknown> = {};

    if (typeof name === 'string') {
      const trimmed = name.trim();
      if (!trimmed) {
        return NextResponse.json(
          { error: "Le nom de l'entreprise est requis" },
          { status: 400 }
        );
      }
      updates.name = trimmed;
    }

    if (typeof contactEmail === 'string') {
      const trimmed = contactEmail.trim();
      if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return NextResponse.json(
          { error: 'Email de contact invalide' },
          { status: 400 }
        );
      }
      updates.contactEmail = trimmed || null;
    }

    if (typeof contactPhone === 'string') {
      const trimmed = contactPhone.trim();
      updates.contactPhone = trimmed || null;
    }

    if (typeof address === 'string') {
      const trimmed = address.trim();
      updates.address = trimmed || null;
    }

    if (typeof plan === 'string') {
      if (!allowedPlans.has(plan as Plan)) {
        return NextResponse.json(
          { error: "Plan d'abonnement invalide" },
          { status: 400 }
        );
      }
      updates.plan = plan as Plan;
    }

    if (Array.isArray(workingDays)) {
      const normalized = workingDays
        .map((value) => Number.parseInt(String(value), 10))
        .filter((value) => Number.isInteger(value));

      const validRange = normalized.every((value) => value >= 1 && value <= 7);
      if (!validRange) {
        return NextResponse.json(
          {
            error:
              'Les jours ouvrés doivent être compris entre 1 (lundi) et 7 (dimanche)',
          },
          { status: 400 }
        );
      }

      const uniqueSorted = Array.from(new Set(normalized)).sort(
        (a, b) => a - b
      );
      updates.workingDays = uniqueSorted;
    }

    if (typeof notificationNewRequestEmail === 'boolean') {
      updates.notificationNewRequestEmail = notificationNewRequestEmail;
    }

    if (typeof notificationPendingReminder === 'boolean') {
      updates.notificationPendingReminder = notificationPendingReminder;
    }

    if (typeof notificationPush === 'boolean') {
      updates.notificationPush = notificationPush;
    }

    if (typeof defaultTheme === 'string') {
      const theme = defaultTheme.trim().toLowerCase();
      if (!allowedThemes.has(theme)) {
        return NextResponse.json(
          { error: 'Thème par défaut invalide' },
          { status: 400 }
        );
      }

      updates.defaultTheme = theme;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Aucune modification fournie' },
        { status: 400 }
      );
    }

    const updatedCompany = await db.company.update({
      where: { id: user.companyId },
      data: updates,
      select: companySelect,
    });

    const employeeCount = await db.user.count({
      where: { companyId: user.companyId },
    });

    return NextResponse.json({ ...updatedCompany, employeeCount });
  } catch (error) {
    console.error('PUT /api/company error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
