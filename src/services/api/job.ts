import { JobControllerApi, Configuration } from '../../../workflow-api';
import type {
  JobResponse,
  JobCreateRequest,
  JobUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

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
 * Note: Don't pass accessToken to Configuration - the axios interceptor handles it
 */
function getJobApi(): JobControllerApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new JobControllerApi(config, env.apiBaseUrl, axiosInstance);
}

export const jobService = {
  /**
   * Get all jobs
   */
  async getAllJobs() {
    return await getJobApi().getAll1();
  },

  /**
   * Get jobs by template ID
   */
  async getJobsByTemplate(templateId: number) {
    return await getJobApi().getJobsByTemplate(templateId);
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
    return await getJobApi().create1(data);
  },

  /**
   * Update an existing job
   */
  async updateJob(id: number, data: JobUpdateRequest) {
    return await getJobApi().update1(id, data);
  },

  /**
   * Delete a job
   */
  async deleteJob(id: number) {
    return await getJobApi().delete1(id);
  },
};

export default jobService;
