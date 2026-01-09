/**
 * API Services
 * Central export for all API service modules
 */

export { apiClient } from './client';
export type { ApiResponse, ApiError } from './client';

export { authService } from './auth';
export type { SignupRequest, LoginRequest, AuthResponse } from './auth';

export { workerService } from './worker';
export type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
  WorkerInvitationRequest,
  WorkerInvitationResponse,
  WorkerInvitationStatus,
  WorkerSignupRequest,
  WorkerSignupResponse
} from './worker';

export { companyClientService } from './companyClient';
export type { ClientResponse, ClientCreateRequest, ClientUpdateRequest } from './companyClient';

export { jobTemplateService } from './jobTemplate';
export type { JobTemplateResponse, JobTemplateCreateRequest, JobTemplateFieldResponse, JobTemplateFieldCreateRequest, JobTemplateWithFieldsResponse } from './jobTemplate';
export { JobTemplateFieldCreateRequestJobFieldTypeEnum } from '../../../workflow-api';

export { jobService } from './job';
export type { JobResponse, JobCreateRequest, JobUpdateRequest } from './job';

export { assetService } from './asset';
export type {
  AssetResponse,
  AssetCreateRequest,
  AssetUpdateRequest,
  AssetValueResponse,
  AssetAssignmentResponse,
  AssetAssignmentCreateRequest,
  AssetAssignmentReturnRequest,
  PageAssetResponse,
} from './asset';

export { workflowService } from './workflow';
export type {
  WorkflowResponse,
  WorkflowCreateRequest,
  WorkflowStepResponse,
  WorkflowStepCreateRequest,
  WorkflowWithStepsResponse,
  WorkflowBulkUpdateRequest,
} from './workflow';

export { jobWorkflowService } from './jobWorkflow';
export type {
  JobWorkflowResponse,
  JobWorkflowUpdateRequest,
  JobWorkflowStepResponse,
  JobWorkflowStepUpdateRequest,
} from './jobWorkflow';

export { UserRole } from '../../types/auth';
export type { User, AuthTokens } from '../../types/auth';
