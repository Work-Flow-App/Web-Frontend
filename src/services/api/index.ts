/**
 * API Services - Centralized exports for all API service modules
 */

// Core infrastructure
export { tokenManager, getApiConfig, initializeSession } from './config';
export { setupInterceptors, createAxiosInstance } from './interceptors';
export { transformAxiosError, extractErrorMessage } from './errors';
export type { ApiResponse, ApiError } from './errors';

// Service factories
export {
  createAuthApi,
  createWorkerApi,
  createCompanyApi,
  createClientApi,
  createJobApi,
  createJobTemplateApi,
} from './factories';

// Auth Service
export { authService } from './auth';
export type {
  AuthResponse,
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordResetResponse,
} from './auth';

// Worker Service
export { workerService } from './worker';
export type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
} from './worker';

// Company Service
export { companyService } from './company';
export type {
  CompanyProfileResponse,
  CompanyProfileUpdateRequest,
  CompanyDashboardResponse,
} from './company';

// Client Service
export { clientService } from './client';
export type { ClientResponse, ClientCreateRequest, ClientUpdateRequest } from './client';

// Job Service
export { jobService } from './job';
export type { JobResponse, JobCreateRequest, JobUpdateRequest } from './job';

// Job Template Service
export { jobTemplateService } from './jobTemplate';
export type {
  JobTemplateResponse,
  JobTemplateCreateRequest,
  JobTemplateWithFieldsResponse,
} from './jobTemplate';

// Legacy auth types
export { UserRole } from '../../types/auth';
export type { User, AuthTokens } from '../../types/auth';
