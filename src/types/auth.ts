/**
 * Authentication types and enums
 */

export enum UserRole {
  COMPANY = 'COMPANY',
  WORKER = 'WORKER',
}

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
