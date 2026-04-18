import { WorkflowStepVisitLogsApi, Configuration } from '../../../workflow-api';
import type {
  StepVisitLogCreateRequest,
  StepVisitLogResponse,
  StepVisitLogSummaryResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  StepVisitLogCreateRequest,
  StepVisitLogResponse,
  StepVisitLogSummaryResponse,
};

function getVisitLogApi(): WorkflowStepVisitLogsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new WorkflowStepVisitLogsApi(config, env.apiBaseUrl, axiosInstance);
}

export const visitLogService = {
  async getVisitLogs(stepId: number) {
    return await getVisitLogApi().jobWorkflowStepVisitLogGetVisitLogs(stepId);
  },

  async addVisitLog(stepId: number, data: StepVisitLogCreateRequest) {
    return await getVisitLogApi().jobWorkflowStepVisitLogAddVisitLog(stepId, data);
  },

  async updateVisitLog(visitLogId: number, data: StepVisitLogCreateRequest) {
    return await getVisitLogApi().jobWorkflowStepVisitLogUpdateVisitLog(visitLogId, data);
  },

  async deleteVisitLog(visitLogId: number) {
    return await getVisitLogApi().jobWorkflowStepVisitLogDeleteVisitLog(visitLogId);
  },
};

export default visitLogService;
