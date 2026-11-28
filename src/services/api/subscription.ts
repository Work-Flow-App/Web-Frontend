import { SubscriptionApi, Configuration } from '../../../workflow-api';
import type {
  SubscriptionStatusResponse as GeneratedSubscriptionStatusResponse,
  CreateCheckoutSessionRequest,
  UpdateSubscriptionAddonsRequest,
  SubscriptionAddonsResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type PaidPlanType = 'STARTER' | 'PROFESSIONAL';

/**
 * Backend#363 adds these to the status response. They're absent until that release,
 * so callers treat a missing value as "unknown". Drop this once the API client is
 * regenerated from a backend that has them.
 */
export interface SubscriptionStatusResponse extends GeneratedSubscriptionStatusResponse {
  planType?: 'FREE' | PaidPlanType;
  /** True: change plan with `changePlan`. False: start a checkout. */
  hasPaddleSubscription?: boolean;
  extraUserSeats?: number;
  extraStorageBlocks?: number;
}

export type { CreateCheckoutSessionRequest, UpdateSubscriptionAddonsRequest, SubscriptionAddonsResponse };

function getSubscriptionApi(): SubscriptionApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new SubscriptionApi(config, env.apiBaseUrl, axiosInstance);
}

export const subscriptionService = {
  async getStatus() {
    return (await getSubscriptionApi().subscriptionGetStatus()) as { data: SubscriptionStatusResponse };
  },

  /**
   * Moves an existing subscription to another plan, keeping its add-ons. Paddle bills or
   * credits the prorated difference straight away. Only for `hasPaddleSubscription`;
   * everyone else goes through checkout.
   */
  async changePlan(planType: PaidPlanType) {
    return await axiosInstance.patch<SubscriptionAddonsResponse>('/api/v1/companies/subscription/plan', { planType });
  },

  async createCheckout(request: CreateCheckoutSessionRequest) {
    return await getSubscriptionApi().subscriptionCreateCheckoutSession(request);
  },

  async getPortalUrl() {
    return await getSubscriptionApi().subscriptionGetPortalUrl();
  },

  async cancelSubscription() {
    return await getSubscriptionApi().subscriptionCancelSubscription();
  },

  async updateAddons(request: UpdateSubscriptionAddonsRequest) {
    return await getSubscriptionApi().subscriptionUpdateAddons(request);
  },
};

export default subscriptionService;
