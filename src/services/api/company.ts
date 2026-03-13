import { CompanyApi, Configuration } from '../../../workflow-api';
import type {
  CompanyProfileResponse,
  CompanyProfileUpdateRequest,
  CompanyDashboardResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { CompanyProfileResponse, CompanyProfileUpdateRequest, CompanyDashboardResponse };

function getCompanyApi(): CompanyApi {
  const config = new Configuration({
    basePath: env.apiBaseUrl,
  });
  return new CompanyApi(config, env.apiBaseUrl, axiosInstance);
}

export const companyService = {
  /**
   * Get company profile
   */
  async getProfile() {
    return await getCompanyApi().getProfile();
  },

  /**
   * Update company profile
   */
  async updateProfile(data: CompanyProfileUpdateRequest) {
    return await getCompanyApi().updateProfile(data);
  },

  /**
   * Get company dashboard stats
   */
  async getDashboard() {
    return await getCompanyApi().getDashboard();
  },
};

export default companyService;
