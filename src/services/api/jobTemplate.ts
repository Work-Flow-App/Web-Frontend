import { JobTemplateControllerApi, Configuration } from '../../../workflow-api';
import type {
  JobTemplateResponse,
  JobTemplateCreateRequest,
  JobTemplateFieldResponse,
  JobTemplateFieldCreateRequest,
  JobTemplateWithFieldsResponse,
} from '../../../workflow-api';
import { apiClient } from './client';

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
 * Get a configured JobTemplateControllerApi instance with the access token
 */
function getJobTemplateApi(): JobTemplateControllerApi {
  const accessToken = apiClient.getStoredAccessToken();
  const config = new Configuration({
    accessToken: accessToken || undefined,
  });
  return new JobTemplateControllerApi(config);
}

export const jobTemplateService = {
  /**
   * Get all job templates
   */
  async getAllTemplates() {
    return await getJobTemplateApi().getAll1();
  },

  /**
   * Get template by ID
   */
  async getTemplateById(id: number) {
    return await getJobTemplateApi().get1(id);
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
    return await getJobTemplateApi().create1(data);
  },

  /**
   * Update an existing template
   */
  async updateTemplate(id: number, data: JobTemplateCreateRequest) {
    return await getJobTemplateApi().update1(id, data);
  },

  /**
   * Delete a template
   */
  async deleteTemplate(id: number) {
    return await getJobTemplateApi().delete1(id);
  },

  /**
   * Get all fields for a template
   */
  async getTemplateFields(templateId: number) {
    return await getJobTemplateApi().getFields(templateId);
  },

  /**
   * Get a specific field
   */
  async getFieldById(fieldId: number) {
    return await getJobTemplateApi().getField(fieldId);
  },

  /**
   * Create a new field for a template
   */
  async createField(data: JobTemplateFieldCreateRequest) {
    return await getJobTemplateApi().createField(data);
  },

  /**
   * Update an existing field
   */
  async updateField(fieldId: number, data: JobTemplateFieldCreateRequest) {
    return await getJobTemplateApi().updateField(fieldId, data);
  },

  /**
   * Delete a field
   */
  async deleteField(fieldId: number) {
    return await getJobTemplateApi().deleteField(fieldId);
  },
};

export default jobTemplateService;
