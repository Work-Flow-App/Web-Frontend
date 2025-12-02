import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenManager, createAxiosInstance } from './config';
import { transformAxiosError } from './errors';

/**
 * Public endpoints that don't require authorization
 */
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/signup', '/auth/refresh'];

/**
 * Check if endpoint is public
 */
function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

/**
 * Request/Response interceptor state for 401 handling
 */
class InterceptorState {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  /**
   * Add request to queue during token refresh
   */
  addToQueue(
    resolve: (value: any) => void,
    reject: (reason?: any) => void
  ): void {
    this.failedQueue.push({ resolve, reject });
  }

  /**
   * Process all queued requests after refresh
   */
  processQueue(error?: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(null);
      }
    });
    this.failedQueue = [];
  }

  /**
   * Check if currently refreshing
   */
  getIsRefreshing(): boolean {
    return this.isRefreshing;
  }

  /**
   * Set refresh state
   */
  setIsRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }
}

const interceptorState = new InterceptorState();

/**
 * Setup axios interceptors for API requests
 */
export function setupInterceptors(axiosInstance: AxiosInstance): void {
  /**
   * Request interceptor - Add authorization header
   */
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!isPublicEndpoint(config.url || '')) {
        const accessToken = tokenManager.getAccessToken();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  /**
   * Response interceptor - Handle 401 errors and refresh token
   */
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config, response } = error;

      // Only handle 401 for protected endpoints
      if (response?.status === 401 && !isPublicEndpoint(config?.url || '')) {
        if (!interceptorState.getIsRefreshing()) {
          interceptorState.setIsRefreshing(true);

          try {
            const refreshToken = tokenManager.getRefreshToken();
            if (!refreshToken) {
              tokenManager.clearTokens();
              window.location.href = '/login';
              return Promise.reject(error);
            }

            // Refresh token
            const refreshed = await tokenManager.requestRefresh(refreshToken);

            if (refreshed) {
              // Token refreshed successfully
              interceptorState.setIsRefreshing(false);
              interceptorState.processQueue();

              // Retry original request with new token
              const newAccessToken = tokenManager.getAccessToken();
              config.headers.Authorization = `Bearer ${newAccessToken}`;
              return axiosInstance(config);
            } else {
              // Refresh failed
              tokenManager.clearTokens();
              window.location.href = '/login';
              interceptorState.setIsRefreshing(false);
              interceptorState.processQueue(error);
              return Promise.reject(error);
            }
          } catch (err) {
            interceptorState.setIsRefreshing(false);
            interceptorState.processQueue(err);
            tokenManager.clearTokens();
            window.location.href = '/login';
            return Promise.reject(err);
          }
        } else {
          // Token refresh in progress, queue this request
          return new Promise((resolve, reject) => {
            interceptorState.addToQueue(
              () => {
                config.headers.Authorization = `Bearer ${tokenManager.getAccessToken()}`;
                resolve(axiosInstance(config));
              },
              (err) => reject(err)
            );
          });
        }
      }

      return Promise.reject(error);
    }
  );
}
