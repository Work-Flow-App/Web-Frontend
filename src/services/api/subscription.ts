import { SubscriptionApi, Configuration } from '../../../workflow-api';
import type { SubscriptionStatusResponse, CreateCheckoutSessionRequest } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { SubscriptionStatusResponse, CreateCheckoutSessionRequest };

function getSubscriptionApi(): SubscriptionApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new SubscriptionApi(config, env.apiBaseUrl, axiosInstance);
}

export const subscriptionService = {
  async getStatus() {
    return await getSubscriptionApi().subscriptionGetStatus();
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
};

export default subscriptionService;
