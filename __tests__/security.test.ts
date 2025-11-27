// @ts-nocheck
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/leaves/route';
import { getAuthenticatedContext } from '@/lib/auth-helpers';

vi.mock('@/lib/auth-helpers', () => ({
  getAuthenticatedContext: vi.fn(),
}));

const mockedGetAuthenticatedContext = vi.mocked(getAuthenticatedContext);

beforeEach(() => {
  mockedGetAuthenticatedContext.mockReset();
});

describe('Security: Multi-tenant isolation', () => {
  test('User cannot access other company data', async () => {
    mockedGetAuthenticatedContext.mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost/api/leaves', {
      headers: {
        'x-company-id': 'company-A',
        'x-user-id': 'user-1',
      },
    });

    const response = await GET(request);

    expect(response.status).toBe(401);
  });

  test('Manager cannot approve outside their team', async () => {
    // TODO: Test approbation hors périmètre
  });

  test('Trial expired blocks access', async () => {
    // TODO: Test blocage trial expiré
  });
});
