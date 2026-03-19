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
  async getAllJobs() {
    return await getJobApi().jobGetAll();
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

  async deleteJob(id: number) {
    return await getJobApi().jobDelete(id);
  },
};

export default jobService;
