import { describe, it, expect } from 'vitest';
import {
  createLeaveSchema,
  approveLeaveSchema,
  createUserSchema,
  paginationSchema,
  validateRequest,
  formatZodErrors,
} from '../lib/validation';

describe('Validation Schemas', () => {
  describe('createLeaveSchema', () => {
    it('should validate correct leave request', () => {
      const validData = {
        leaveTypeId: 'type123',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-01-20T00:00:00.000Z',
        halfDayStart: false,
        halfDayEnd: false,
        comment: 'Vacances d\'été',
      };

      const result = createLeaveSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty leaveTypeId', () => {
      const invalidData = {
        leaveTypeId: '',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-01-20T00:00:00.000Z',
      };

      const result = createLeaveSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
      const invalidData = {
        leaveTypeId: 'type123',
        startDate: 'not-a-date',
        endDate: '2024-01-20T00:00:00.000Z',
      };

      const result = createLeaveSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should set default values for optional fields', () => {
      const data = {
        leaveTypeId: 'type123',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-01-20T00:00:00.000Z',
      };

      const result = createLeaveSchema.safeParse(data);
      if (result.success) {
        expect(result.data.halfDayStart).toBe(false);
        expect(result.data.halfDayEnd).toBe(false);
      }
    });

    it('should reject invalid document URL', () => {
      const invalidData = {
        leaveTypeId: 'type123',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-01-20T00:00:00.000Z',
        documentUrl: 'not-a-url',
      };

      const result = createLeaveSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('approveLeaveSchema', () => {
    it('should validate approval action', () => {
      const validData = {
        action: 'approve',
      };

      const result = approveLeaveSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate rejection with reason', () => {
      const validData = {
        action: 'reject',
        reason: 'Période de forte activité',
      };

      const result = approveLeaveSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid action', () => {
      const invalidData = {
        action: 'cancel',
      };

      const result = approveLeaveSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject rejection without reason', () => {
      const invalidData = {
        action: 'reject',
        reason: '',
      };

      const result = approveLeaveSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject rejection with whitespace-only reason', () => {
      const invalidData = {
        action: 'reject',
        reason: '   ',
      };

      const result = approveLeaveSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createUserSchema', () => {
    it('should validate correct user data', () => {
      const validData = {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'SecurePassword123!',
        role: 'EMPLOYEE',
      };

      const result = createUserSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        name: 'John Doe',
        password: 'SecurePassword123!',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'short',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short name', () => {
      const invalidData = {
        email: 'john.doe@example.com',
        name: 'J',
        password: 'SecurePassword123!',
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should set default role to EMPLOYEE', () => {
      const data = {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: 'SecurePassword123!',
      };

      const result = createUserSchema.safeParse(data);
      if (result.success) {
        expect(result.data.role).toBe('EMPLOYEE');
      }
    });
  });

  describe('paginationSchema', () => {
    it('should validate correct pagination params', () => {
      const validData = {
        page: '1',
        limit: '10',
        sortOrder: 'desc',
      };

      const result = paginationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should coerce string numbers to integers', () => {
      const data = {
        page: '5',
        limit: '20',
      };

      const result = paginationSchema.safeParse(data);
      if (result.success) {
        expect(result.data.page).toBe(5);
        expect(result.data.limit).toBe(20);
        expect(typeof result.data.page).toBe('number');
      }
    });

    it('should reject negative page number', () => {
      const invalidData = {
        page: '-1',
        limit: '10',
      };

      const result = paginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject limit over 100', () => {
      const invalidData = {
        page: '1',
        limit: '150',
      };

      const result = paginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should set default values', () => {
      const data = {};

      const result = paginationSchema.safeParse(data);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
        expect(result.data.sortOrder).toBe('desc');
      }
    });
  });

  describe('validateRequest helper', () => {
    it('should return success for valid data', () => {
      const data = {
        leaveTypeId: 'type123',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-01-20T00:00:00.000Z',
      };

      const result = validateRequest(createLeaveSchema, data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject(data);
      }
    });

    it('should return errors for invalid data', () => {
      const data = {
        leaveTypeId: '',
        startDate: 'invalid-date',
        endDate: '2024-01-20T00:00:00.000Z',
      };

      const result = validateRequest(createLeaveSchema, data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
      }
    });
  });

  describe('formatZodErrors helper', () => {
    it('should format errors with field paths', () => {
      const data = {
        leaveTypeId: '',
        startDate: 'invalid',
      };

      const parseResult = createLeaveSchema.safeParse(data);
      if (!parseResult.success) {
        const formatted = formatZodErrors(parseResult.error);

        expect(formatted).toHaveProperty('leaveTypeId');
        expect(formatted).toHaveProperty('startDate');
        expect(formatted).toHaveProperty('endDate'); // Missing required field
      }
    });
  });
});
