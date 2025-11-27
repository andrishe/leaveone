import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BusinessDayOptions = {
  workingDays?: number[];
  halfDayStart?: boolean;
  halfDayEnd?: boolean;
};

export const DEFAULT_WORKING_DAYS: number[] = [1, 2, 3, 4, 5];

export function calculateBusinessDays(
  startDate: Date,
  endDate: Date,
  options: BusinessDayOptions = {}
): number {
  const {
    workingDays = DEFAULT_WORKING_DAYS,
    halfDayStart,
    halfDayEnd,
  } = options;

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('Invalid date provided to calculateBusinessDays');
  }

  if (startDate > endDate) {
    return 0;
  }

  const workingDaysSet = new Set(workingDays);

  const cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(endDate);
  last.setHours(0, 0, 0, 0);

  let businessDays = 0;

  while (cursor <= last) {
    if (workingDaysSet.has(cursor.getDay())) {
      businessDays += 1;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (businessDays === 0) {
    return 0;
  }

  if (halfDayStart && workingDaysSet.has(startDate.getDay())) {
    businessDays -= 0.5;
  }

  if (halfDayEnd && workingDaysSet.has(endDate.getDay())) {
    businessDays -= 0.5;
  }

  return Math.max(businessDays, 0);
}
