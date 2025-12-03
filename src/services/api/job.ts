import { JobControllerApi, Configuration } from '../../../workflow-api';
import type {
  JobResponse,
  JobCreateRequest,
  JobUpdateRequest,
} from '../../../workflow-api';
import { apiClient } from './client';

export type {
  JobResponse,
  JobCreateRequest,
  JobUpdateRequest,
};

/**
 * Job API Service
 * Provides CRUD operations for job management
 */

/**
 * Get a configured JobControllerApi instance with the access token
 */
function getJobApi(): JobControllerApi {
  const accessToken = apiClient.getStoredAccessToken();
  const config = new Configuration({
    accessToken: accessToken || undefined,
  });
  return new JobControllerApi(config);
}

export const jobService = {
  /**
   * Get all jobs
   */
  async getAllJobs() {
    return await getJobApi().getAll();
  },

  /**
   * Get job by ID
   */
  async getJobById(id: number) {
    return await getJobApi().get(id);
  },

  /**
   * Create a new job
   */
  async createJob(data: JobCreateRequest) {
    return await getJobApi().create(data);
  },

  /**
   * Update an existing job
   */
  async updateJob(id: number, data: JobUpdateRequest) {
    return await getJobApi().update(id, data);
  },

  /**
   * Delete a job
   */
  async deleteJob(id: number) {
    return await getJobApi().delete(id);
  },
};

export default jobService;
