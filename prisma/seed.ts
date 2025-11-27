import { PrismaClient, Plan } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { hashPassword } from 'better-auth/crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Supprimer les données existantes dans l'ordre inverse des dépendances
  console.log('🗑️  Nettoyage des données existantes...');
  await prisma.leave.deleteMany();
  await prisma.leaveBalance.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.leaveType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.auditLog.deleteMany();
  console.log('✅ Données nettoyées');

  // Créer une entreprise de test
  const companyData: Prisma.CompanyCreateInput = {
    name: 'Demo Company',
    slug: 'demo-company',
    plan: Plan.BUSINESS,
    contactEmail: 'contact@demo-company.com',
    contactPhone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, 75001 Paris',
    notificationNewRequestEmail: true,
    notificationPendingReminder: true,
    notificationPush: false,
    defaultTheme: 'system',
    workingDays: [1, 2, 3, 4, 5],
  };

  const company = await prisma.company.create({
    data: companyData,
  });

  console.log('✅ Company created:', company.name);

  // Créer des types de congés
  const leaveTypes = await Promise.all([
    prisma.leaveType.create({
      data: {
        companyId: company.id,
        name: 'Congés Payés',
        code: 'CP',
        color: '#3b82f6',
        icon: '🏖️',
        maxDaysPerYear: 25,
        requiresApproval: true,
        carryOverAllowed: true,
        carryOverMaxDays: 5,
      },
    }),
    prisma.leaveType.create({
      data: {
        companyId: company.id,
        name: 'RTT',
        code: 'RTT',
        color: '#8b5cf6',
        icon: '⏰',
        maxDaysPerYear: 10,
        requiresApproval: true,
        carryOverAllowed: false,
      },
    }),
    prisma.leaveType.create({
      data: {
        companyId: company.id,
        name: 'Congé Maladie',
        code: 'SICK',
        color: '#ef4444',
        icon: '🤒',
        maxDaysPerYear: 0,
        requiresApproval: false,
        requiresDocument: true,
      },
    }),
  ]);

  console.log('✅ Leave types created:', leaveTypes.length);

  // Créer des utilisateurs avec mot de passe hashé via le helper Better Auth (format attendu)
  const passwordHash = await hashPassword('password123');

  const admin = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Jean Dupont',
      email: 'jean.dupont@demo.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  // Créer le compte Better Auth pour admin (sans password, il sera géré par Better Auth)
  await prisma.account.create({
    data: {
      id: randomUUID(),
      userId: admin.id,
      accountId: admin.id,
      providerId: 'credential',
      password: passwordHash, // Utiliser le même hash
    },
  });

  const manager = await prisma.user.create({
    data: {
      companyId: company.id,
      name: 'Marie Dubois',
      email: 'marie.dubois@demo.com',
      passwordHash,
      role: 'MANAGER',
    },
  });

  await prisma.account.create({
    data: {
      id: randomUUID(),
      userId: manager.id,
      accountId: manager.id,
      providerId: 'credential',
      password: passwordHash,
    },
  });

  const employees = await Promise.all([
    prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Sophie Martin',
        email: 'sophie.martin@demo.com',
        passwordHash,
        role: 'EMPLOYEE',
        managerId: manager.id,
      },
    }),
    prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Pierre Dubois',
        email: 'pierre.dubois@demo.com',
        passwordHash,
        role: 'EMPLOYEE',
        managerId: manager.id,
      },
    }),
    prisma.user.create({
      data: {
        companyId: company.id,
        name: 'Luc Bernard',
        email: 'luc.bernard@demo.com',
        passwordHash,
        role: 'EMPLOYEE',
        managerId: manager.id,
      },
    }),
  ]);

  // Créer les comptes Better Auth pour les employés
  for (const employee of employees) {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId: employee.id,
        accountId: employee.id,
        providerId: 'credential',
        password: passwordHash,
      },
    });
  }

  console.log('✅ Users created:', employees.length + 2);

  // Créer des balances de congés pour TOUS les utilisateurs (admin, manager et employees)
  const currentYear = new Date().getFullYear();
  const cpType = leaveTypes[0];
  const rttType = leaveTypes[1];

  const allUsers = [admin, manager, ...employees];

  for (const user of allUsers) {
    const usedCP = Math.floor(Math.random() * 10);
    await prisma.leaveBalance.create({
      data: {
        userId: user.id,
        leaveTypeId: cpType.id,
        year: currentYear,
        allocated: 25,
        used: usedCP,
        pending: 0,
        remaining: 25 - usedCP,
      },
    });

    const usedRTT = Math.floor(Math.random() * 5);
    await prisma.leaveBalance.create({
      data: {
        userId: user.id,
        leaveTypeId: rttType.id,
        year: currentYear,
        allocated: 10,
        used: usedRTT,
        pending: 0,
        remaining: 10 - usedRTT,
      },
    });
  }

  console.log('✅ Leave balances created');

  // Créer des demandes de congés
  await prisma.leave.create({
    data: {
      companyId: company.id,
      userId: employees[0].id,
      leaveTypeId: cpType.id,
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-14'),
      totalDays: 5,
      status: 'PENDING',
      comment: 'Vacances en famille',
    },
  });

  await prisma.leave.create({
    data: {
      companyId: company.id,
      userId: employees[1].id,
      leaveTypeId: rttType.id,
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-01-20'),
      totalDays: 1,
      status: 'PENDING',
      comment: 'Pont',
    },
  });

  console.log('✅ Leaves created');
  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📧 Test credentials:');
  console.log('   Admin: jean.dupont@demo.com / password123');
  console.log('   Manager: marie.dubois@demo.com / password123');
  console.log('   Employee: sophie.martin@demo.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
