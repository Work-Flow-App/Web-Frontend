import axios from 'axios';
import { env } from '../../config/env';
import { apiClient } from './client';

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
  (response) => response,
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

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get the token before refresh attempt
      const oldToken = apiClient.getStoredAccessToken();

      // Try to refresh the token (this uses your existing refresh logic)
      // Note: This is a simplified approach. For production, you might want
      // to implement proper queue handling like your fetch client does
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        // Update the failed request with new token
        const newToken = apiClient.getStoredAccessToken();
        if (newToken && newToken !== oldToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper to refresh access token
 * This mirrors the logic in your ApiClient but is accessible from Axios interceptor
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = apiClient.getStoredRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        apiClient.clearAuthToken();
        apiClient.clearRefreshToken();
        window.location.href = '/login';
      }
      return false;
    }

    const data = await response.json();
    if (data.accessToken) {
      apiClient.setAuthToken(data.accessToken);
      if (data.refreshToken) {
        apiClient.setRefreshToken(data.refreshToken);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

export default axiosInstance;
