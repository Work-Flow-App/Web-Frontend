/**
 * Authentication types and enums
 */

// Role values for signup (what backend expects in signup request)
export const UserRole = {
  COMPANY: 'COMPANY',
  WORKER: 'WORKER',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Role values as they appear in JWT tokens (with ROLE_ prefix)
export const JWTRole = {
  COMPANY: 'ROLE_COMPANY',
  WORKER: 'ROLE_WORKER',
} as const;

export type JWTRole = typeof JWTRole[keyof typeof JWTRole];

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole | JWTRole | string; // Allow string to handle backend variations
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  errorMessage?: string;
}
