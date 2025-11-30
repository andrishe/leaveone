import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  accelerateUrl: process.env.PRISMA_ACCELERATE_URL, // Assurez-vous que cette variable existe dans .env
});

export { db };
