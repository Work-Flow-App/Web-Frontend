import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { authService } from '../services/api/auth';
import type { LoginRequest, AuthResponse } from '../services/api/auth';
import type { ApiResponse } from '../services/api/client';
import { getRoleFromToken } from '../utils/jwt';

export interface AuthContextValue {
  accessToken: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<ApiResponse<AuthResponse>>;
  loginWithGoogle: (idToken: string) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => authService.getAccessToken()
  );

  const userRole = accessToken ? getRoleFromToken(accessToken) : null;

  const login = useCallback(async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await authService.login(data);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await authService.loginWithGoogle(idToken);
    if (response.data.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authService.logout();
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userRole,
        isAuthenticated: !!accessToken,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
