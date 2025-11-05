/**
 * Authentication types and enums
 */

export const UserRole = {
  COMPANY: 'COMPANY',
  WORKER: 'WORKER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  errorMessage?: string;
}
