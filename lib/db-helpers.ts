import { headers } from 'next/headers';
import { db } from './db';

/**
 * 🔒 Récupère le companyId depuis le middleware
 * OBLIGATOIRE pour toutes les requêtes BDD
 */
export async function getCompanyId(): Promise<string> {
  const headersList = await headers();
  const companyId = headersList.get('x-company-id');

  if (!companyId) {
    throw new Error('SECURITY: companyId missing. Check middleware.');
  }

  return companyId;
}

export async function getUserId(): Promise<string> {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');

  if (!userId) {
    throw new Error('SECURITY: userId missing. Check middleware.');
  }

  return userId;
}

export async function getUserRole(): Promise<'ADMIN' | 'MANAGER' | 'EMPLOYEE'> {
  const headersList = await headers();
  const role = headersList.get('x-user-role');

  if (!role) {
    throw new Error('SECURITY: role missing. Check middleware.');
  }

  return role as 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

/**
 * 🔒 Wrapper Prisma avec isolation automatique
 */
export const secureDb = {
  // Exemple : Liste congés (filtrée par companyId)
  async getLeaves() {
    const companyId = await getCompanyId();

    return db.leave.findMany({
      where: { companyId }, // 🔒 FILTRE OBLIGATOIRE
      include: {
        user: { select: { name: true, email: true } },
        leaveType: true,
      },
    });
  },

  // Exemple : Créer congé (avec companyId automatique)
  async createLeave(data: {
    userId: string;
    leaveTypeId: string;
    startDate: Date;
    endDate: Date;
    totalDays: number;
  }) {
    const companyId = await getCompanyId();

    // 🔒 Vérifier que userId appartient à la company
    const user = await db.user.findFirst({
      where: { id: data.userId, companyId },
    });

    if (!user) {
      throw new Error('SECURITY: User does not belong to your company');
    }

    return db.leave.create({
      data: {
        ...data,
        companyId, // 🔒 Injecté automatiquement
      },
    });
  },

  // Répéter pour chaque méthode CRUD...
};
