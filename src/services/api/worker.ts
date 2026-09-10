import type { AxiosResponse } from 'axios';
import { WorkersApi, WorkerProfileSelfServiceApi, Configuration } from '../../../workflow-api';
import type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
  WorkerPasswordResetRequest,
  WorkerRateUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { WorkerResponse, WorkerCreateRequest, WorkerUpdateRequest, WorkerInviteResponse, WorkerPasswordResetRequest };

// The generated WorkerProfileResponse/WorkerWeeklyHoursResponse mark every field optional
// (Jackson's nullable-by-default stance), but a successful response always carries these -
// narrowed here so callers don't need optional chaining for data that's always present.
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
  // Only present once overtime tracking has something to report for the week
  regularHours?: number;
  overtimeHours?: number;
  regularPay?: number;
  overtimePay?: number;
  totalPay?: number;
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
  // Not returned by the list endpoint (WorkerInvitationStatusResponse has no token field) -
  // the backend never exposes raw invite tokens outside the invite-creation response.
  token?: string;
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

function getWorkerProfileSelfApi(): WorkerProfileSelfServiceApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new WorkerProfileSelfServiceApi(config, env.apiBaseUrl, axiosInstance);
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
   * Send worker invitation by email
   */
  async sendWorkerInvitation(data: WorkerInvitationRequest): Promise<WorkerInvitationResponse> {
    const response = await getWorkerApi().workerSendInvitation(data);
    return response.data as WorkerInvitationResponse;
  },

  /**
   * Get all worker invitations status
   */
  async getWorkerInvitations(): Promise<WorkerInvitationStatus[]> {
    const response = await getWorkerApi().workerGetInvitationStatus();
    return response.data as WorkerInvitationStatus[];
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
    return (await getWorkerProfileSelfApi().workerProfileSelfGetOwnProfile()) as AxiosResponse<WorkerProfileResponse>;
  },

  /**
   * Worker self-service: upload my own profile photo
   */
  async uploadMyPhoto(file: File): Promise<AxiosResponse<WorkerProfileResponse>> {
    return (await getWorkerProfileSelfApi().workerProfileSelfUploadOwnPhoto(file)) as AxiosResponse<WorkerProfileResponse>;
  },

  /**
   * Worker self-service: hours worked in a given week (defaults to the current week)
   */
  async getMyWeeklyHours(date?: string): Promise<AxiosResponse<WorkerWeeklyHoursResponse>> {
    return (await getWorkerProfileSelfApi().workerProfileSelfGetOwnWeeklyHours(date)) as AxiosResponse<WorkerWeeklyHoursResponse>;
  },

  /**
   * Company admin: upload a worker's profile photo
   */
  async uploadWorkerPhoto(id: number, file: File): Promise<AxiosResponse<WorkerResponse>> {
    return await getWorkerApi().workerUploadPhotoForWorker(id, file);
  },

  /**
   * Company admin: update a worker's hourly (and optionally overtime) rate
   */
  async updateWorkerRate(id: number, hourlyRate: number, overtimeRate?: number): Promise<AxiosResponse<WorkerResponse>> {
    const payload: WorkerRateUpdateRequest = { hourlyRate };
    if (overtimeRate !== undefined) payload.overtimeRate = overtimeRate;
    return await getWorkerApi().workerUpdateHourlyRate(id, payload);
  },

  /**
   * Company admin: hours worked by a worker in a given week (defaults to the current week)
   */
  async getWorkerWeeklyHours(id: number, date?: string): Promise<AxiosResponse<WorkerWeeklyHoursResponse>> {
    return (await getWorkerApi().workerGetWeeklyHoursForWorker(id, date)) as AxiosResponse<WorkerWeeklyHoursResponse>;
  },
};

export default workerService;
