import { env } from '../../config/env';
import { decodeJWT } from '../../utils/jwt';

/**
 * API Client for making HTTP requests to the backend
 */

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private timeout: number;
  private isRefreshing: boolean = false;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private sessionRestored: boolean = false;
  private sessionRestorePromise: Promise<void> | null = null;
  private failedRequestsQueue: Array<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (value: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request: () => Promise<any>;
  }> = [];

  // Token storage keys for sessionStorage
  private readonly ACCESS_TOKEN_KEY = 'app_access_token';
  private readonly REFRESH_TOKEN_KEY = 'app_refresh_token';

  // Refresh token 1 minute before expiration (in milliseconds)
  private readonly TOKEN_REFRESH_BUFFER = 60 * 1000;

  /**
   * Public authentication endpoints that don't require authorization
   * Add new public auth endpoints here to ensure they work properly
   */
  private readonly PUBLIC_AUTH_ENDPOINTS = [
    '/auth/login',
    '/auth/signup',
    '/auth/signup/worker',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/workers/invites/check',
  ];

  constructor() {
    this.timeout = env.apiTimeout;
    // Try to restore session on initialization
    this.sessionRestorePromise = this.restoreSession();
  }

  /**
   * Wait for session restoration to complete
   * Use this in your app initialization to ensure tokens are ready
   */
  async waitForSessionRestore(): Promise<boolean> {
    if (this.sessionRestored) {
      return !!this.getAuthToken();
    }
    if (this.sessionRestorePromise) {
      await this.sessionRestorePromise;
    }
    return !!this.getAuthToken();
  }

  /**
   * Check if session restoration has completed
   */
  isSessionRestored(): boolean {
    return this.sessionRestored;
  }

  /**
   * Attempt to restore session using refresh token
   * Called on application initialization
   */
  private async restoreSession(): Promise<void> {
    try {
      if (this.getAuthToken()) {
        console.log('Access token found in session');
        this.scheduleTokenRefresh();
        this.sessionRestored = true;
        return;
      }

      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        try {
          console.log('Restoring session with refresh token');
          const success = await this.refreshAccessToken();
          if (success) {
            console.log('Session restored successfully');
            this.scheduleTokenRefresh();
          } else {
            console.warn('Token refresh returned false - will retry on next request');
            // Don't clear tokens here - let the user retry on next API call
          }
        } catch (error) {
          console.error('Failed to restore session (network error?):', error);
          // Keep tokens - this might be a temporary network issue
          // The next API call will trigger another refresh attempt
        }
      } else {
        console.log('No tokens found - user needs to log in');
      }
    } finally {
      this.sessionRestored = true;
      this.sessionRestorePromise = null;
    }
  }

  /**
   * Schedule proactive token refresh before expiration
   */
  private scheduleTokenRefresh(): void {
    this.cancelTokenRefresh();

    const token = this.getAuthToken();
    if (!token) {
      return;
    }

    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      const delay = 13 * 60 * 1000;
      this.tokenRefreshTimer = setTimeout(() => this.refreshAccessToken(), delay);
      return;
    }

    const expirationTime = payload.exp * 1000;
    const now = Date.now();
    const delay = expirationTime - now - this.TOKEN_REFRESH_BUFFER;

    if (delay <= 0) {
      this.refreshAccessToken();
    } else {
      this.tokenRefreshTimer = setTimeout(() => this.refreshAccessToken(), delay);
    }
  }

  /**
   * Cancel the scheduled token refresh
   */
  private cancelTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  /**
   * Get the base URL dynamically from env configuration
   * This allows switching between environments via AppConfiguration
   */
  private get baseUrl(): string {
    return env.apiBaseUrl;
  }

  /**
   * Get authorization token from sessionStorage
   */
  private getAuthToken(): string | null {
    try {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Get refresh token from sessionStorage
   */
  private getRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Check if endpoint is a public auth endpoint
   */
  private isPublicAuthEndpoint(endpoint?: string): boolean {
    if (!endpoint) return false;
    return this.PUBLIC_AUTH_ENDPOINTS.some(publicEndpoint =>
      endpoint.includes(publicEndpoint)
    );
  }

  /**
   * Get default headers for requests
   */
  private getHeaders(customHeaders?: HeadersInit, endpoint?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders as Record<string, string>),
    };

    // Don't send Authorization header for public auth endpoints
    const token = this.getAuthToken();
    if (token && !this.isPublicAuthEndpoint(endpoint)) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Refresh the access token using the refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    // Prevent concurrent refresh attempts
    if (this.isRefreshing) {
      console.log('Token refresh already in progress');
      return false;
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
        mode: 'cors',
      });

      // Handle authentication errors (invalid/expired refresh token)
      if (!response.ok) {
        // Only clear tokens on actual auth failures, not server errors
        if (response.status === 401 || response.status === 403) {
          console.error('Refresh token is invalid or expired - clearing session');
          this.clearAuthToken();
          this.clearRefreshToken();

          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        } else {
          console.warn(`Token refresh failed with status ${response.status} - will retry later`);
        }
        return false;
      }

      const data = await response.json();

      if (data.accessToken) {
        this.setAuthToken(data.accessToken);
        if (data.refreshToken) {
          this.setRefreshToken(data.refreshToken);
        }
        console.log('Token refreshed successfully');
        return true;
      }

      console.warn('Token refresh response missing accessToken');
      return false;
    } catch (error) {
      // Network error - keep tokens and let user retry
      console.error('Token refresh failed (network error):', error);
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Process queued requests after token refresh
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private processQueue(error: any = null): void {
    this.failedRequestsQueue.forEach(({ resolve, reject, request }) => {
      if (error) {
        reject(error);
      } else {
        resolve(request());
      }
    });

    this.failedRequestsQueue = [];
  }

  /**
   * Handle API response with automatic token refresh on 401
   */
  private async handleResponse<T>(
    response: Response,
    retryRequest: () => Promise<ApiResponse<T>>,
    endpoint: string
  ): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      };

      if (isJson) {
        const errorData = await response.json();
        error.message = errorData.message || error.message;
        error.errors = errorData.errors;
      } else {
        error.message = response.statusText;
      }

      // Handle 401 Unauthorized - attempt token refresh
      // BUT skip token refresh for auth endpoints (login, signup, refresh)
      if (response.status === 401 && !this.isPublicAuthEndpoint(endpoint)) {
        return this.handle401Error(error, retryRequest);
      }

      throw error;
    }

    const data = isJson ? await response.json() : null;

    return {
      data: data as T,
      status: response.status,
      message: data?.message,
    };
  }

  /**
   * Handle 401 error by refreshing token and retrying request
   */
  private async handle401Error<T>(
    error: ApiError,
    retryRequest: () => Promise<ApiResponse<T>>
  ): Promise<ApiResponse<T>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      try {
        const refreshed = await this.refreshAccessToken();

        if (refreshed) {
          // Token refreshed successfully, retry all queued requests
          this.processQueue();
          return retryRequest();
        } else {
          // Refresh failed - refreshAccessToken() already handled token clearing
          // if it was an auth error (401/403). For network errors, tokens are kept.
          this.processQueue(error);
          throw error;
        }
      } finally {
        this.isRefreshing = false;
      }
    }

    // If already refreshing, queue this request
    return new Promise((resolve, reject) => {
      this.failedRequestsQueue.push({
        resolve,
        reject,
        request: retryRequest,
      });
    });
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'GET',
          headers: this.getHeaders(options?.headers, endpoint),
          signal: controller.signal,
          credentials: 'include',
          mode: 'cors',
          ...options,
        });

        return await this.handleResponse<T>(response, makeRequest, endpoint);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return makeRequest();
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: this.getHeaders(options?.headers, endpoint),
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
          credentials: 'include',
          mode: 'cors',
          ...options,
        });

        return await this.handleResponse<T>(response, makeRequest, endpoint);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return makeRequest();
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PUT',
          headers: this.getHeaders(options?.headers, endpoint),
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
          credentials: 'include',
          mode: 'cors',
          ...options,
        });

        return await this.handleResponse<T>(response, makeRequest, endpoint);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return makeRequest();
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'PATCH',
          headers: this.getHeaders(options?.headers, endpoint),
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
          credentials: 'include',
          mode: 'cors',
          ...options,
        });

        return await this.handleResponse<T>(response, makeRequest, endpoint);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return makeRequest();
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'DELETE',
          headers: this.getHeaders(options?.headers, endpoint),
          signal: controller.signal,
          credentials: 'include',
          mode: 'cors',
          ...options,
        });

        return await this.handleResponse<T>(response, makeRequest, endpoint);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return makeRequest();
  }

  /**
   * Set authentication token in sessionStorage
   */
  setAuthToken(token: string): void {
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      // Schedule proactive refresh when new token is set
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  /**
   * Set refresh token in sessionStorage
   */
  setRefreshToken(token: string): void {
    try {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Clear authentication token from sessionStorage
   */
  clearAuthToken(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      // Cancel any scheduled token refresh on logout
      this.cancelTokenRefresh();
    } catch (error) {
      console.error('Failed to clear access token:', error);
    }
  }

  /**
   * Clear refresh token from sessionStorage
   */
  clearRefreshToken(): void {
    try {
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
  }

  /**
   * Get stored access token (public method for auth service)
   */
  getStoredAccessToken(): string | null {
    return this.getAuthToken();
  }

  /**
   * Get stored refresh token (public method for auth service)
   */
  getStoredRefreshToken(): string | null {
    return this.getRefreshToken();
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
