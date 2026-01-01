import { apiClient } from './client';
import type { ApiResponse } from './client';
import type {
  SignupRequest as WorkflowSignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordResetResponse,
} from '../../../workflow-api';
import type { UserRole, AuthTokens, User } from '../../types/auth';
import type { WorkerSignupRequest, WorkerSignupResponse } from './worker';

/**
 * Authentication API Service
 */

// Type alias for compatibility - use the workflowapi SignupRequest but with role type
export type SignupRequest = Omit<WorkflowSignupRequest, 'role'> & {
  role: UserRole;
};

// Re-export other types with original names
export type { LoginRequest, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest, PasswordResetResponse };

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
   * Sends refresh token to backend to invalidate it
   */
  async logout(): Promise<void> {
    const refreshToken = apiClient.getStoredRefreshToken();

    try {
      // Only call API if we have a refresh token
      if (refreshToken) {
        await apiClient.post('/api/v1/auth/logout', { refreshToken });
      }
    } finally {
      // Clear tokens from memory even if request fails
      apiClient.clearAuthToken();
      apiClient.clearRefreshToken();
    }
  },

  /**
   * Sign out the current user from all devices
   * Invalidates all refresh tokens for the user
   */
  async logoutFromAllDevices(): Promise<void> {
    try {
      await apiClient.post('/api/v1/auth/logout-all');
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

  /**
   * Request password reset email
   * Sends a reset code to the user's email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<PasswordResetResponse>> {
    return await apiClient.post<PasswordResetResponse>('/api/v1/auth/forgot-password', data);
  },

  /**
   * Reset password with code from email
   * After successful reset, user must login again to get tokens
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<PasswordResetResponse>> {
    return await apiClient.post<PasswordResetResponse>('/api/v1/auth/reset-password', data);
  },

  /**
   * Worker signup via invitation token
   * Creates a new worker account using an invitation token
   */
  async signupWorkerViaInvitation(data: WorkerSignupRequest): Promise<ApiResponse<WorkerSignupResponse>> {
    return await apiClient.post<WorkerSignupResponse>('/api/v1/auth/signup/worker', data);
  },
};

export default authService;
