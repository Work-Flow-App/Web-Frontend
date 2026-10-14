import axios from 'axios';
import { env } from '../../config/env';
import { apiClient } from './client';
import { queryClient } from '../queryClient';
import { classifySubscriptionError, isOnSubscriptionPage, isPaymentRequiredError } from '../../utils/subscriptionErrors';

/**
 * Configured Axios instance for OpenAPI generated clients
 * This solves connection queueing and timeout issues by:
 * 1. Reusing HTTP connections (keep-alive is default in browsers)
 * 2. Setting proper timeouts to prevent hanging
 * 3. Configuring request/response interceptors for auth
 */
export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 5,
  // Force Axios to use the browser's native fetch/xhr which handles connection pooling
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false,
  },
});

/**
 * Request interceptor - Add auth token to all requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = apiClient.getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No access token available for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401 and 403 errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Any successful write may change data cached by TanStack Query — mark it
    // all stale so mounted queries refetch and others refetch on next mount.
    const method = response.config.method?.toLowerCase();
    const url = response.config.url ?? '';
    const isWrite = !!method && method !== 'get' && method !== 'head' && method !== 'options';
    // Marking notifications read can't change any cached page data
    const affectsCachedData = !url.includes('/api/v1/notifications');
    if (isWrite && affectsCachedData) {
      if (import.meta.env.DEV) {
        console.debug(`[query cache] invalidated by ${method!.toUpperCase()} ${url}`);
      }
      void queryClient.invalidateQueries();
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log 403 errors for debugging
    if (error.response?.status === 403) {
      console.error('403 Forbidden:', {
        url: originalRequest.url,
        method: originalRequest.method,
        hasToken: !!originalRequest.headers.Authorization,
      });
    }

    // Handle 402 Payment Required — redirect only on a lapsed subscription;
    // cap-reached / unclassified errors fall through to the caller's own
    // error handling (inline upsell messaging).
    if (isPaymentRequiredError(error) && typeof window !== 'undefined') {
      if (classifySubscriptionError(error) === 'lapsed' && !isOnSubscriptionPage()) {
        window.location.href = '/subscribe';
      }
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // Another request may already have refreshed while this one was in
      // flight — then just retry with the current token.
      const sentAuth = originalRequest.headers.Authorization;
      const currentToken = apiClient.getStoredAccessToken();
      const alreadyRefreshed = !!currentToken && sentAuth !== `Bearer ${currentToken}`;

      // Shares apiClient's single in-flight refresh, so a burst of 401s (e.g.
      // every query refetching on window focus) sends only one refresh request
      const refreshed = alreadyRefreshed || (await apiClient.refreshAccessToken());

      const newToken = apiClient.getStoredAccessToken();
      if (refreshed && newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
