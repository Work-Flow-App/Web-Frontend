import { apiClient } from './client';
import type { ApiResponse } from './client';

/**
 * Worker API Service
 * Provides CRUD operations for worker management
 */

export interface Worker {
  id: number;
  name: string;
  initials?: string;
  telephone?: string;
  mobile?: string;
  email?: string;
  username?: string;
  loginLocked?: boolean;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWorkerData {
  name: string;
  initials?: string;
  telephone?: string;
  mobile?: string;
  email?: string;
  username: string;
  password: string;
}

export interface UpdateWorkerData {
  name: string;
  initials?: string;
  telephone?: string;
  mobile?: string;
  email?: string;
}

export interface WorkerInvite {
  workerId?: number;
  workerName?: string;
  email?: string;
  message?: string;
}

export const workerService = {
  /**
   * Get all workers
   */
  async getAllWorkers(): Promise<ApiResponse<Worker[]>> {
    return await apiClient.get<Worker[]>('/api/v1/workers');
  },

  /**
   * Get worker by ID
   */
  async getWorkerById(id: number): Promise<ApiResponse<Worker>> {
    return await apiClient.get<Worker>(`/api/v1/workers/${id}`);
  },

  /**
   * Create a new worker
   */
  async createWorker(data: CreateWorkerData): Promise<ApiResponse<Worker>> {
    return await apiClient.post<Worker>('/api/v1/workers', data);
  },

  /**
   * Update an existing worker
   */
  async updateWorker(id: number, data: UpdateWorkerData): Promise<ApiResponse<Worker>> {
    return await apiClient.put<Worker>(`/api/v1/workers/${id}`, data);
  },

  /**
   * Delete a worker
   */
  async deleteWorker(id: number): Promise<ApiResponse<void>> {
    return await apiClient.delete<void>(`/api/v1/workers/${id}`);
  },

  /**
   * Send invitation email to worker
   */
  async sendInvitation(id: number): Promise<ApiResponse<WorkerInvite>> {
    return await apiClient.post<WorkerInvite>(`/api/v1/workers/${id}/invite`, {});
  },
};

export default workerService;
