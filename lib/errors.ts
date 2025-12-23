import { NextResponse } from 'next/server';
import { z } from 'zod';
import { formatZodErrors } from './validation';

// Custom error classes
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Non authentifié') {
    super(401, message, 'UNAUTHENTICATED');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Accès refusé') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Données invalides',
    public errors?: Record<string, string>
  ) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit de données') {
    super(409, message, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Trop de requêtes') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}

// Error response helper
export function errorResponse(error: unknown): NextResponse {
  // Handle AppError instances
  if (error instanceof AppError) {
    const response: {
      error: string;
      code?: string;
      errors?: Record<string, string>;
    } = {
      error: error.message,
      code: error.code,
    };

    if (error instanceof ValidationError && error.errors) {
      response.errors = error.errors;
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation échouée',
        code: 'VALIDATION_ERROR',
        errors: formatZodErrors(error),
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };

    // Unique constraint violation
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target?.[0] || 'champ';
      return NextResponse.json(
        {
          error: `Une entrée avec ce ${target} existe déjà`,
          code: 'DUPLICATE_ENTRY',
        },
        { status: 409 }
      );
    }

    // Foreign key constraint violation
    if (prismaError.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'Référence invalide à une ressource inexistante',
          code: 'INVALID_REFERENCE',
        },
        { status: 400 }
      );
    }

    // Record not found
    if (prismaError.code === 'P2025') {
      return NextResponse.json(
        {
          error: 'Ressource introuvable',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  // Generic error response
  return NextResponse.json(
    {
      error: 'Une erreur inattendue est survenue',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function asyncHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error);
    }
  }) as T;
}

// Helper to throw validation errors
export function throwValidationError(message: string, errors?: Record<string, string>): never {
  throw new ValidationError(message, errors);
}

// Helper to assert conditions
export function assert(condition: boolean, error: AppError | string): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new AppError(400, error);
    }
    throw error;
  }
}
