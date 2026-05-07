import { SubscriptionApi, Configuration } from '../../../workflow-api';
import type { SubscriptionStatusResponse } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { SubscriptionStatusResponse };

function getSubscriptionApi(): SubscriptionApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new SubscriptionApi(config, env.apiBaseUrl, axiosInstance);
}

export const subscriptionService = {
  async getStatus() {
    return await getSubscriptionApi().subscriptionGetStatus();
  },

  async createCheckout() {
    return await getSubscriptionApi().subscriptionCreateCheckoutSession();
  },

  async getPortalUrl() {
    return await getSubscriptionApi().subscriptionGetPortalUrl();
  },

  async cancelSubscription() {
    return await getSubscriptionApi().subscriptionCancelSubscription();
  },
};

export default subscriptionService;
