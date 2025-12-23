import { NextRequest } from 'next/server';
import { RateLimitError } from './errors';

interface RateLimitStore {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
// For production, use Redis or a similar distributed cache
const store = new Map<string, RateLimitStore>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the window
   */
  limit: number;
  /**
   * Time window in seconds
   */
  window: number;
  /**
   * Custom identifier function (defaults to IP address)
   */
  identifier?: (request: NextRequest) => string;
}

/**
 * Rate limiter middleware for API routes
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   await rateLimit(request, { limit: 10, window: 60 });
 *   // ... rest of handler
 * }
 * ```
 */
export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<void> {
  const { limit, window, identifier } = options;

  // Get identifier (IP address by default)
  const key = identifier
    ? identifier(request)
    : getClientIdentifier(request);

  const now = Date.now();
  const windowMs = window * 1000;

  // Get or create rate limit record
  let record = store.get(key);

  if (!record || record.resetAt < now) {
    // Create new window
    record = {
      count: 0,
      resetAt: now + windowMs,
    };
    store.set(key, record);
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    throw new RateLimitError(
      `Trop de requêtes. Réessayez dans ${retryAfter} secondes.`
    );
  }
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
  /** Strict limit for authentication endpoints */
  auth: (request: NextRequest) =>
    rateLimit(request, { limit: 5, window: 60 }), // 5 requests per minute

  /** Standard limit for API endpoints */
  api: (request: NextRequest) =>
    rateLimit(request, { limit: 100, window: 60 }), // 100 requests per minute

  /** Generous limit for read operations */
  read: (request: NextRequest) =>
    rateLimit(request, { limit: 200, window: 60 }), // 200 requests per minute

  /** Strict limit for write operations */
  write: (request: NextRequest) =>
    rateLimit(request, { limit: 30, window: 60 }), // 30 requests per minute

  /** Very strict limit for sensitive operations */
  sensitive: (request: NextRequest) =>
    rateLimit(request, { limit: 10, window: 3600 }), // 10 requests per hour
};
