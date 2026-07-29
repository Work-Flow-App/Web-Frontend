import type { AxiosResponse } from 'axios';
import { WorkersApi, Configuration } from '../../../workflow-api';
import type {
  WorkerResponse as GeneratedWorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
  WorkerPasswordResetRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { WorkerCreateRequest, WorkerUpdateRequest, WorkerInviteResponse, WorkerPasswordResetRequest };

// v2: photoUrl + hourlyRate aren't in the generated client yet (it's generated from a deployed
// API that doesn't have this branch) - extend the generated shape locally, same as certificate.ts/leave.ts.
export interface WorkerResponse extends GeneratedWorkerResponse {
  photoUrl?: string;
  hourlyRate?: number;
}

// Worker self-service profile view - deliberately omits hourlyRate (company-only field).
export interface WorkerProfileResponse {
  id: number;
  workerRef: number;
  name: string;
  initials?: string;
  telephone?: string;
  mobile?: string;
  email?: string;
  username: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkerWeeklyHoursResponse {
  workerId: number;
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  hasOpenVisit: boolean;
}

const MULTIPART_HEADERS = { headers: { 'Content-Type': 'multipart/form-data' } };

function buildPhotoFormData(file: File): FormData {
  const form = new FormData();
  form.append('file', file);
  return form;
}

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
  async getAllWorkers(): Promise<AxiosResponse<WorkerResponse[]>> {
    return await getWorkerApi().workerGetAllWorkers();
  },

  /**
   * Get worker by ID
   */
  async getWorkerById(id: number): Promise<AxiosResponse<WorkerResponse>> {
    return await getWorkerApi().workerGetWorkerById(id);
  },

  /**
   * Create a new worker
   */
  async createWorker(data: WorkerCreateRequest) {
    return await getWorkerApi().workerCreateWorker(data);
  },

  /**
   * Update an existing worker
   */
  async updateWorker(id: number, data: WorkerUpdateRequest) {
    return await getWorkerApi().workerUpdateWorker(id, data);
  },

  /**
   * Delete a worker
   */
  async deleteWorker(id: number) {
    return await getWorkerApi().workerDeleteWorker(id);
  },

  /**
   * Send invitation email to worker (using generated API)
   */
  async sendInvitation(data: WorkerInvitationRequest) {
    return await getWorkerApi().workerSendInvitation(data);
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
    return await getWorkerApi().workerCheckInvitation(token);
  },

  async resetPassword(id: number, data: WorkerPasswordResetRequest) {
    return await getWorkerApi().workerResetWorkerUsernamePassword(id, data);
  },

  /**
   * Worker self-service: get my own profile
   */
  async getMyProfile(): Promise<AxiosResponse<WorkerProfileResponse>> {
    return axiosInstance.get<WorkerProfileResponse>(`${env.apiBaseUrl}/api/v1/worker/profile`);
  },

  /**
   * Worker self-service: upload my own profile photo
   */
  async uploadMyPhoto(file: File): Promise<AxiosResponse<WorkerProfileResponse>> {
    return axiosInstance.post<WorkerProfileResponse>(
      `${env.apiBaseUrl}/api/v1/worker/profile/photo`,
      buildPhotoFormData(file),
      MULTIPART_HEADERS
    );
  },

  /**
   * Worker self-service: hours worked in a given week (defaults to the current week)
   */
  async getMyWeeklyHours(date?: string): Promise<AxiosResponse<WorkerWeeklyHoursResponse>> {
    return axiosInstance.get<WorkerWeeklyHoursResponse>(`${env.apiBaseUrl}/api/v1/worker/profile/hours/weekly`, {
      params: date ? { date } : undefined,
    });
  },

  /**
   * Company admin: upload a worker's profile photo
   */
  async uploadWorkerPhoto(id: number, file: File): Promise<AxiosResponse<WorkerResponse>> {
    return axiosInstance.post<WorkerResponse>(
      `${env.apiBaseUrl}/api/v1/workers/${id}/photo`,
      buildPhotoFormData(file),
      MULTIPART_HEADERS
    );
  },

  /**
   * Company admin: update a worker's hourly rate
   */
  async updateWorkerRate(id: number, hourlyRate: number): Promise<AxiosResponse<WorkerResponse>> {
    return axiosInstance.patch<WorkerResponse>(`${env.apiBaseUrl}/api/v1/workers/${id}/rate`, { hourlyRate });
  },

  /**
   * Company admin: hours worked by a worker in a given week (defaults to the current week)
   */
  async getWorkerWeeklyHours(id: number, date?: string): Promise<AxiosResponse<WorkerWeeklyHoursResponse>> {
    return axiosInstance.get<WorkerWeeklyHoursResponse>(`${env.apiBaseUrl}/api/v1/workers/${id}/hours/weekly`, {
      params: date ? { date } : undefined,
    });
  },
};

export default workerService;
