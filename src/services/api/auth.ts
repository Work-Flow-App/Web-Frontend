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

    // Store auth tokens in memory
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      apiClient.setRefreshToken(response.data.refreshToken);
    }

    return response;
  },

  /**
   * Sign in an existing user
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>('/api/v1/auth/login', data);

    // Store auth tokens in memory
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      apiClient.setRefreshToken(response.data.refreshToken);
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

    // Update stored tokens in memory
    if (response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
      apiClient.setRefreshToken(response.data.refreshToken);
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
      // Clear tokens from memory even if request fails
      apiClient.clearAuthToken();
      apiClient.clearRefreshToken();
    }
  },

  /**
   * Get current user profile
   * NOTE: This endpoint is not currently available in the backend.
   * Use getRoleFromToken() from utils/jwt.ts to extract role from JWT token instead.
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>('/api/v1/auth/me');
  },

  /**
   * Verify if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!apiClient.getStoredAccessToken();
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return apiClient.getStoredAccessToken();
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return apiClient.getStoredRefreshToken();
  },
};

export default authService;
