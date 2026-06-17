import { JobsApi, Configuration } from '../../../workflow-api';
import type {
  JobResponse,
  JobCreateRequest,
  JobUpdateRequest,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { JobResponse, JobCreateRequest, JobUpdateRequest };

function getJobApi(): JobsApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new JobsApi(config, env.apiBaseUrl, axiosInstance);
}

export interface JobFilterOptions {
  search?: string;
  customerName?: string;
  clientName?: string;
  workflowName?: string;
  templateName?: string;
  status?: any;
  archived?: boolean;
  minNet?: number;
  maxNet?: number;
  startDate?: string;
  endDate?: string;
}

export const jobService = {
  async getAllJobs(filters?: JobFilterOptions) {
    const response = await getJobApi().jobGetAll(
      { page: 0, size: 1000, sort: ['createdAt,desc'] },
      filters?.search,
      filters?.customerName,
      filters?.clientName,
      filters?.workflowName,
      filters?.templateName,
      filters?.status,
      filters?.archived,
      filters?.minNet,
      filters?.maxNet,
      filters?.startDate,
      filters?.endDate
    );
    return { ...response, data: response.data?.content ?? [] };
  },

  async getArchivedJobs() {
    return await getJobApi().jobGetArchived();
  },

  async getJobsByTemplate(templateId: number) {
    return await getJobApi().jobGetJobsByTemplate(templateId);
  },

  async getJobById(id: number) {
    return await getJobApi().jobGet(id);
  },

  async createJob(data: JobCreateRequest) {
    return await getJobApi().jobCreate(data);
  },

  async updateJob(id: number, data: JobUpdateRequest) {
    return await getJobApi().jobUpdate(id, data);
  },

  async archiveJob(id: number) {
    return await getJobApi().jobArchive(id);
  },

  async deleteJob(id: number) {
    return await getJobApi().jobDelete(id);
  },
};

export default jobService;
