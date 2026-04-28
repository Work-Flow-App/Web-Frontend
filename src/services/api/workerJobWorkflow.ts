import {
  WorkerJobWorkflowsApi,
  Configuration,
  WorkerJobWorkflowUploadAttachmentTypeEnum,
} from '../../../workflow-api';
import type {
  JobWorkflowResponse,
  JobWorkflowStepResponse,
  StepCommentCreateRequest,
  StepCommentResponse,
  StepTimelineItemResponse,
  StepAttachmentResponse,
  StepVisitLogCreateRequest,
  StepVisitLogResponse,
  StepVisitLogSummaryResponse,
  WorkerAssignedStepResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export { WorkerJobWorkflowUploadAttachmentTypeEnum };
export type {
  JobWorkflowResponse,
  JobWorkflowStepResponse,
  StepCommentCreateRequest,
  StepCommentResponse,
  StepTimelineItemResponse,
  StepAttachmentResponse,
  StepVisitLogCreateRequest,
  StepVisitLogResponse,
  StepVisitLogSummaryResponse,
  WorkerAssignedStepResponse,
};

function getWorkerJobWorkflowApi(): WorkerJobWorkflowsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkerJobWorkflowsApi(config, env.apiBaseUrl, axiosInstance);
}

export const workerJobWorkflowService = {
  async getMyJobWorkflows() {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetMyJobWorkflows();
  },

  async getMyAssignedSteps() {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetMyAssignedSteps();
  },

  async getJobWorkflow(jobWorkflowId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetJobWorkflow(jobWorkflowId);
  },

  async getStep(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetStep(stepId);
  },

  async startStep(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowStartStep(stepId);
  },

  async markStepOngoing(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowMarkStepOngoing(stepId);
  },

  async completeOngoingStep(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowCompleteOngoingStep(stepId);
  },

  async completeStep(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowCompleteStep(stepId);
  },

  async getStepComments(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetStepComments(stepId);
  },

  async addComment(stepId: number, data: StepCommentCreateRequest) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowAddComment(stepId, data);
  },

  async getStepDiscussion(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetStepDiscussion(stepId);
  },

  async getStepAttachments(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetStepAttachments(stepId);
  },

  async uploadAttachment(
    stepId: number,
    file: File,
    type: WorkerJobWorkflowUploadAttachmentTypeEnum = WorkerJobWorkflowUploadAttachmentTypeEnum.General,
    description?: string,
  ) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowUploadAttachment(stepId, type, file, description);
  },

  async getStepVisits(stepId: number) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowGetStepVisits(stepId);
  },

  async addVisitLog(stepId: number, data: StepVisitLogCreateRequest) {
    return await getWorkerJobWorkflowApi().workerJobWorkflowAddVisitLog(stepId, data);
  },
};

export default workerJobWorkflowService;
