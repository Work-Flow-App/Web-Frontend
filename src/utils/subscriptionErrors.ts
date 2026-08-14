/**
 * Classifies 402 Payment Required errors from the subscription/usage APIs.
 * Backend returns the same JSON shape for lapsed-subscription and cap-reached
 * errors — the only way to tell them apart today is by matching `message`.
 */

export type SubscriptionErrorKind = 'lapsed' | 'cap' | 'unknown';

interface Http402Like {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

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

export const classifySubscriptionError = (error: unknown): SubscriptionErrorKind => {
  const message = ((error as Http402Like)?.response?.data?.message ?? '').toLowerCase();
  if (!message) return 'unknown';
  if (CAP_KEYWORDS.some((keyword) => message.includes(keyword))) return 'cap';
  if (LAPSED_KEYWORDS.some((keyword) => message.includes(keyword))) return 'lapsed';
  return 'unknown';
};

export const isOnSubscriptionPage = (pathname: string = window.location.pathname): boolean => {
  return ['/subscribe', '/subscription/'].some((path) => pathname.startsWith(path));
};
