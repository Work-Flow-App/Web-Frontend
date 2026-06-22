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

export const jobService = {
  async getAllJobs(): Promise<{ data: any[] }> {
    const res = await getJobApi().jobGetAll({ page: 0, size: 1000, sort: ['createdAt,desc'] });
    return { ...res, data: (res.data as any).content || res.data };
  },
  async getArchivedJobs(): Promise<{ data: any[] }> {
    const res = await getJobApi().jobGetArchived();
    return { ...res, data: (res.data as any).content || res.data };
  },
  async getJobsByTemplate(templateId: number): Promise<{ data: any[] }> {
    const res = await getJobApi().jobGetJobsByTemplate(templateId);
    return { ...res, data: (res.data as any).content || res.data };
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
