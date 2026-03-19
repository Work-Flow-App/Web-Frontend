import { JobWorkflowsApi, Configuration } from '../../../workflow-api';
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

function getJobWorkflowApi(): JobWorkflowsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new JobWorkflowsApi(config, env.apiBaseUrl, axiosInstance);
}

export const jobWorkflowService = {
  async getAllJobWorkflows() {
    return await getJobWorkflowApi().jobWorkflowGetAllJobWorkflows();
  },

  async getJobWorkflowByJobId(jobId: number) {
    return await getJobWorkflowApi().jobWorkflowGetJobWorkflow(jobId);
  },

  async getJobWorkflowById(jobWorkflowId: number) {
    return await getJobWorkflowApi().jobWorkflowGetJobWorkflowById(jobWorkflowId);
  },

  async startWorkflow(jobId: number, workflowId: number) {
    return await getJobWorkflowApi().jobWorkflowStartWorkflow(jobId, workflowId);
  },

  async updateJobWorkflow(jobWorkflowId: number, data: JobWorkflowUpdateRequest) {
    return await getJobWorkflowApi().jobWorkflowUpdateJobWorkflow(jobWorkflowId, data);
  },

  async updateStep(jobWorkflowId: number, stepId: number, data: JobWorkflowStepUpdateRequest) {
    return await getJobWorkflowApi().jobWorkflowUpdateStep(jobWorkflowId, stepId, data);
  },

  async assignWorkerToAllSteps(jobWorkflowId: number, workerId: number) {
    return await getJobWorkflowApi().jobWorkflowAssignWorkerToAllSteps(jobWorkflowId, workerId);
  },

  async deleteJobWorkflow(jobId: number) {
    return await getJobWorkflowApi().jobWorkflowDeleteByJobId(jobId);
  },
};

export default jobWorkflowService;
