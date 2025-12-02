import { createCompanyApi } from './factories';
import type {
  CompanyProfileResponse,
  CompanyProfileUpdateRequest,
  CompanyDashboardResponse,
} from '../../../workflow-api';

// Export types from workflowapi
export type { CompanyProfileResponse, CompanyProfileUpdateRequest, CompanyDashboardResponse };

/**
 * Company API Service
 * Provides company management operations
 */

export const companyService = {
  /**
   * Get company profile
   */
  async getProfile() {
    return await createCompanyApi().getProfile();
  },

  /**
   * Update company profile
   */
  async updateProfile(data: CompanyProfileUpdateRequest) {
    return await createCompanyApi().updateProfile(data);
  },

  /**
   * Get company dashboard
   */
  async getDashboard() {
    return await createCompanyApi().getDashboard();
  },
};

export default companyService;
