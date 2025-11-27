// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { calculateBusinessDays } from '@/lib/utils';

describe('calculateBusinessDays', () => {
  it('compte les jours ouvrés par défaut sur une période classique', () => {
    const start = new Date('2025-01-06'); // Lundi
    const end = new Date('2025-01-10'); // Vendredi

    expect(calculateBusinessDays(start, end)).toBe(5);
  });

  it('applique correctement les demi-journées', () => {
    const start = new Date('2025-01-06');
    const end = new Date('2025-01-06');

    expect(
      calculateBusinessDays(start, end, {
        halfDayStart: true,
        halfDayEnd: true,
      })
    ).toBe(0);

    expect(
      calculateBusinessDays(start, end, {
        halfDayStart: true,
      })
    ).toBe(0.5);
  });

  it('respecte les jours ouvrés configurés', () => {
    const start = new Date('2025-01-06'); // Lundi
    const end = new Date('2025-01-10'); // Vendredi

    expect(
      calculateBusinessDays(start, end, {
        workingDays: [1, 2, 3, 4],
      })
    ).toBe(4);
  });

  it('retourne 0 si la date de fin est avant la date de début', () => {
    const start = new Date('2025-01-10');
    const end = new Date('2025-01-06');

    expect(calculateBusinessDays(start, end)).toBe(0);
  });

  it('utilise les jours par défaut quand aucune configuration n’est fournie', () => {
    const start = new Date('2025-01-06');
    const end = new Date('2025-01-07');

    expect(
      calculateBusinessDays(start, end, {
        workingDays: undefined,
      })
    ).toBe(2);
  });
});
