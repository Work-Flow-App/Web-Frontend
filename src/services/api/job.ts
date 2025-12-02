import { createJobApi } from './factories';
import type { JobResponse, JobCreateRequest, JobUpdateRequest } from '../../../workflow-api';

// Export types from workflowapi
export type { JobResponse, JobCreateRequest, JobUpdateRequest };

/**
 * Job API Service
 * Provides job management operations
 */

export const jobService = {
  /**
   * Get all jobs
   */
  async getAllJobs() {
    return await createJobApi().getAll();
  },

  /**
   * Get job by ID
   */
  async getJobById(id: number) {
    return await createJobApi().get(id);
  },

  /**
   * Create a new job
   */
  async createJob(data: JobCreateRequest) {
    return await createJobApi().create(data);
  },

  /**
   * Update an existing job
   */
  async updateJob(id: number, data: JobUpdateRequest) {
    return await createJobApi().update(id, data);
  },

  /**
   * Delete a job
   */
  async deleteJob(id: number) {
    return await createJobApi()._delete(id);
  },
};

export default jobService;
