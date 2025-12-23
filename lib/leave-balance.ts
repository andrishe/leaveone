import { db } from '@/lib/db';

/**
 * Updates leave balance after a leave is approved
 * Moves days from pending to used, updates remaining
 */
export async function deductLeaveBalance(
  userId: string,
  leaveTypeId: string,
  totalDays: number,
  year: number
): Promise<void> {
  const balance = await db.leaveBalance.findUnique({
    where: {
      userId_leaveTypeId_year: {
        userId,
        leaveTypeId,
        year,
      },
    },
  });

  if (!balance) {
    throw new Error(
      `Aucun solde trouvé pour l'utilisateur ${userId}, type ${leaveTypeId}, année ${year}`
    );
  }

  // Verify sufficient balance
  if (balance.pending < totalDays) {
    throw new Error(
      `Solde en attente insuffisant. Disponible: ${balance.pending}, demandé: ${totalDays}`
    );
  }

  // Calculate new values
  const newUsed = balance.used + totalDays;
  const newPending = balance.pending - totalDays;
  const newRemaining = balance.allocated + balance.carryOver - newUsed - newPending;

  // Update balance
  await db.leaveBalance.update({
    where: {
      userId_leaveTypeId_year: {
        userId,
        leaveTypeId,
        year,
      },
    },
    data: {
      used: newUsed,
      pending: newPending,
      remaining: newRemaining,
    },
  });
}

/**
 * Updates leave balance when a leave is submitted (adds to pending)
 */
export async function addPendingLeave(
  userId: string,
  leaveTypeId: string,
  totalDays: number,
  year: number
): Promise<void> {
  const balance = await db.leaveBalance.findUnique({
    where: {
      userId_leaveTypeId_year: {
        userId,
        leaveTypeId,
        year,
      },
    },
  });

  if (!balance) {
    throw new Error(
      `Aucun solde trouvé pour l'utilisateur ${userId}, type ${leaveTypeId}, année ${year}`
    );
  }

  // Verify sufficient remaining balance
  if (balance.remaining < totalDays) {
    throw new Error(
      `Solde insuffisant. Disponible: ${balance.remaining}, demandé: ${totalDays}`
    );
  }

  // Calculate new values
  const newPending = balance.pending + totalDays;
  const newRemaining = balance.allocated + balance.carryOver - balance.used - newPending;

  // Update balance
  await db.leaveBalance.update({
    where: {
      userId_leaveTypeId_year: {
        userId,
        leaveTypeId,
        year,
      },
    },
    data: {
      pending: newPending,
      remaining: newRemaining,
    },
  });
}

/**
 * Removes pending days when a leave is rejected or cancelled
 */
export async function removePendingLeave(
  userId: string,
  leaveTypeId: string,
  totalDays: number,
  year: number
): Promise<void> {
  const balance = await db.leaveBalance.findUnique({
    where: {
      userId_leaveTypeId_year: {
        userId,
        leaveTypeId,
        year,
      },
    },
  });

  if (!balance) {
    throw new Error(
      `Aucun solde trouvé pour l'utilisateur ${userId}, type ${leaveTypeId}, année ${year}`
    );
  }

  // Calculate new values
  const newPending = Math.max(0, balance.pending - totalDays);
  const newRemaining = balance.allocated + balance.carryOver - balance.used - newPending;

  // Update balance
  await db.leaveBalance.update({
    where: {
      userId_leaveTypeId_year: {
        userId,
        leaveTypeId,
        year,
      },
    },
    data: {
      pending: newPending,
      remaining: newRemaining,
    },
  });
}

/**
 * Initializes annual leave balances for a user
 * Should be called when a new user is created or at year start
 */
export async function initializeUserBalances(
  userId: string,
  companyId: string,
  year: number
): Promise<void> {
  // Get all active leave types for the company
  const leaveTypes = await db.leaveType.findMany({
    where: {
      companyId,
      isActive: true,
    },
  });

  // Check for previous year balances for carry-over
  const previousYearBalances = await db.leaveBalance.findMany({
    where: {
      userId,
      year: year - 1,
    },
    include: {
      leaveType: true,
    },
  });

  const carryOverMap = new Map<string, number>();
  previousYearBalances.forEach((balance) => {
    if (balance.leaveType.carryOverAllowed && balance.remaining > 0) {
      const carryOver = Math.min(
        balance.remaining,
        balance.leaveType.carryOverMaxDays
      );
      carryOverMap.set(balance.leaveTypeId, carryOver);
    }
  });

  // Create balances for each leave type
  for (const leaveType of leaveTypes) {
    const carryOver = carryOverMap.get(leaveType.id) || 0;
    const allocated = leaveType.maxDaysPerYear;
    const remaining = allocated + carryOver;

    await db.leaveBalance.upsert({
      where: {
        userId_leaveTypeId_year: {
          userId,
          leaveTypeId: leaveType.id,
          year,
        },
      },
      update: {
        allocated,
        carryOver,
        remaining,
      },
      create: {
        userId,
        leaveTypeId: leaveType.id,
        year,
        allocated,
        carryOver,
        remaining,
        used: 0,
        pending: 0,
      },
    });
  }
}

/**
 * Resets all balances for a company at year-end
 * Should be run as a scheduled job
 */
export async function resetAnnualBalances(
  companyId: string,
  newYear: number
): Promise<void> {
  // Get all users in the company
  const users = await db.user.findMany({
    where: {
      companyId,
      isActive: true,
    },
  });

  // Initialize balances for each user
  for (const user of users) {
    await initializeUserBalances(user.id, companyId, newYear);
  }
}
