import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';
import { sendSupportRequestEmail } from '@/lib/email';

const allowedCategories = new Set([
  'question',
  'incident',
  'suggestion',
  'autre',
]);

function sanitizeString(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Données manquantes ou invalides' },
        { status: 400 }
      );
    }

    const rawCategory = sanitizeString(
      (body as Record<string, unknown>).category
    );
    const category = allowedCategories.has(rawCategory) ? rawCategory : 'autre';

    const subject = sanitizeString((body as Record<string, unknown>).subject);
    const message = sanitizeString((body as Record<string, unknown>).message);
    const includeDiagnostics = Boolean(
      (body as Record<string, unknown>).includeDiagnostics
    );

    if (!subject) {
      return NextResponse.json(
        { error: "L'objet est obligatoire" },
        { status: 400 }
      );
    }

    if (subject.length < 5) {
      return NextResponse.json(
        { error: "L'objet doit contenir au moins 5 caractères" },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Le message est obligatoire' },
        { status: 400 }
      );
    }

    if (message.length < 20) {
      return NextResponse.json(
        { error: 'Merci de détailler votre demande (20 caractères minimum)' },
        { status: 400 }
      );
    }

    const requester = await db.user.findUnique({
      where: { id: authContext.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!requester) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      );
    }

    await sendSupportRequestEmail({
      requesterName: requester.name ?? 'Utilisateur',
      requesterEmail: requester.email,
      requesterRole: requester.role,
      companyId: authContext.user.companyId,
      companyName: requester.company?.name ?? 'Entreprise inconnue',
      category,
      subject,
      message,
      includeDiagnostics,
    });

    try {
      await db.auditLog.create({
        data: {
          companyId: authContext.user.companyId,
          userId: requester.id,
          action: 'support.request',
          entityType: 'support',
          entityId: randomUUID(),
          metadata: {
            category,
            subject,
            includeDiagnostics,
          },
          ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
          userAgent: request.headers.get('user-agent') ?? undefined,
        },
      });
    } catch (error) {
      console.warn('Support audit log failed', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/support error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur inattendue' },
      { status: 500 }
    );
  }
}
