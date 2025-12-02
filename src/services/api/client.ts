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
  private emptyResponseRetryCount: number = 0;
  private readonly MAX_EMPTY_RESPONSE_RETRIES = 1;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private readonly TOKEN_REFRESH_BUFFER = 60 * 1000; // Refresh 1 minute before expiry
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

  /**
   * Public authentication endpoints that don't require authorization
   * Add new public auth endpoints here to ensure they work properly
   */
  private readonly PUBLIC_AUTH_ENDPOINTS = [
    '/auth/login',
    '/auth/signup',
    '/auth/refresh',
  ];

  constructor() {
    this.timeout = env.apiTimeout;
    // Try to restore session on initialization
    this.restoreSession();
  }

  /**
   * Attempt to restore session using refresh token
   * Called on application initialization
   */
  private async restoreSession(): Promise<void> {
    // If we already have an access token, no need to refresh
    if (this.getAuthToken()) {
      console.log('✅ Access token found in session');
      return;
    }

    // If we have a refresh token, try to get a new access token
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        console.log('🔄 Restoring session with refresh token...');
        await this.refreshAccessToken();
        console.log('✅ Session restored successfully');
      } catch (error) {
        console.error('❌ Failed to restore session:', error);
        // Clear invalid tokens
        this.clearAuthToken();
        this.clearRefreshToken();
      }
    } else {
      console.log('ℹ️ No tokens found - user needs to log in');
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
   * Check if access token is expired or will expire soon
   */
  private isAccessTokenExpiringSoon(): boolean {
    const token = this.getAuthToken();
    if (!token) return true;

    try {
      const payload = decodeJWT(token);
      if (!payload || !payload.exp) return true;

      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Return true if token expires within the buffer time (1 minute)
      return timeUntilExpiry <= this.TOKEN_REFRESH_BUFFER;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Schedule automatic token refresh before expiration
   */
  private scheduleTokenRefresh(): void {
    // Clear any existing timer
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }

    const token = this.getAuthToken();
    if (!token) return;

    try {
      const payload = decodeJWT(token);
      if (!payload || !payload.exp) return;

      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const refreshTime = expirationTime - this.TOKEN_REFRESH_BUFFER;
      const timeUntilRefresh = refreshTime - currentTime;

      // Only schedule if refresh time is in the future
      if (timeUntilRefresh > 0) {
        console.log(`🕐 Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000)}s`);
        this.tokenRefreshTimer = setTimeout(async () => {
          console.log('⏰ Scheduled token refresh triggered');
          await this.refreshAccessToken();
        }, timeUntilRefresh);
      } else {
        // Token already expired or expiring soon, refresh immediately
        console.log('⚠️ Token expired or expiring soon, refreshing immediately');
        this.refreshAccessToken().catch(error => {
          console.error('Failed to refresh expired token:', error);
        });
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  }

  /**
   * Ensure token is valid before making request
   */
  private async ensureValidToken(): Promise<void> {
    // Skip for public endpoints
    if (!this.getAuthToken()) return;

    // Check if token is expiring soon
    if (this.isAccessTokenExpiringSoon()) {
      console.log('🔄 Token expiring soon, refreshing before request...');
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        console.error('Failed to refresh token before request');
        throw {
          message: 'Session expired. Please log in again.',
          status: 401,
        } as ApiError;
      }
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

    // Prevent refresh attempts if already refreshing
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

      if (!response.ok) {
        console.warn(`Token refresh failed with status ${response.status}`);
        return false;
      }

      const contentLength = response.headers.get('content-length');
      if (contentLength === '0') {
        console.error('Token refresh returned empty response - possible backend issue');
        return false;
      }

      const data = await response.json();

      if (data.accessToken) {
        this.setAuthToken(data.accessToken);
        if (data.refreshToken) {
          this.setRefreshToken(data.refreshToken);
        }

        // Schedule next refresh after setting new token
        this.scheduleTokenRefresh();

        return true;
      }

      console.warn('Token refresh response missing accessToken');
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
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
    const contentLength = response.headers.get('content-length');
    const isJson = contentType?.includes('application/json');
    // Check if response body is empty (Content-Length: 0 or very small body)
    const isEmpty = contentLength === '0';

    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred',
        status: response.status,
      };

      if (isJson && !isEmpty) {
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

    // Handle empty response body (Content-Length: 0)
    // This can happen when the session expires but server returns 200
    if (isEmpty) {
      console.warn('⚠️ Received empty response body with 200 status - possible session issue');

      // Prevent infinite retry loop
      if (this.emptyResponseRetryCount >= this.MAX_EMPTY_RESPONSE_RETRIES) {
        console.error('❌ Max retry attempts reached for empty response');
        this.emptyResponseRetryCount = 0;
        this.clearAuthToken();
        this.clearRefreshToken();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        throw {
          message: 'Session expired. Please log in again.',
          status: 401,
        } as ApiError;
      }

      // If we have a token, try to refresh it
      if (this.getAuthToken() && !this.isPublicAuthEndpoint(endpoint)) {
        console.log('🔄 Attempting token refresh due to empty response...');
        this.emptyResponseRetryCount++;

        const refreshed = await this.refreshAccessToken();

        if (refreshed) {
          console.log('✅ Token refreshed, retrying request...');
          const result = await retryRequest();
          // Reset counter on successful retry
          this.emptyResponseRetryCount = 0;
          return result;
        } else {
          // Refresh failed - treat as authentication error
          console.error('❌ Token refresh failed, clearing session');
          this.emptyResponseRetryCount = 0;
          this.clearAuthToken();
          this.clearRefreshToken();

          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

          throw {
            message: 'Session expired. Please log in again.',
            status: 401,
          } as ApiError;
        }
      }

      // Return empty data for endpoints that don't require auth
      this.emptyResponseRetryCount = 0;
      return {
        data: null as T,
        status: response.status,
      };
    }

    // Reset counter on successful response with data
    this.emptyResponseRetryCount = 0;

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
          // Refresh failed, clear tokens and redirect to login
          this.clearAuthToken();
          this.clearRefreshToken();
          this.processQueue(error);

          // Redirect to login page
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }

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
    // Ensure token is valid before making request
    if (!this.isPublicAuthEndpoint(endpoint)) {
      await this.ensureValidToken();
    }

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
    // Ensure token is valid before making request
    if (!this.isPublicAuthEndpoint(endpoint)) {
      await this.ensureValidToken();
    }

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
    // Ensure token is valid before making request
    if (!this.isPublicAuthEndpoint(endpoint)) {
      await this.ensureValidToken();
    }

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
    // Ensure token is valid before making request
    if (!this.isPublicAuthEndpoint(endpoint)) {
      await this.ensureValidToken();
    }

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
    // Ensure token is valid before making request
    if (!this.isPublicAuthEndpoint(endpoint)) {
      await this.ensureValidToken();
    }

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
      // Schedule automatic refresh when token is set
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
      // Clear scheduled refresh timer
      if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
      }
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
