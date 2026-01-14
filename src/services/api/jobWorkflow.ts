import { JobWorkflowControllerApi, Configuration } from '../../../workflow-api';
import type {
  JobWorkflowResponse,
  JobWorkflowUpdateRequest,
  JobWorkflowStepResponse,
  JobWorkflowStepUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  JobWorkflowResponse,
  JobWorkflowUpdateRequest,
  JobWorkflowStepResponse,
  JobWorkflowStepUpdateRequest,
};

/**
 * Job Workflow API Service
 * Provides operations for managing job workflows and their execution
 */

/**
 * Get a configured JobWorkflowControllerApi instance
 * Note: Don't pass accessToken to Configuration - the axios interceptor handles it
 */
function getJobWorkflowApi(): JobWorkflowControllerApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new JobWorkflowControllerApi(config, env.apiBaseUrl, axiosInstance);
}

export const jobWorkflowService = {
  /**
   * Get all job workflows
   */
  async getAllJobWorkflows() {
    return await getJobWorkflowApi().getAllJobWorkflows();
  },

  /**
   * Get job workflow by job ID
   */
  async getJobWorkflowByJobId(jobId: number) {
    return await getJobWorkflowApi().getJobWorkflow(jobId);
  },

  /**
   * Get job workflow by ID
   */
  async getJobWorkflowById(jobWorkflowId: number) {
    return await getJobWorkflowApi().getJobWorkflowById(jobWorkflowId);
  },

  /**
   * Start a workflow for a job
   */
  async startWorkflow(jobId: number, workflowId: number) {
    return await getJobWorkflowApi().startWorkflow(jobId, workflowId);
  },

  /**
   * Update job workflow
   */
  async updateJobWorkflow(jobWorkflowId: number, data: JobWorkflowUpdateRequest) {
    return await getJobWorkflowApi().updateJobWorkflow(jobWorkflowId, data);
  },

  /**
   * Update a specific step in the job workflow
   */
  async updateStep(jobId: number, stepId: number, data: JobWorkflowStepUpdateRequest) {
    return await getJobWorkflowApi().updateStep1(jobId, stepId, data);
  },

  /**
   * Assign a worker to all steps in the job workflow
   */
  async assignWorkerToAllSteps(jobWorkflowId: number, workerId: number) {
    return await getJobWorkflowApi().assignWorkerToAllSteps(jobWorkflowId, workerId);
  },

  /**
   * Delete job workflow by job ID
   */
  async deleteJobWorkflow(jobId: number) {
    return await getJobWorkflowApi().deleteByJobId(jobId);
  },
};

export default jobWorkflowService;
