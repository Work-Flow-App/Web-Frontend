import { createJobTemplateApi } from './factories';
import type {
  JobTemplateResponse,
  JobTemplateCreateRequest,
  JobTemplateWithFieldsResponse,
} from '../../../workflow-api';

// Export types from workflowapi
export type { JobTemplateResponse, JobTemplateCreateRequest, JobTemplateWithFieldsResponse };

/**
 * Job Template API Service
 * Provides job template management operations
 */

export const jobTemplateService = {
  /**
   * Get all job templates
   */
  async getAllTemplates() {
    return await createJobTemplateApi().getAllTemplates();
  },

  /**
   * Get job template by ID
   */
  async getTemplate(id: number) {
    return await createJobTemplateApi().getTemplate(id);
  },

  /**
   * Get job template with fields by ID
   */
  async getTemplateWithFields(id: number) {
    return await createJobTemplateApi().getTemplateWithFields(id);
  },

  /**
   * Get template fields
   */
  async getTemplateFields(id: number) {
    return await createJobTemplateApi().getTemplateFields(id);
  },

  /**
   * Create a new job template
   */
  async createTemplate(data: JobTemplateCreateRequest) {
    return await createJobTemplateApi().createTemplate(data);
  },

  /**
   * Update job template
   */
  async updateTemplate(id: number, data: JobTemplateCreateRequest) {
    return await createJobTemplateApi().updateTemplate(id, data);
  },

  /**
   * Delete a job template
   */
  async deleteTemplate(id: number) {
    return await createJobTemplateApi().deleteTemplate(id);
  },

  /**
   * Create template field
   */
  async createTemplateField(data: any) {
    return await createJobTemplateApi().createTemplateField(data);
  },

  /**
   * Delete template field
   */
  async deleteTemplateField(fieldId: number) {
    return await createJobTemplateApi().deleteTemplateField(fieldId);
  },

  /**
   * Get template field
   */
  async getTemplateField(fieldId: number) {
    return await createJobTemplateApi().getTemplateField(fieldId);
  },

  /**
   * Update template field
   */
  async updateTemplateField(fieldId: number, data: any) {
    return await createJobTemplateApi().updateTemplateField(fieldId, data);
  },
};

export default jobTemplateService;
