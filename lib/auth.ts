import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { db } from './db';

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'EMPLOYEE',
      },
    },
  },
  trustedOrigins:
    process.env.NODE_ENV === 'production'
      ? [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000']
      : ['http://localhost:3000'],
  advanced: {
    generateId: false, // Laisse Prisma gérer les IDs
  },
});

export type Session = typeof auth.$Infer.Session;
