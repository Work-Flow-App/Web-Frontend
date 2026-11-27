export const AuthErrorCode = {
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
} as const;

export type AuthErrorCode = typeof AuthErrorCode[keyof typeof AuthErrorCode];
