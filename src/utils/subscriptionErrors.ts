/**
 * Classifies 402 Payment Required errors from the subscription/usage APIs.
 * The backend sends a machine-readable `code`; older backends sent none, so
 * fall back to matching the message.
 */

/**
 * - lapsed: the subscription itself is inactive, so the app sends the user to subscribe.
 * - upgrade: a Pro-only feature on a lower plan. The subscription is fine.
 * - cap: a plan limit (jobs, seats, storage, documents) is reached. The subscription is fine.
 */
export type SubscriptionErrorKind = 'lapsed' | 'upgrade' | 'cap' | 'unknown';

interface Http402Like {
  response?: {
    status?: number;
    data?: {
      message?: string;
      code?: string;
    };
  };
}

const KIND_BY_CODE: Record<string, SubscriptionErrorKind> = {
  SUBSCRIPTION_REQUIRED: 'lapsed',
  PLAN_UPGRADE_REQUIRED: 'upgrade',
  JOB_LIMIT_EXCEEDED: 'cap',
  SEAT_LIMIT_EXCEEDED: 'cap',
  STORAGE_LIMIT_EXCEEDED: 'cap',
  DOCUMENT_LIMIT_EXCEEDED: 'cap',
};

const LAPSED_KEYWORDS = [
  'trial expired',
  'payment past due',
  'subscription cancelled',
  'subscription paused',
  'resubscribe',
];

const CAP_KEYWORDS = ['limit reached', 'seat', 'storage'];

export const isPaymentRequiredError = (error: unknown): boolean => {
  return (error as Http402Like)?.response?.status === 402;
};

export const getErrorCode = (error: unknown): string | undefined => {
  const code = (error as Http402Like)?.response?.data?.code;
  return typeof code === 'string' ? code : undefined;
};

export const classifySubscriptionError = (error: unknown): SubscriptionErrorKind => {
  const code = getErrorCode(error);
  if (code && KIND_BY_CODE[code]) return KIND_BY_CODE[code];

  const message = ((error as Http402Like)?.response?.data?.message ?? '').toLowerCase();
  if (!message) return 'unknown';
  if (CAP_KEYWORDS.some((keyword) => message.includes(keyword))) return 'cap';
  if (LAPSED_KEYWORDS.some((keyword) => message.includes(keyword))) return 'lapsed';
  return 'unknown';
};

export const isOnSubscriptionPage = (pathname: string = window.location.pathname): boolean => {
  return ['/subscribe', '/subscription/'].some((path) => pathname.startsWith(path));
};

export const UPGRADE_PROMPT_EVENT = 'workfloow:upgrade-prompt';

export interface UpgradePromptDetail {
  kind: 'upgrade' | 'cap';
  /** The backend's explanation, e.g. which limit was reached. */
  message?: string;
}

/**
 * What the app does with any 402. A lapsed subscription goes to the subscribe page;
 * a Pro-only feature or a reached limit opens the upgrade prompt and leaves the
 * subscription and every other action alone. The caller still gets the error.
 */
export const handlePaymentRequired = (error: unknown): void => {
  if (typeof window === 'undefined') return;

  const kind = classifySubscriptionError(error);
  if (kind === 'lapsed') {
    if (!isOnSubscriptionPage()) window.location.href = '/subscribe';
    return;
  }
  if (kind === 'upgrade' || kind === 'cap') {
    const detail: UpgradePromptDetail = { kind, message: (error as Http402Like)?.response?.data?.message };
    window.dispatchEvent(new CustomEvent<UpgradePromptDetail>(UPGRADE_PROMPT_EVENT, { detail }));
  }
};
