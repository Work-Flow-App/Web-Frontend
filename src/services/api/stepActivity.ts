import { WorkflowStepActivitiesApi, Configuration, UploadAttachment1TypeEnum } from '../../../workflow-api';
import type {
  StepCommentCreateRequest,
  StepCommentResponse,
  StepTimelineItemResponse,
  StepAttachmentResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export { UploadAttachment1TypeEnum };
export type {
  StepCommentCreateRequest,
  StepCommentResponse,
  StepTimelineItemResponse,
  StepAttachmentResponse,
};

/**
 * Step Activity API Service
 * Provides operations for managing step comments and attachments
 */

/**
 * Get a configured WorkflowStepActivitiesApi instance
 */
function getStepActivityApi(): WorkflowStepActivitiesApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new WorkflowStepActivitiesApi(config, env.apiBaseUrl, axiosInstance);
}

export const stepActivityService = {
  /**
   * Get comments for a specific step
   */
  async getComments(stepId: number) {
    return await getStepActivityApi().getComments(stepId);
  },

  /**
   * Add a comment to a step
   */
  async addComment(stepId: number, data: StepCommentCreateRequest) {
    return await getStepActivityApi().addComment1(stepId, data);
  },

  /**
   * Update a comment
   */
  async updateComment(commentId: number, data: StepCommentCreateRequest) {
    return await getStepActivityApi().updateComment(commentId, data);
  },

  /**
   * Delete a comment
   */
  async deleteComment(commentId: number) {
    return await getStepActivityApi().deleteComment(commentId);
  },

  /**
   * Get discussion timeline (comments & attachments) for a step
   */
  async getDiscussionTimeline(stepId: number) {
    return await getStepActivityApi().getDiscussionTimeline(stepId);
  },

  /**
   * Get full timeline for a step
   */
  async getTimeline(stepId: number) {
    return await getStepActivityApi().getTimeline(stepId);
  },

  /**
   * Get attachments for a step
   */
  async getAttachments(stepId: number) {
    return await getStepActivityApi().getAttachments(stepId);
  },

  /**
   * Upload an attachment to a step
   */
  async uploadAttachment(
    stepId: number,
    file: File,
    type: UploadAttachment1TypeEnum = UploadAttachment1TypeEnum.General,
    description?: string
  ) {
    return await getStepActivityApi().uploadAttachment1(stepId, type, file, description);
  },

  /**
   * Rename an attachment
   */
  async renameAttachment(attachmentId: number, newFileName: string) {
    return await getStepActivityApi().renameAttachment(attachmentId, newFileName);
  },

  /**
   * Delete an attachment
   */
  async deleteAttachment(attachmentId: number) {
    return await getStepActivityApi().deleteAttachment(attachmentId);
  },
};

export default stepActivityService;
