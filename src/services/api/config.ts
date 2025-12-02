import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { Configuration } from '../../../workflow-api';
import { env } from '../../config/env';
import { decodeJWT } from '../../utils/jwt';

/**
 * Token Manager - Centralized token storage and lifecycle management
 */
class TokenManager {
  private readonly ACCESS_TOKEN_KEY = 'app_access_token';
  private readonly REFRESH_TOKEN_KEY = 'app_refresh_token';
  private tokenRefreshTimer: NodeJS.Timeout | null = null;
  private readonly TOKEN_REFRESH_BUFFER = 60 * 1000; // 1 minute before expiry

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    try {
      return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Set access token and schedule refresh
   */
  setAccessToken(token: string): void {
    try {
      sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
      this.scheduleTokenRefresh();
    } catch (error) {
      console.error('Failed to store access token:', error);
    }
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    try {
      sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Clear all tokens and cancel refresh
   */
  clearTokens(): void {
    try {
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
      this.cancelTokenRefresh();
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Schedule proactive token refresh before expiration
   */
  private scheduleTokenRefresh(): void {
    this.cancelTokenRefresh();

    const token = this.getAccessToken();
    if (!token) {
      return;
    }

    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      const delay = 13 * 60 * 1000;
      this.tokenRefreshTimer = setTimeout(() => this.requestRefresh(), delay);
      return;
    }

    const expirationTime = payload.exp * 1000;
    const now = Date.now();
    const delay = expirationTime - now - this.TOKEN_REFRESH_BUFFER;

    if (delay <= 0) {
      this.requestRefresh();
    } else {
      this.tokenRefreshTimer = setTimeout(() => this.requestRefresh(), delay);
    }
  }

  /**
   * Cancel scheduled token refresh
   */
  private cancelTokenRefresh(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = null;
    }
  }

  /**
   * Trigger token refresh (called by scheduler or external code)
   */
  async requestRefresh(refreshToken?: string): Promise<boolean> {
    const token = refreshToken || this.getRefreshToken();
    if (!token) {
      return false;
    }

    try {
      const response = await axios.post(
        `${env.apiBaseUrl}/api/v1/auth/refresh`,
        { refreshToken: token },
        {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        } as any
      );

      if (response.data.accessToken) {
        this.setAccessToken(response.data.accessToken);
        if (response.data.refreshToken) {
          this.setRefreshToken(response.data.refreshToken);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }
}

/**
 * Global token manager instance
 */
export const tokenManager = new TokenManager();

/**
 * Create axios instance with base configuration
 */
export function createAxiosInstance(): AxiosInstance {
  return axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });
}

/**
 * Get API configuration for workflow-api controllers
 */
export function getApiConfig(): Configuration {
  return new Configuration({
    accessToken: tokenManager.getAccessToken() || undefined,
    basePath: env.apiBaseUrl,
  });
}

/**
 * Initialize session on app startup
 */
export async function initializeSession(): Promise<void> {
  const token = tokenManager.getAccessToken();
  if (token) {
    // Token exists, schedule its refresh
    return;
  }

  const refreshToken = tokenManager.getRefreshToken();
  if (refreshToken) {
    try {
      await tokenManager.requestRefresh(refreshToken);
    } catch (error) {
      console.error('Failed to restore session:', error);
      tokenManager.clearTokens();
    }
  }
}
