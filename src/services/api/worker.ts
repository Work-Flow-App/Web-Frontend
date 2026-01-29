import { WorkersApi, Configuration } from '../../../workflow-api';
import type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { WorkerResponse, WorkerCreateRequest, WorkerUpdateRequest, WorkerInviteResponse };

// Additional types for worker invitation system
export interface WorkerInvitationRequest {
  email: string;
}

export interface WorkerInvitationResponse {
  email: string;
  message: string;
  expiresAt: string;
}

export interface WorkerInvitationStatus {
  invitationId: number;
  email: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
}

export interface WorkerSignupRequest {
  invitationToken: string;
  email: string;
  name: string;
  initials?: string;
  telephone?: string;
  mobile?: string;
  username: string;
  password: string;
}

export interface WorkerSignupResponse {
  workerId: number;
  name: string;
  email: string;
  username: string;
  companyName: string;
  message: string;
}

/**
 * Worker API Service
 * Provides CRUD operations for worker management
 */

/**
 * Get a configured WorkersApi instance with the access token
 * Note: Don't pass accessToken to Configuration - the axios interceptor handles it
 */
function getWorkerApi(): WorkersApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new WorkersApi(config, env.apiBaseUrl, axiosInstance);
}

export const workerService = {
  /**
   * Get all workers
   */
  async getAllWorkers() {
    return await getWorkerApi().getAllWorkers();
  },

  /**
   * Get worker by ID
   */
  async getWorkerById(id: number) {
    return await getWorkerApi().getWorkerById(id);
  },

  /**
   * Create a new worker
   */
  async createWorker(data: WorkerCreateRequest) {
    return await getWorkerApi().createWorker(data);
  },

  /**
   * Update an existing worker
   */
  async updateWorker(id: number, data: WorkerUpdateRequest) {
    return await getWorkerApi().updateWorker(id, data);
  },

  /**
   * Delete a worker
   */
  async deleteWorker(id: number) {
    return await getWorkerApi().deleteWorker(id);
  },

  /**
   * Send invitation email to worker (using generated API)
   */
  async sendInvitation(data: WorkerInvitationRequest) {
    return await getWorkerApi().sendInvitation(data);
  },

  /**
   * Send worker invitation by email (new invitation system)
   */
  async sendWorkerInvitation(data: WorkerInvitationRequest): Promise<WorkerInvitationResponse> {
    const response = await axiosInstance.post<WorkerInvitationResponse>(
      `${env.apiBaseUrl}/api/v1/workers/invite`,
      data
    );
    return response.data;
  },

  /**
   * Get all worker invitations status
   */
  async getWorkerInvitations(): Promise<WorkerInvitationStatus[]> {
    const response = await axiosInstance.get<WorkerInvitationStatus[]>(
      `${env.apiBaseUrl}/api/v1/workers/invites`
    );
    return response.data;
  },

  /**
   * Check invitation token validity and get invitation details
   */
  async checkInvitation(token: string) {
    return await getWorkerApi().checkInvitation(token);
  },
};

export default workerService;
