import { apiClient } from './client';
import type { ApiResponse } from './client';
import type { UserRole, AuthTokens, User } from '../../types/auth';

/**
 * Authentication API Service
 */

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type AuthResponse = AuthTokens;

export const authService = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/signup', data);

    // Store auth tokens
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }

    return response;
  },

  /**
   * Sign in an existing user
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);

    // Store auth tokens
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }

    return response;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/refresh', {
      refreshToken,
    });

    // Update stored tokens
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
    }

    return response;
  },

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      // Clear tokens even if request fails
      apiClient.clearAuthToken();
      localStorage.removeItem('refresh_token');
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>('/api/v1/auth/me');
  },

  /**
   * Verify if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },
};

export default authService;
