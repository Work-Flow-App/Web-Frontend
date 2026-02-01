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

/**
 * Job Template API Service
 * Provides CRUD operations for job templates and template fields
 */

/**
 * Get a configured JobTemplatesApi instance with the access token
 * Note: Don't pass accessToken to Configuration - the axios interceptor handles it
 */
function getJobTemplateApi(): JobTemplatesApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new JobTemplatesApi(config, env.apiBaseUrl, axiosInstance);
}

export const jobTemplateService = {
  /**
   * Get all job templates
   */
  async getAllTemplates() {
    return await getJobTemplateApi().getAllTemplates();
  },

  /**
   * Get template by ID
   */
  async getTemplateById(id: number) {
    return await getJobTemplateApi().getTemplate(id);
  },

  /**
   * Get template with its fields
   */
  async getTemplateWithFields(id: number) {
    return await getJobTemplateApi().getTemplateWithFields(id);
  },

  /**
   * Create a new template
   */
  async createTemplate(data: JobTemplateCreateRequest) {
    return await getJobTemplateApi().createTemplate(data);
  },

  /**
   * Update an existing template
   */
  async updateTemplate(id: number, data: JobTemplateCreateRequest) {
    return await getJobTemplateApi().updateTemplate(id, data);
  },

  /**
   * Delete a template
   */
  async deleteTemplate(id: number) {
    return await getJobTemplateApi().deleteTemplate(id);
  },

  /**
   * Get all fields for a template
   */
  async getTemplateFields(templateId: number) {
    return await getJobTemplateApi().getTemplateFields(templateId);
  },

  /**
   * Get a specific field
   */
  async getFieldById(fieldId: number) {
    return await getJobTemplateApi().getTemplateField(fieldId);
  },

  /**
   * Create a new field for a template
   */
  async createField(data: JobTemplateFieldCreateRequest) {
    return await getJobTemplateApi().createTemplateField(data);
  },

  /**
   * Update an existing field
   */
  async updateField(fieldId: number, data: JobTemplateFieldCreateRequest) {
    return await getJobTemplateApi().updateTemplateField(fieldId, data);
  },

  /**
   * Delete a field
   */
  async deleteField(fieldId: number) {
    return await getJobTemplateApi().deleteTemplateField(fieldId);
  },
};

export default jobTemplateService;
