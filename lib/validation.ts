import { z } from 'zod';

// Leave request validation
export const createLeaveSchema = z.object({
  leaveTypeId: z.string().min(1, 'Le type de congé est requis'),
  startDate: z.string().datetime('Date de début invalide'),
  endDate: z.string().datetime('Date de fin invalide'),
  halfDayStart: z.boolean().optional().default(false),
  halfDayEnd: z.boolean().optional().default(false),
  comment: z.string().optional(),
  documentUrl: z.string().url('URL du document invalide').optional(),
});

export const approveLeaveSchema = z.object({
  action: z.enum(['approve', 'reject'], {
    message: "L'action doit être 'approve' ou 'reject'",
  }),
  reason: z.string().optional(),
}).refine((data) => {
  // If rejecting, reason is required
  if (data.action === 'reject' && (!data.reason || data.reason.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Une raison est obligatoire pour un refus',
  path: ['reason'],
});

// User validation
export const createUserSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
  managerId: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Email invalide').optional(),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
  managerId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

// Leave type validation
export const createLeaveTypeSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Couleur hexadécimale invalide').default('#3b82f6'),
  icon: z.string().default('🏖️'),
  maxDaysPerYear: z.number().positive('Le nombre de jours doit être positif'),
  requiresApproval: z.boolean().default(true),
  requiresDocument: z.boolean().default(false),
  carryOverAllowed: z.boolean().default(false),
  carryOverMaxDays: z.number().min(0).default(0),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Company settings validation
export const updateCompanySettingsSchema = z.object({
  name: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  workingDays: z.array(z.number().int().min(0).max(6)).optional(),
  notificationNewRequestEmail: z.boolean().optional(),
  notificationPendingReminder: z.boolean().optional(),
  notificationPush: z.boolean().optional(),
  defaultTheme: z.enum(['light', 'dark', 'system']).optional(),
});

// Helper function to validate request data
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true;
  data: T;
} | {
  success: false;
  errors: z.ZodError;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Helper to format Zod errors for API responses
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });
  return formatted;
}
