/**
 * Workers API Service
 * Wrapper around generated WorkerControllerApi with error handling and data transformation
 */

import { WorkerControllerApi, Configuration } from '../../../workflow-api';
import type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse
} from '../../../workflow-api';
import { authService } from './auth';
import { env } from '../../config/env';

/**
 * Create and configure the Worker API instance
 */
const getWorkerApi = (): WorkerControllerApi => {
  const configuration = new Configuration({
    basePath: env.isDev ? '' : env.apiBaseUrl,
    accessToken: async () => {
      return authService.getAccessToken() || '';
    },
    baseOptions: {
      withCredentials: true,
    },
  });

  return new WorkerControllerApi(configuration);
};

/**
 * Workers API Service
 * Provides type-safe methods for worker management
 */
export const workerService = {
  /**
   * Get all workers for the current company
   * @returns Promise with array of workers
   */
  async getAllWorkers(): Promise<WorkerResponse[]> {
    try {
      const api = getWorkerApi();
      const response = await api.getAllWorkers();
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch workers:', error);
      throw error;
    }
  },

  /**
   * Get a specific worker by ID
   * @param id - Worker ID
   * @returns Promise with worker details
   */
  async getWorkerById(id: number): Promise<WorkerResponse> {
    try {
      const api = getWorkerApi();
      const response = await api.getWorkerById(id);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch worker ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new worker
   * @param data - Worker creation data
   * @returns Promise with created worker
   */
  async createWorker(data: WorkerCreateRequest): Promise<WorkerResponse> {
    try {
      const api = getWorkerApi();
      const response = await api.createWorker(data);
      return response.data;
    } catch (error) {
      console.error('Failed to create worker:', error);
      throw error;
    }
  },

  /**
   * Update an existing worker
   * @param id - Worker ID
   * @param data - Worker update data
   * @returns Promise with updated worker
   */
  async updateWorker(id: number, data: WorkerUpdateRequest): Promise<WorkerResponse> {
    try {
      const api = getWorkerApi();
      const response = await api.updateWorker(id, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update worker ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a worker
   * @param id - Worker ID
   * @returns Promise<void>
   */
  async deleteWorker(id: number): Promise<void> {
    try {
      const api = getWorkerApi();
      await api.deleteWorker(id);
    } catch (error) {
      console.error(`Failed to delete worker ${id}:`, error);
      throw error;
    }
  },

  /**
   * Send invitation to a worker
   * @param id - Worker ID
   * @returns Promise with invitation response
   */
  async sendInvitation(id: number): Promise<WorkerInviteResponse> {
    try {
      const api = getWorkerApi();
      const response = await api.sendInvitation(id);
      return response.data;
    } catch (error) {
      console.error(`Failed to send invitation to worker ${id}:`, error);
      throw error;
    }
  },
};

/**
 * Export generated types for use in components
 */
export type { WorkerResponse, WorkerCreateRequest, WorkerUpdateRequest, WorkerInviteResponse };

export default workerService;
