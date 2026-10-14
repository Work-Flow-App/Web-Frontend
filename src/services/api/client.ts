import { env } from '../../config/env';
import { decodeJWT } from '../../utils/jwt';
import { classifySubscriptionError, isOnSubscriptionPage } from '../../utils/subscriptionErrors';
import { TokenSync, type SessionTokens } from './tokenSync';

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

export interface ApiClientOptions {
  /** Where this tab's tokens live; sessionStorage unless a test simulates another tab */
  storage?: () => Storage;
}

export class ApiClient {
  private timeout: number;
  // In-flight refresh shared by every caller in this tab. The backend revokes a
  // refresh token once it's used, so two parallel refreshes with the same token
  // would make the second one fail and log the user out. tokenSync does the
  // same for duplicated tabs, which share the token.
  private refreshPromise: Promise<boolean> | null = null;
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private sessionRestored: boolean = false;
  private sessionRestorePromise: Promise<void> | null = null;
  private readonly storage: () => Storage;
  private readonly tokenSync: TokenSync;

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
    '/auth/google',
    '/auth/signup',
    '/auth/signup/worker',
    '/auth/signup/company-member',
    '/companies/members/invitations/check',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/resend-verification',
    '/workers/invites/check',
  ];

  constructor(options: ApiClientOptions = {}) {
    this.timeout = env.apiTimeout;
    this.storage = options.storage ?? (() => sessionStorage);
    this.tokenSync = new TokenSync({
      storage: this.storage,
      getTokens: () => {
        const accessToken = this.getAuthToken();
        const refreshToken = this.getRefreshToken();
        return accessToken && refreshToken ? { accessToken, refreshToken } : null;
      },
      adoptTokens: (tokens) => this.storeTokens(tokens),
    });
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
   * Schedule proactive token refresh before expiration.
   * refreshIfDue is false for tokens from a refresh: with a skewed clock they'd
   * look due at once, and tabs would keep refreshing in answer to each other.
   */
  private scheduleTokenRefresh(refreshIfDue = true): void {
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
      if (refreshIfDue) this.refreshAccessToken();
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
      return this.storage().getItem(this.ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Get refresh token from sessionStorage
   */
  private getRefreshToken(): string | null {
    try {
      return this.storage().getItem(this.REFRESH_TOKEN_KEY);
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
   * Refresh the access token using the refresh token.
   * Concurrent callers share the same in-flight request, and duplicated tabs
   * take turns, so only one refresh is ever sent at a time.
   */
  refreshAccessToken(): Promise<boolean> {
    if (!this.refreshPromise) {
      const tokenBefore = this.getRefreshToken();
      this.refreshPromise = this.tokenSync
        .withRefreshLock(() => {
          // A duplicated tab may have refreshed the shared login while we waited
          const current = this.getRefreshToken();
          return current && current !== tokenBefore ? Promise.resolve(true) : this.performTokenRefresh();
        })
        .finally(() => {
          this.refreshPromise = null;
        });
    }
    return this.refreshPromise;
  }

  private async performTokenRefresh(allowRecovery = true): Promise<boolean> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    // Bounded, so a hung request can't hold up the other tabs' refreshes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
        credentials: 'include',
        mode: 'cors',
      });

      // Handle authentication errors (invalid/expired refresh token)
      if (!response.ok) {
        const tokenRefused = response.status === 401 || response.status === 403;
        // Only clear tokens on auth failures and 400 (a malformed request can't
        // succeed on retry), not on server errors
        if (tokenRefused || response.status === 400) {
          if (tokenRefused && allowRecovery && (await this.recoverFromDuplicateTabs(refreshToken))) {
            return true;
          }
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
        if (data.refreshToken) {
          const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };
          this.storeTokens(tokens);
          // Duplicated tabs hold the refresh token we just used up
          await this.tokenSync.announce(tokens);
        } else {
          this.setAuthToken(data.accessToken);
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
      clearTimeout(timeoutId);
    }
  }

  /**
   * Our refresh token was rejected. If a duplicated tab already rotated it,
   * continue with that tab's tokens instead of logging out.
   */
  private async recoverFromDuplicateTabs(rejectedToken: string): Promise<boolean> {
    // Their update may have arrived while our request was in flight
    await this.tokenSync.settle();
    if (this.hasRefreshTokenOtherThan(rejectedToken)) {
      return true;
    }

    // This tab may have been frozen or discarded through their refresh: ask them
    if (await this.tokenSync.requestNewerTokens()) {
      // Their access token may be about to expire, so get a fresh pair with it
      return this.performTokenRefresh(false);
    }
    return this.hasRefreshTokenOtherThan(rejectedToken);
  }

  private hasRefreshTokenOtherThan(token: string): boolean {
    const current = this.getRefreshToken();
    return !!current && current !== token;
  }

  /**
   * Store the tokens from a refresh, this tab's or a duplicated tab's.
   * Unlike setRefreshToken, keeps the login's cross-tab sync key.
   */
  private storeTokens({ accessToken, refreshToken }: SessionTokens): void {
    try {
      this.storage().setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      this.storage().setItem(this.ACCESS_TOKEN_KEY, accessToken);
    } catch (error) {
      console.error('Failed to store refreshed tokens:', error);
    }
    this.scheduleTokenRefresh(false);
  }

  /**
   * Handle API response with automatic token refresh on 401.
   * retryRequest is null when this response is already a retry, so a request
   * that still gets 401 after a refresh fails instead of refreshing forever.
   */
  private async handleResponse<T>(
    response: Response,
    retryRequest: (() => Promise<ApiResponse<T>>) | null,
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
      if (response.status === 401 && retryRequest && !this.isPublicAuthEndpoint(endpoint)) {
        return this.handle401Error(error, retryRequest);
      }

      // Handle 402 Payment Required - redirect only on a lapsed subscription;
      // cap-reached / unclassified errors fall through to the caller's own
      // error handling (inline upsell messaging).
      if (response.status === 402 && typeof window !== 'undefined') {
        const shimError = { response: { status: 402, data: { message: error.message } } };
        if (classifySubscriptionError(shimError) === 'lapsed' && !isOnSubscriptionPage()) {
          window.location.href = '/subscribe';
        }
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
    // Joins any refresh already in flight instead of starting a second one
    const refreshed = await this.refreshAccessToken();

    if (refreshed) {
      return retryRequest();
    }

    // Refresh failed - refreshAccessToken() already handled token clearing
    // if it was an auth error (401/403). For network errors, tokens are kept.
    throw error;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const makeRequest = async (isRetry = false): Promise<ApiResponse<T>> => {
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

        return await this.handleResponse<T>(response, isRetry ? null : () => makeRequest(true), endpoint);
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
    const makeRequest = async (isRetry = false): Promise<ApiResponse<T>> => {
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

        return await this.handleResponse<T>(response, isRetry ? null : () => makeRequest(true), endpoint);
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
    const makeRequest = async (isRetry = false): Promise<ApiResponse<T>> => {
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

        return await this.handleResponse<T>(response, isRetry ? null : () => makeRequest(true), endpoint);
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
    const makeRequest = async (isRetry = false): Promise<ApiResponse<T>> => {
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

        return await this.handleResponse<T>(response, isRetry ? null : () => makeRequest(true), endpoint);
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
    const makeRequest = async (isRetry = false): Promise<ApiResponse<T>> => {
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

        return await this.handleResponse<T>(response, isRetry ? null : () => makeRequest(true), endpoint);
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
      this.storage().setItem(this.ACCESS_TOKEN_KEY, token);
      // Schedule proactive refresh when new token is set
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  /**
   * Set refresh token in sessionStorage — for a new login. Tabs duplicated
   * from this one from now on share the login and keep each other in step.
   */
  setRefreshToken(token: string): void {
    try {
      this.storage().setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
    this.tokenSync.startSession();
  }

  /**
   * Clear authentication token from sessionStorage
   */
  clearAuthToken(): void {
    try {
      this.storage().removeItem(this.ACCESS_TOKEN_KEY);
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
      this.storage().removeItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
    this.tokenSync.endSession();
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
