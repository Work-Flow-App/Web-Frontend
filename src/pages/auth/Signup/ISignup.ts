import type { UserRole } from '../../../types/auth';

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface FeatureShowcaseItem {
  title: string;
  description: string;
}
