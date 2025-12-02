import { createAuthApi } from './factories';
import { tokenManager } from './config';
import type {
  SignupRequest as WorkflowSignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordResetResponse,
  AuthenticationResponse,
} from '../../../workflow-api';
import type { UserRole } from '../../types/auth';

/**
 * Authentication API Service
 */

// Type alias for compatibility - use the workflowapi SignupRequest but with role type
export type SignupRequest = Omit<WorkflowSignupRequest, 'role'> & {
  role: UserRole;
};

// Re-export other types
export type { LoginRequest, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest, PasswordResetResponse };
export type AuthResponse = AuthenticationResponse;

export const authService = {
  /**
   * Sign up a new user
   */
  async signup(data: SignupRequest) {
    const api = createAuthApi();
    const response = await api.signup(data as any);

    if (response.data.accessToken) {
      tokenManager.setAccessToken(response.data.accessToken);
      if (response.data.refreshToken) {
        tokenManager.setRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  },

  /**
   * Sign in an existing user
   */
  async login(data: LoginRequest) {
    const api = createAuthApi();
    const response = await api.login(data);

    if (response.data.accessToken) {
      tokenManager.setAccessToken(response.data.accessToken);
      if (response.data.refreshToken) {
        tokenManager.setRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string) {
    const api = createAuthApi();
    const response = await api.refreshToken({ refreshToken });

    if (response.data.accessToken) {
      tokenManager.setAccessToken(response.data.accessToken);
      if (response.data.refreshToken) {
        tokenManager.setRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  },

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    const refreshToken = tokenManager.getRefreshToken();

    try {
      if (refreshToken) {
        const api = createAuthApi();
        await api.logout({ refreshToken });
      }
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * Sign out the current user from all devices
   */
  async logoutFromAllDevices(): Promise<void> {
    try {
      const api = createAuthApi();
      await api.logoutFromAllDevices();
    } finally {
      tokenManager.clearTokens();
    }
  },

  /**
   * Verify if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    return tokenManager.getRefreshToken();
  },

  /**
   * Request password reset email
   */
  async forgotPassword(data: ForgotPasswordRequest) {
    const api = createAuthApi();
    return await api.forgotPassword(data);
  },

  /**
   * Reset password with code from email
   */
  async resetPassword(data: ResetPasswordRequest) {
    const api = createAuthApi();
    return await api.resetPassword(data);
  },
};

export default authService;
