import { env } from '../../config/env';

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
      return false;
    }

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
        return false;
      }

      const data = await response.json();

      if (data.accessToken) {
        this.setAuthToken(data.accessToken);
        if (data.refreshToken) {
          this.setRefreshToken(data.refreshToken);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
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
