export interface ResetPasswordFormData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}
