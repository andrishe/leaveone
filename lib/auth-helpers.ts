import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { db } from './db';

export async function getSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    return session;
  } catch (error) {
    return null;
  }
}

export async function requireApiSession(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return null;
  }

  return session;
}

export async function getAuthenticatedContext(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      companyId: true,
      role: true,
      isActive: true,
      managerId: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  return { session, user };
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.user.role || 'EMPLOYEE')) {
    redirect('/dashboard');
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}
