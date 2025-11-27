import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database avec Better Auth...');

  // Pour Better Auth, on va créer les utilisateurs via l'API de signup
  // Pour l'instant, créons juste les comptes directement dans la BDD
  // avec le format attendu par Better Auth

  console.log(
    "✅ Pour créer les comptes, utilisez la page d'inscription /signup"
  );
  console.log('   ou connectez-vous avec les comptes existants si déjà créés.');

  // Vérifier si des comptes existent déjà
  const existingUsers = await prisma.user.findMany({
    include: {
      accounts: true,
    },
  });

  console.log(
    `\n📊 ${existingUsers.length} utilisateur(s) trouvé(s) dans la base`
  );

  for (const user of existingUsers) {
    console.log(
      `   - ${user.email} (${user.role}) - ${user.accounts.length} compte(s) Better Auth`
    );
  }

  console.log('\n💡 Conseil: Relancez simplement le seed normal:');
  console.log('   pnpm prisma db seed');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
