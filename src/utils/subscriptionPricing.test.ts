import { describe, it, expect } from 'vitest';
import {
  computeExtraSeatsFromHeadcount,
  computePlanMonthlyTotal,
  computeTotalStorageGB,
  PLAN_TIERS,
  inferPlanTierFromJobsLimit,
  computeCurrentStorageBlocks,
  computeCurrentExtraSeats,
} from './subscriptionPricing';

describe('computeExtraSeatsFromHeadcount', () => {
  it('returns 0 when headcount is within the base seats', () => {
    expect(computeExtraSeatsFromHeadcount(2, 3)).toBe(0);
  });

  it('returns 0 when headcount exactly matches the base seats', () => {
    expect(computeExtraSeatsFromHeadcount(3, 3)).toBe(0);
  });

  it('returns the difference when headcount exceeds the base seats', () => {
    expect(computeExtraSeatsFromHeadcount(5, 3)).toBe(2);
  });

  it('clamps negative or non-finite headcount to 0 extra seats', () => {
    expect(computeExtraSeatsFromHeadcount(-4, 3)).toBe(0);
    expect(computeExtraSeatsFromHeadcount(NaN, 3)).toBe(0);
  });
});

describe('computePlanMonthlyTotal', () => {
  it('returns the base price when there are no add-ons', () => {
    const total = computePlanMonthlyTotal({
      basePrice: 39,
      extraSeats: 0,
      extraSeatPrice: 10,
      storageBlocks: 0,
      extraStorageBlockPrice: 10,
    });
    expect(total).toBe(39);
  });

  it('adds extra seat cost on top of the base price', () => {
    const total = computePlanMonthlyTotal({
      basePrice: 39,
      extraSeats: 2,
      extraSeatPrice: 10,
      storageBlocks: 0,
      extraStorageBlockPrice: 10,
    });
    expect(total).toBe(59);
  });

  it('adds extra storage block cost on top of the base price', () => {
    const total = computePlanMonthlyTotal({
      basePrice: 39,
      extraSeats: 0,
      extraSeatPrice: 10,
      storageBlocks: 3,
      extraStorageBlockPrice: 10,
    });
    expect(total).toBe(69);
  });

  it('combines extra seat and extra storage costs', () => {
    const total = computePlanMonthlyTotal({
      basePrice: 79,
      extraSeats: 2,
      extraSeatPrice: 8,
      storageBlocks: 1,
      extraStorageBlockPrice: 10,
    });
    expect(total).toBe(105);
  });
});

describe('computeTotalStorageGB', () => {
  it('returns the base storage when there are no extra blocks', () => {
    const total = computeTotalStorageGB({ baseStorageGB: 10, storageBlocks: 0, extraStorageBlockGB: 3 });
    expect(total).toBe(10);
  });

  it('adds extra block storage on top of the base', () => {
    const total = computeTotalStorageGB({ baseStorageGB: 10, storageBlocks: 2, extraStorageBlockGB: 3 });
    expect(total).toBe(16);
  });
});

describe('inferPlanTierFromJobsLimit', () => {
  it('identifies Starter from its jobs limit', () => {
    expect(inferPlanTierFromJobsLimit(70)).toBe(PLAN_TIERS.STARTER);
  });

  it('identifies Professional from its jobs limit', () => {
    expect(inferPlanTierFromJobsLimit(200)).toBe(PLAN_TIERS.PROFESSIONAL);
  });

  it('returns null for a jobs limit that matches no known tier (e.g. Free Trial)', () => {
    expect(inferPlanTierFromJobsLimit(10)).toBeNull();
  });

  it('returns null when jobs limit is missing', () => {
    expect(inferPlanTierFromJobsLimit(undefined)).toBeNull();
  });
});

describe('computeCurrentStorageBlocks', () => {
  it('returns 0 when storage limit is missing', () => {
    expect(computeCurrentStorageBlocks(PLAN_TIERS.STARTER, undefined)).toBe(0);
  });

  it('returns 0 when the company is still on the base allotment', () => {
    expect(computeCurrentStorageBlocks(PLAN_TIERS.STARTER, 10_000_000_000)).toBe(0);
  });

  it('derives purchased blocks from a limit above the base allotment', () => {
    // Starter: 10GB base + 2 blocks * 3GB = 16GB
    expect(computeCurrentStorageBlocks(PLAN_TIERS.STARTER, 16_000_000_000)).toBe(2);
  });
});

describe('computeCurrentExtraSeats', () => {
  it('returns 0 when seats limit is missing', () => {
    expect(computeCurrentExtraSeats(PLAN_TIERS.PROFESSIONAL, undefined)).toBe(0);
  });

  it('returns 0 when the company is still on the base seat count', () => {
    expect(computeCurrentExtraSeats(PLAN_TIERS.PROFESSIONAL, 8)).toBe(0);
  });

  it('derives purchased extra seats from a limit above the base allotment', () => {
    expect(computeCurrentExtraSeats(PLAN_TIERS.PROFESSIONAL, 10)).toBe(2);
  });
});
