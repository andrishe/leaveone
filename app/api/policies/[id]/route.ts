import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';
import { parsePolicyPayload } from '@/lib/validators/policy'; // ✅ Changer cet import

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ... reste du code inchangé
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ... reste du code inchangé
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ... reste du code inchangé
}
