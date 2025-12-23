import { describe, it, expect, beforeEach, vi } from 'vitest';
import { deductLeaveBalance, addPendingLeave, removePendingLeave, initializeUserBalances } from '../lib/leave-balance';
import { db } from '../lib/db';

// Mock Prisma client
vi.mock('../lib/db', () => ({
  db: {
    leaveBalance: {
      findUnique: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    leaveType: {
      findMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

describe('Leave Balance Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deductLeaveBalance', () => {
    it('should deduct days from balance when approved', async () => {
      const mockBalance = {
        id: '1',
        userId: 'user1',
        leaveTypeId: 'type1',
        year: 2024,
        allocated: 25,
        used: 5,
        pending: 3,
        remaining: 17,
        carryOver: 0,
      };

      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(mockBalance);
      vi.mocked(db.leaveBalance.update).mockResolvedValue({
        ...mockBalance,
        used: 8,
        pending: 0,
        remaining: 17,
      });

      await deductLeaveBalance('user1', 'type1', 3, 2024);

      expect(db.leaveBalance.update).toHaveBeenCalledWith({
        where: {
          userId_leaveTypeId_year: {
            userId: 'user1',
            leaveTypeId: 'type1',
            year: 2024,
          },
        },
        data: {
          used: 8,
          pending: 0,
          remaining: 17,
        },
      });
    });

    it('should throw error if balance not found', async () => {
      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(null);

      await expect(
        deductLeaveBalance('user1', 'type1', 3, 2024)
      ).rejects.toThrow('Aucun solde trouvé');
    });

    it('should throw error if insufficient pending balance', async () => {
      const mockBalance = {
        id: '1',
        userId: 'user1',
        leaveTypeId: 'type1',
        year: 2024,
        allocated: 25,
        used: 5,
        pending: 2, // Only 2 days pending
        remaining: 18,
        carryOver: 0,
      };

      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(mockBalance);

      await expect(
        deductLeaveBalance('user1', 'type1', 3, 2024) // Trying to deduct 3 days
      ).rejects.toThrow('Solde en attente insuffisant');
    });
  });

  describe('addPendingLeave', () => {
    it('should add days to pending when leave is requested', async () => {
      const mockBalance = {
        id: '1',
        userId: 'user1',
        leaveTypeId: 'type1',
        year: 2024,
        allocated: 25,
        used: 5,
        pending: 0,
        remaining: 20,
        carryOver: 0,
      };

      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(mockBalance);
      vi.mocked(db.leaveBalance.update).mockResolvedValue({
        ...mockBalance,
        pending: 3,
        remaining: 17,
      });

      await addPendingLeave('user1', 'type1', 3, 2024);

      expect(db.leaveBalance.update).toHaveBeenCalledWith({
        where: {
          userId_leaveTypeId_year: {
            userId: 'user1',
            leaveTypeId: 'type1',
            year: 2024,
          },
        },
        data: {
          pending: 3,
          remaining: 17,
        },
      });
    });

    it('should throw error if insufficient remaining balance', async () => {
      const mockBalance = {
        id: '1',
        userId: 'user1',
        leaveTypeId: 'type1',
        year: 2024,
        allocated: 25,
        used: 20,
        pending: 3,
        remaining: 2, // Only 2 days remaining
        carryOver: 0,
      };

      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(mockBalance);

      await expect(
        addPendingLeave('user1', 'type1', 5, 2024) // Requesting 5 days
      ).rejects.toThrow('Solde insuffisant');
    });
  });

  describe('removePendingLeave', () => {
    it('should remove days from pending when leave is rejected', async () => {
      const mockBalance = {
        id: '1',
        userId: 'user1',
        leaveTypeId: 'type1',
        year: 2024,
        allocated: 25,
        used: 5,
        pending: 3,
        remaining: 17,
        carryOver: 0,
      };

      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(mockBalance);
      vi.mocked(db.leaveBalance.update).mockResolvedValue({
        ...mockBalance,
        pending: 0,
        remaining: 20,
      });

      await removePendingLeave('user1', 'type1', 3, 2024);

      expect(db.leaveBalance.update).toHaveBeenCalledWith({
        where: {
          userId_leaveTypeId_year: {
            userId: 'user1',
            leaveTypeId: 'type1',
            year: 2024,
          },
        },
        data: {
          pending: 0,
          remaining: 20,
        },
      });
    });

    it('should not go below zero when removing pending', async () => {
      const mockBalance = {
        id: '1',
        userId: 'user1',
        leaveTypeId: 'type1',
        year: 2024,
        allocated: 25,
        used: 5,
        pending: 2, // Only 2 pending
        remaining: 18,
        carryOver: 0,
      };

      vi.mocked(db.leaveBalance.findUnique).mockResolvedValue(mockBalance);
      vi.mocked(db.leaveBalance.update).mockResolvedValue({
        ...mockBalance,
        pending: 0, // Should be 0, not negative
        remaining: 20,
      });

      await removePendingLeave('user1', 'type1', 5, 2024); // Removing more than pending

      expect(db.leaveBalance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            pending: 0, // Should be clamped to 0
          }),
        })
      );
    });
  });

  describe('initializeUserBalances', () => {
    it('should create balances for all active leave types', async () => {
      const mockLeaveTypes = [
        {
          id: 'type1',
          companyId: 'company1',
          name: 'Congés payés',
          code: 'CP',
          maxDaysPerYear: 25,
          carryOverAllowed: true,
          carryOverMaxDays: 5,
          isActive: true,
        },
        {
          id: 'type2',
          companyId: 'company1',
          name: 'RTT',
          code: 'RTT',
          maxDaysPerYear: 10,
          carryOverAllowed: false,
          carryOverMaxDays: 0,
          isActive: true,
        },
      ];

      const mockPreviousBalances = [
        {
          id: 'bal1',
          userId: 'user1',
          leaveTypeId: 'type1',
          year: 2023,
          allocated: 25,
          used: 20,
          pending: 0,
          remaining: 5,
          carryOver: 0,
          leaveType: mockLeaveTypes[0],
        },
      ];

      vi.mocked(db.leaveType.findMany).mockResolvedValue(mockLeaveTypes as any);
      vi.mocked(db.leaveBalance.findMany).mockResolvedValue(mockPreviousBalances as any);
      vi.mocked(db.leaveBalance.upsert).mockResolvedValue({} as any);

      await initializeUserBalances('user1', 'company1', 2024);

      expect(db.leaveBalance.upsert).toHaveBeenCalledTimes(2);

      // First type should have carry-over
      expect(db.leaveBalance.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            allocated: 25,
            carryOver: 5, // Carry-over from previous year's remaining
            remaining: 30,
          }),
        })
      );

      // Second type should not have carry-over
      expect(db.leaveBalance.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            allocated: 10,
            carryOver: 0,
            remaining: 10,
          }),
        })
      );
    });

    it('should respect maximum carry-over limit', async () => {
      const mockLeaveTypes = [
        {
          id: 'type1',
          companyId: 'company1',
          name: 'Congés payés',
          code: 'CP',
          maxDaysPerYear: 25,
          carryOverAllowed: true,
          carryOverMaxDays: 3, // Max 3 days carry-over
          isActive: true,
        },
      ];

      const mockPreviousBalances = [
        {
          id: 'bal1',
          userId: 'user1',
          leaveTypeId: 'type1',
          year: 2023,
          allocated: 25,
          used: 15,
          pending: 0,
          remaining: 10, // 10 days remaining
          carryOver: 0,
          leaveType: mockLeaveTypes[0],
        },
      ];

      vi.mocked(db.leaveType.findMany).mockResolvedValue(mockLeaveTypes as any);
      vi.mocked(db.leaveBalance.findMany).mockResolvedValue(mockPreviousBalances as any);
      vi.mocked(db.leaveBalance.upsert).mockResolvedValue({} as any);

      await initializeUserBalances('user1', 'company1', 2024);

      // Should only carry over 3 days (max), not 10
      expect(db.leaveBalance.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            carryOver: 3, // Limited to carryOverMaxDays
          }),
        })
      );
    });
  });
});
