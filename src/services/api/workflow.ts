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

/**
 * Workflow API Service
 * Provides CRUD operations for workflow template management
 */

/**
 * Get a configured WorkflowsApi instance
 * Note: Don't pass accessToken to Configuration - the axios interceptor handles it
 */
function getWorkflowApi(): WorkflowsApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new WorkflowsApi(config, env.apiBaseUrl, axiosInstance);
}

export const workflowService = {
  /**
   * Get all workflows
   */
  async getAllWorkflows() {
    return await getWorkflowApi().getAll();
  },

  /**
   * Get workflow by ID
   */
  async getWorkflowById(id: number) {
    return await getWorkflowApi().getOne(id);
  },

  /**
   * Get workflow with steps
   */
  async getWorkflowWithSteps(workflowId: number) {
    return await getWorkflowApi().getWorkflowWithSteps(workflowId);
  },

  /**
   * Create a new workflow
   */
  async createWorkflow(data: WorkflowCreateRequest) {
    return await getWorkflowApi().create(data);
  },

  /**
   * Update an existing workflow
   */
  async updateWorkflow(id: number, data: WorkflowCreateRequest) {
    return await getWorkflowApi().update(id, data);
  },

  /**
   * Bulk update workflow with steps
   */
  async bulkUpdateWorkflow(workflowId: number, data: WorkflowBulkUpdateRequest) {
    return await getWorkflowApi().bulkUpdate(workflowId, data);
  },

  /**
   * Delete a workflow
   */
  async deleteWorkflow(id: number) {
    return await getWorkflowApi()._delete(id);
  },

  /**
   * Get all workflow steps
   */
  async getAllSteps() {
    return await getWorkflowApi().getAllSteps();
  },

  /**
   * Get steps for a specific workflow
   */
  async getWorkflowSteps(workflowId: number) {
    return await getWorkflowApi().getSteps(workflowId);
  },

  /**
   * Get a specific step
   */
  async getStepById(stepId: number) {
    return await getWorkflowApi().getStep(stepId);
  },

  /**
   * Create a new workflow step
   */
  async createStep(data: WorkflowStepCreateRequest) {
    return await getWorkflowApi().createStep(data);
  },

  /**
   * Update a workflow step
   */
  async updateStep(stepId: number, data: WorkflowStepCreateRequest) {
    return await getWorkflowApi().updateStep(stepId, data);
  },

  /**
   * Delete a workflow step
   */
  async deleteStep(stepId: number) {
    return await getWorkflowApi().deleteStep(stepId);
  },
};

export default workflowService;
