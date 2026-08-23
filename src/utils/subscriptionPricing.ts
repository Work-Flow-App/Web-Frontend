/**
 * Pure pricing math for the subscription plans. Kept free of React/MUI so it can be
 * unit tested directly and reused between SubscribePage and any future summary UI.
 */

/**
 * How many extra (paid) seats a headcount requires beyond a plan's included base seats.
 * Clamped to 0 - never negative, never NaN.
 */
export function computeExtraSeatsFromHeadcount(headcount: number, baseSeats: number): number {
  if (!Number.isFinite(headcount)) return 0;
  return Math.max(0, headcount - baseSeats);
}

export interface PlanMonthlyTotalParams {
  basePrice: number;
  extraSeats: number;
  extraSeatPrice: number;
  storageBlocks: number;
  extraStorageBlockPrice: number;
}

/** Total monthly price for a plan given its extra-seat and extra-storage-block add-ons. */
export function computePlanMonthlyTotal({
  basePrice,
  extraSeats,
  extraSeatPrice,
  storageBlocks,
  extraStorageBlockPrice,
}: PlanMonthlyTotalParams): number {
  return basePrice + extraSeats * extraSeatPrice + storageBlocks * extraStorageBlockPrice;
}

export interface TotalStorageParams {
  baseStorageGB: number;
  storageBlocks: number;
  extraStorageBlockGB: number;
}

/** Total storage (GB) for a plan given its extra storage-block add-ons. */
export function computeTotalStorageGB({ baseStorageGB, storageBlocks, extraStorageBlockGB }: TotalStorageParams): number {
  return baseStorageGB + storageBlocks * extraStorageBlockGB;
}

/**
 * Numeric metadata for each paid plan tier. Single source of truth so pricing pages
 * (SubscribePage) and usage/add-on pages (BillingSettings) never drift apart.
 *
 * `jobsLimit` doubles as the only way to identify which tier a company is currently
 * on: the subscription-status API doesn't expose a plan-type field, but each tier has
 * a distinct jobs limit, so it can be used as a reliable fingerprint.
 */
export type PaidPlanTierKey = 'STARTER' | 'PROFESSIONAL';

export interface PlanTier {
  key: PaidPlanTierKey;
  basePrice: number;
  jobsLimit: number;
  baseSeats: number;
  extraSeatPrice: number;
  baseStorageGB: number;
  extraStorageBlockGB: number;
  extraStorageBlockPrice: number;
}

export const PLAN_TIERS: Record<PaidPlanTierKey, PlanTier> = {
  STARTER: {
    key: 'STARTER',
    basePrice: 39,
    jobsLimit: 70,
    baseSeats: 3,
    extraSeatPrice: 10,
    baseStorageGB: 10,
    extraStorageBlockGB: 3,
    extraStorageBlockPrice: 10,
  },
  PROFESSIONAL: {
    key: 'PROFESSIONAL',
    basePrice: 79,
    jobsLimit: 200,
    baseSeats: 8,
    extraSeatPrice: 8,
    baseStorageGB: 30,
    extraStorageBlockGB: 5,
    extraStorageBlockPrice: 10,
  },
};

/** Identify which paid tier a company is on from its jobs limit. Null if it doesn't match any known tier (e.g. still on trial). */
export function inferPlanTierFromJobsLimit(jobsLimit?: number): PlanTier | null {
  if (!jobsLimit) return null;
  return Object.values(PLAN_TIERS).find((tier) => tier.jobsLimit === jobsLimit) ?? null;
}

/** How many extra storage blocks a company has already purchased, derived from its total storage limit. */
export function computeCurrentStorageBlocks(tier: PlanTier, storageLimitBytes?: number): number {
  if (!storageLimitBytes) return 0;
  const totalGB = storageLimitBytes / 1_000_000_000;
  const extraGB = Math.max(0, totalGB - tier.baseStorageGB);
  return Math.round(extraGB / tier.extraStorageBlockGB);
}

/** How many extra seats a company has already purchased, derived from its seats limit. */
export function computeCurrentExtraSeats(tier: PlanTier, seatsLimit?: number): number {
  if (!seatsLimit) return 0;
  return Math.max(0, seatsLimit - tier.baseSeats);
}
