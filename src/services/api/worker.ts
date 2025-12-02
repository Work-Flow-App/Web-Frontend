import { WorkerControllerApi, Configuration } from '../../../workflow-api';
import type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
} from '../../../workflow-api';
import { apiClient } from './client';

export type { WorkerResponse, WorkerCreateRequest, WorkerUpdateRequest, WorkerInviteResponse };

/**
 * Worker API Service
 * Provides CRUD operations for worker management
 */

/**
 * Get a configured WorkerControllerApi instance with the access token
 */
function getWorkerApi(): WorkerControllerApi {
  const accessToken = apiClient.getStoredAccessToken();
  const config = new Configuration({
    accessToken: accessToken || undefined,
  });
  return new WorkerControllerApi(config);
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
   * Send invitation email to worker
   */
  async sendInvitation(id: number) {
    return await getWorkerApi().sendInvitation(id);
  },
};

export default workerService;
