import { describe, it, expect } from 'vitest';
import { computeExtraSeatsFromHeadcount, computePlanMonthlyTotal, computeTotalStorageGB } from './subscriptionPricing';

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
