/**
 * Annual Leave Balance Reset Script
 *
 * This script should be run at the beginning of each year to:
 * 1. Calculate carry-over from previous year
 * 2. Reset all balances
 * 3. Initialize new year balances
 *
 * Usage:
 *   npx tsx scripts/annual-balance-reset.ts [year]
 *
 * Example:
 *   npx tsx scripts/annual-balance-reset.ts 2025
 */

import { db } from '../lib/db';
import { resetAnnualBalances } from '../lib/leave-balance';

async function main() {
  const year = process.argv[2] ? parseInt(process.argv[2]) : new Date().getFullYear();

  console.log(`🔄 Starting annual balance reset for year ${year}...`);

  try {
    // Get all active companies
    const companies = await db.company.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`📊 Found ${companies.length} companies`);

    for (const company of companies) {
      console.log(`\n Processing: ${company.name}`);

      try {
        await resetAnnualBalances(company.id, year);
        console.log(`  ✅ Successfully reset balances for ${company.name}`);
      } catch (error) {
        console.error(`  ❌ Error resetting balances for ${company.name}:`, error);
      }
    }

    console.log(`\n✨ Annual balance reset completed for year ${year}`);
  } catch (error) {
    console.error('❌ Fatal error during balance reset:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
