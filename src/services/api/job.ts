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
  async getAllJobs(): Promise<{ data: JobResponse[] }> {
    const res = await getJobApi().jobGetAll({ page: 0, size: 1000, sort: ['createdAt,desc'] });
    // Generated type says PagedModelJobResponse but the API returns Array<JobResponse> at runtime
    return { ...res, data: res.data as unknown as JobResponse[] };
  },

  async getArchivedJobs(): Promise<{ data: JobResponse[] }> {
    const res = await getJobApi().jobGetArchived();
    return { ...res, data: res.data as JobResponse[] };
  },

  async getJobsByTemplate(templateId: number): Promise<{ data: JobResponse[] }> {
    const res = await getJobApi().jobGetJobsByTemplate(templateId);
    return { ...res, data: res.data as JobResponse[] };
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
