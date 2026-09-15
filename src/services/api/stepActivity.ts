import { WorkflowStepActivitiesApi, Configuration, JobWorkflowStepActivityUploadAttachmentTypeEnum } from '../../../workflow-api';
import type {
  StepCommentCreateRequest,
  StepCommentResponse,
  StepTimelineItemResponse,
  StepAttachmentResponse,
  StepAttachmentUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export { JobWorkflowStepActivityUploadAttachmentTypeEnum as UploadAttachmentTypeEnum };
export type {
  StepCommentCreateRequest,
  StepCommentResponse,
  StepTimelineItemResponse,
  StepAttachmentResponse,
  StepAttachmentUpdateRequest,
};

function getStepActivityApi(): WorkflowStepActivitiesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkflowStepActivitiesApi(config, env.apiBaseUrl, axiosInstance);
}

export const stepActivityService = {
  async getComments(stepId: number) {
    return await getStepActivityApi().jobWorkflowStepActivityGetComments(stepId);
  },

  async addComment(stepId: number, data: StepCommentCreateRequest) {
    return await getStepActivityApi().jobWorkflowStepActivityAddComment(stepId, data);
  },

  async updateComment(commentId: number, data: StepCommentCreateRequest) {
    return await getStepActivityApi().jobWorkflowStepActivityUpdateComment(commentId, data);
  },

  async deleteComment(commentId: number) {
    return await getStepActivityApi().jobWorkflowStepActivityDeleteComment(commentId);
  },

  async getDiscussionTimeline(stepId: number) {
    return await getStepActivityApi().jobWorkflowStepActivityGetDiscussionTimeline(stepId);
  },

  async getTimeline(stepId: number) {
    return await getStepActivityApi().stepActivityGetTimeline(stepId);
  },

  async getAttachments(stepId: number) {
    return await getStepActivityApi().jobWorkflowStepActivityGetAttachments(stepId);
  },

  async uploadAttachment(
    stepId: number,
    file: File,
    type: JobWorkflowStepActivityUploadAttachmentTypeEnum = JobWorkflowStepActivityUploadAttachmentTypeEnum.General,
    description?: string
  ) {
    return await getStepActivityApi().jobWorkflowStepActivityUploadAttachment(stepId, type, file, description);
  },

  async updateAttachment(attachmentId: number, data: StepAttachmentUpdateRequest) {
    return await getStepActivityApi().jobWorkflowStepActivityUpdateAttachment(attachmentId, data);
  },

  async deleteAttachment(attachmentId: number) {
    return await getStepActivityApi().jobWorkflowStepActivityDeleteAttachment(attachmentId);
  },
};

export default stepActivityService;
