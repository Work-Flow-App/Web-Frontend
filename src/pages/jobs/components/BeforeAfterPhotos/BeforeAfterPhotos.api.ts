import {
  stepActivityService,
  UploadAttachmentTypeEnum,
  workerJobWorkflowService,
  WorkerJobWorkflowUploadAttachmentTypeEnum,
} from '../../../../services/api';
import type { StepAttachmentResponse, StepCommentResponse } from '../../../../services/api';
import { StepCommentCreateRequestTypeEnum } from '../../../../../workflow-api';

/** The step activity calls the before/after photos need; company users and workers reach them through different endpoints. */
export interface BeforeAfterPhotosApi {
  uploadPhoto: (stepId: number, file: File, description: string) => Promise<StepAttachmentResponse>;
  /** Missing when the user can't delete attachments. */
  deletePhoto?: (attachmentId: number) => Promise<void>;
  getComments: (stepId: number) => Promise<StepCommentResponse[]>;
  addComment: (stepId: number, content: string) => Promise<void>;
}

export const companyBeforeAfterPhotosApi: BeforeAfterPhotosApi = {
  uploadPhoto: async (stepId, file, description) =>
    (await stepActivityService.uploadAttachment(stepId, file, UploadAttachmentTypeEnum.General, description)).data,
  deletePhoto: async (attachmentId) => {
    await stepActivityService.deleteAttachment(attachmentId);
  },
  getComments: async (stepId) => (await stepActivityService.getComments(stepId)).data || [],
  addComment: async (stepId, content) => {
    await stepActivityService.addComment(stepId, { content, type: StepCommentCreateRequestTypeEnum.General });
  },
};

export const workerBeforeAfterPhotosApi: BeforeAfterPhotosApi = {
  uploadPhoto: async (stepId, file, description) =>
    (
      await workerJobWorkflowService.uploadAttachment(
        stepId,
        file,
        WorkerJobWorkflowUploadAttachmentTypeEnum.General,
        description
      )
    ).data,
  getComments: async (stepId) => (await workerJobWorkflowService.getStepComments(stepId)).data || [],
  addComment: async (stepId, content) => {
    await workerJobWorkflowService.addComment(stepId, { content, type: StepCommentCreateRequestTypeEnum.General });
  },
};
