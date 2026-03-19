import { WorkflowsApi, Configuration } from '../../../workflow-api';
import type {
  WorkflowResponse,
  WorkflowCreateRequest,
  WorkflowStepResponse,
  WorkflowStepCreateRequest,
  WorkflowWithStepsResponse,
  WorkflowBulkUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  WorkflowResponse,
  WorkflowCreateRequest,
  WorkflowStepResponse,
  WorkflowStepCreateRequest,
  WorkflowWithStepsResponse,
  WorkflowBulkUpdateRequest,
};

function getWorkflowApi(): WorkflowsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkflowsApi(config, env.apiBaseUrl, axiosInstance);
}

export const workflowService = {
  async getAllWorkflows() {
    return await getWorkflowApi().workflowGetAll();
  },

  async getWorkflowById(id: number) {
    return await getWorkflowApi().workflowGetOne(id);
  },

  async getWorkflowWithSteps(workflowId: number) {
    return await getWorkflowApi().workflowGetWorkflowWithSteps(workflowId);
  },

  async createWorkflow(data: WorkflowCreateRequest) {
    return await getWorkflowApi().workflowCreate(data);
  },

  async updateWorkflow(id: number, data: WorkflowCreateRequest) {
    return await getWorkflowApi().workflowUpdate(id, data);
  },

  async bulkUpdateWorkflow(workflowId: number, data: WorkflowBulkUpdateRequest) {
    return await getWorkflowApi().workflowBulkUpdate(workflowId, data);
  },

  async deleteWorkflow(id: number) {
    return await getWorkflowApi().workflowDelete(id);
  },

  async getAllSteps() {
    return await getWorkflowApi().workflowGetAllSteps();
  },

  async getWorkflowSteps(workflowId: number) {
    return await getWorkflowApi().workflowGetSteps(workflowId);
  },

  async getStepById(stepId: number) {
    return await getWorkflowApi().workflowGetStep(stepId);
  },

  async createStep(data: WorkflowStepCreateRequest) {
    return await getWorkflowApi().workflowCreateStep(data);
  },

  async updateStep(stepId: number, data: WorkflowStepCreateRequest) {
    return await getWorkflowApi().workflowUpdateStep(stepId, data);
  },

  async deleteStep(stepId: number) {
    return await getWorkflowApi().workflowDeleteStep(stepId);
  },
};

export default workflowService;
