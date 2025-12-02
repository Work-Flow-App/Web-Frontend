import { createWorkerApi } from './factories';
import type {
  WorkerResponse,
  WorkerCreateRequest,
  WorkerUpdateRequest,
  WorkerInviteResponse,
} from '../../../workflow-api';

// Export types as-is from workflowapi
export type { WorkerResponse, WorkerCreateRequest, WorkerUpdateRequest, WorkerInviteResponse };

/**
 * Worker API Service
 * Provides CRUD operations for worker management
 */

export const workerService = {
  /**
   * Get all workers
   */
  async getAllWorkers() {
    return await createWorkerApi().getAllWorkers();
  },

  /**
   * Get worker by ID
   */
  async getWorkerById(id: number) {
    return await createWorkerApi().getWorkerById(id);
  },

  /**
   * Create a new worker
   */
  async createWorker(data: WorkerCreateRequest) {
    return await createWorkerApi().createWorker(data);
  },

  /**
   * Update an existing worker
   */
  async updateWorker(id: number, data: WorkerUpdateRequest) {
    return await createWorkerApi().updateWorker(id, data);
  },

  /**
   * Delete a worker
   */
  async deleteWorker(id: number) {
    return await createWorkerApi().deleteWorker(id);
  },

  /**
   * Send invitation email to worker
   */
  async sendInvitation(id: number) {
    return await createWorkerApi().sendInvitation(id);
  },
};

export default workerService;
