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
