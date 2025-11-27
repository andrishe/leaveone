import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);
    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    const { user } = authContext;

    // Détermine l'année à afficher (par défaut année en cours, ou année passée en query)
    const url = new URL(request.url);
    const year =
      Number(url.searchParams.get('year')) || new Date().getFullYear();

    // Récupère tous les congés payés validés pour l'utilisateur sur l'année sélectionnée
    const leaves = await db.leave.findMany({
      where: {
        userId: user.id,
        companyId: user.companyId,
        status: 'APPROVED',
        leaveType: { code: 'CP' },
        startDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      select: { totalDays: true },
    });

    // Somme des jours pris
    const daysTaken = leaves.reduce((sum, l) => sum + (l.totalDays ?? 0), 0);

    // Récupère le quota annuel (exemple : 25 jours, à adapter selon ta logique)
    const leaveType = await db.leaveType.findFirst({
      where: { companyId: user.companyId, code: 'CP', isActive: true },
      select: { maxDaysPerYear: true }, // Assure-toi que ce champ existe dans ton modèle
    });
    const annualQuota = leaveType?.maxDaysPerYear ?? 25;

    // Solde disponible
    const daysLeft = annualQuota - daysTaken;

    return NextResponse.json({
      daysTaken,
      daysLeft,
      annualQuota,
    });
  } catch (error) {
    console.error('GET /api/leaves/summary error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
