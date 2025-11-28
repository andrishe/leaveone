import { NextRequest, NextResponse } from 'next/server';
import { read, utils } from 'xlsx';
import { hashPassword } from 'better-auth/crypto';
import { db } from '@/lib/db';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB pour éviter les abus
const AUTHORIZED_ROLES = new Set(['ADMIN', 'MANAGER', 'EMPLOYEE']);
const STATUS_TO_ACTIVE = new Map([
  ['ACTIF', true],
  ['ACTIVE', true],
  ['INACTIF', false],
  ['INACTIVE', false],
]);

function normaliseHeader(key: string): string {
  return key.trim().toLowerCase();
}

function extractCell(
  row: Record<string, unknown>,
  possibilities: string[]
): string {
  for (const key of possibilities) {
    const value = row[key];
    if (value !== undefined && value !== null) {
      return String(value).trim();
    }
  }
  return '';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type ParsedRow = {
  line: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  managerEmail?: string;
  isActive: boolean;
};

type RowError = {
  line: number;
  email?: string;
  message: string;
};

export async function POST(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedContext(request);

    if (!authContext) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { user: sessionUser } = authContext;

    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Fichier requis (CSV ou XLSX).' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Le fichier est vide.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 5MB).' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let workbook;

    try {
      workbook = read(arrayBuffer, { type: 'array', raw: false });
    } catch (error) {
      console.error('Import users parse error:', error);
      return NextResponse.json(
        {
          error:
            "Impossible de lire le fichier. Assurez-vous d'utiliser un CSV ou XLSX valide.",
        },
        { status: 400 }
      );
    }

    if (!workbook.SheetNames.length) {
      return NextResponse.json(
        { error: 'Le fichier ne contient aucune feuille.' },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
    });

    if (rawRows.length === 0) {
      return NextResponse.json(
        { error: 'Aucune donnée à importer.' },
        { status: 400 }
      );
    }

    const normalisedRows = rawRows.map((row) => {
      const normalised: Record<string, unknown> = {};
      Object.entries(row).forEach(([key, value]) => {
        normalised[normaliseHeader(key)] = value;
      });
      return normalised;
    });

    const parsedRows: ParsedRow[] = [];
    const rowErrors: RowError[] = [];
    const seenEmails = new Set<string>();

    normalisedRows.forEach((row, index) => {
      const lineNumber = index + 2; // +2 pour inclure l'en-tête
      const email = extractCell(row, ['email']).toLowerCase();
      const firstName = extractCell(row, ['prenom', 'prénom', 'firstname']);
      const lastName = extractCell(row, ['nom', 'lastname']);
      const roleRaw = extractCell(row, ['role', 'fonction']).toUpperCase();
      const statusRaw = extractCell(row, ['statut', 'status']).toUpperCase();
      const managerEmailRaw = extractCell(row, [
        'manageremail',
        'manager_email',
        'responsableemail',
      ]).toLowerCase();

      if (!email) {
        rowErrors.push({ line: lineNumber, message: 'Email manquant.' });
        return;
      }

      if (!isValidEmail(email)) {
        rowErrors.push({
          line: lineNumber,
          email,
          message: 'Email invalide.',
        });
        return;
      }

      if (seenEmails.has(email)) {
        rowErrors.push({
          line: lineNumber,
          email,
          message: 'Email en double dans le fichier.',
        });
        return;
      }
      seenEmails.add(email);

      const role = (
        roleRaw && AUTHORIZED_ROLES.has(roleRaw) ? roleRaw : 'EMPLOYEE'
      ) as ParsedRow['role'];

      const isActive = statusRaw
        ? (STATUS_TO_ACTIVE.get(statusRaw) ?? true)
        : true;

      const managerEmail = managerEmailRaw || undefined;

      const nameParts = [firstName, lastName].filter(Boolean);
      const name = nameParts.length > 0 ? nameParts.join(' ') : email;

      parsedRows.push({
        line: lineNumber,
        email,
        name,
        role,
        managerEmail,
        isActive,
      });
    });

    if (parsedRows.length === 0) {
      return NextResponse.json(
        {
          error: 'Aucune ligne valide détectée.',
          rowsProcessed: rawRows.length,
          errors: rowErrors,
        },
        { status: 400 }
      );
    }

    const existingUsers: { email: string }[] = await db.user.findMany({
      where: {
        companyId: sessionUser.companyId,
        email: { in: parsedRows.map((row) => row.email) },
      },
      select: { email: true },
    });

    const existingEmails = new Set(
      existingUsers.map((user: { email: string }) => user.email)
    );

    const validRows: ParsedRow[] = [];

    parsedRows.forEach((row) => {
      if (existingEmails.has(row.email)) {
        rowErrors.push({
          line: row.line,
          email: row.email,
          message: 'Email déjà utilisé pour cette entreprise.',
        });
        return;
      }

      validRows.push(row);
    });

    const managerEmails = Array.from(
      new Set(validRows.map((row) => row.managerEmail).filter(Boolean))
    ) as string[];

    const managerMap = new Map<string, string>();

    if (managerEmails.length > 0) {
      const managers = await db.user.findMany({
        where: {
          companyId: sessionUser.companyId,
          email: { in: managerEmails },
        },
        select: { id: true, email: true },
      });

      managers.forEach((manager: { id: string; email: string }) => {
        managerMap.set(manager.email.toLowerCase(), manager.id);
      });
    }

    const rowsReadyForCreation: Array<ParsedRow & { managerId?: string }> = [];

    validRows.forEach((row) => {
      if (row.managerEmail && !managerMap.has(row.managerEmail)) {
        rowErrors.push({
          line: row.line,
          email: row.email,
          message:
            "Le manager spécifié n'existe pas ou n'appartient pas à cette entreprise.",
        });
        return;
      }

      rowsReadyForCreation.push({
        ...row,
        managerId: row.managerEmail
          ? managerMap.get(row.managerEmail.toLowerCase())
          : undefined,
      });
    });

    if (rowsReadyForCreation.length === 0) {
      return NextResponse.json(
        {
          error: 'Toutes les lignes valides ont échoué lors des vérifications.',
          rowsProcessed: rawRows.length,
          errors: rowErrors,
        },
        { status: 400 }
      );
    }

    const createdUsers: Array<{
      email: string;
      name: string;
      role: string;
      tempPassword: string;
    }> = [];

    for (const row of rowsReadyForCreation) {
      const tempPassword = Math.random().toString(36).slice(-10);
      const passwordHash = await hashPassword(tempPassword);

      const created = await db.user.create({
        data: {
          companyId: sessionUser.companyId,
          email: row.email,
          name: row.name,
          passwordHash,
          role: row.role,
          managerId: row.managerId,
          isActive: row.isActive,
        },
        select: {
          email: true,
          name: true,
          role: true,
        },
      });

      createdUsers.push({
        ...created,
        tempPassword,
      });
    }

    return NextResponse.json({
      inserted: createdUsers.length,
      errors: rowErrors,
      users: createdUsers,
    });
  } catch (error) {
    console.error('POST /api/users/import error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
