import { SubscriptionStatusResponseStatusEnum } from '../../../../workflow-api';
import type { BannerConfig } from './SubscriptionBanner.types';

export const BANNER_CONFIG: Partial<Record<string, BannerConfig>> = {
  [SubscriptionStatusResponseStatusEnum.PastDue]: {
    severity: 'warning',
    message: 'Payment failed — update your payment method to avoid losing access',
    cta: 'Update Payment',
  },
  [SubscriptionStatusResponseStatusEnum.Paused]: {
    severity: 'error',
    message: 'Subscription paused — reactivate to regain full access',
    cta: 'Reactivate',
  },
  [SubscriptionStatusResponseStatusEnum.Cancelled]: {
    severity: 'error',
    message: 'Subscription cancelled — subscribe again to restore access',
    cta: 'Subscribe',
  },
  [SubscriptionStatusResponseStatusEnum.Expired]: {
    severity: 'error',
    message: 'Subscription expired — subscribe to restore access',
    cta: 'Subscribe',
  },
};