import { JobTemplatesApi, Configuration } from '../../../workflow-api';
import type {
  JobTemplateResponse,
  JobTemplateCreateRequest,
  JobTemplateFieldResponse,
  JobTemplateFieldCreateRequest,
  JobTemplateWithFieldsResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  JobTemplateResponse,
  JobTemplateCreateRequest,
  JobTemplateFieldResponse,
  JobTemplateFieldCreateRequest,
  JobTemplateWithFieldsResponse,
};

function getJobTemplateApi(): JobTemplatesApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new JobTemplatesApi(config, env.apiBaseUrl, axiosInstance);
}

export const jobTemplateService = {
  async getAllTemplates() {
    return await getJobTemplateApi().jobTemplateGetAllTemplates();
  },

  async getTemplateById(id: number) {
    return await getJobTemplateApi().jobTemplateGetTemplate(id);
  },

  async getTemplateWithFields(id: number) {
    return await getJobTemplateApi().jobTemplateGetTemplateWithFields(id);
  },

  async createTemplate(data: JobTemplateCreateRequest) {
    return await getJobTemplateApi().jobTemplateCreateTemplate(data);
  },

  async updateTemplate(id: number, data: JobTemplateCreateRequest) {
    return await getJobTemplateApi().jobTemplateUpdateTemplate(id, data);
  },

  async deleteTemplate(id: number) {
    return await getJobTemplateApi().jobTemplateDeleteTemplate(id);
  },

  async getTemplateFields(templateId: number) {
    return await getJobTemplateApi().jobTemplateGetTemplateFields(templateId);
  },

  async getFieldById(fieldId: number) {
    return await getJobTemplateApi().jobTemplateGetTemplateField(fieldId);
  },

  async createField(data: JobTemplateFieldCreateRequest) {
    return await getJobTemplateApi().jobTemplateCreateTemplateField(data);
  },

  async updateField(fieldId: number, data: JobTemplateFieldCreateRequest) {
    return await getJobTemplateApi().jobTemplateUpdateTemplateField(fieldId, data);
  },

  async deleteField(fieldId: number) {
    return await getJobTemplateApi().jobTemplateDeleteTemplateField(fieldId);
  },
};

export default jobTemplateService;
