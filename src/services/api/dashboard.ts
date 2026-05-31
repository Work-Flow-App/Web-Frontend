import { DashboardApi, Configuration } from '../../../workflow-api';
import type { FinancialSummaryResponse } from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type { FinancialSummaryResponse };

function getDashboardApi(): DashboardApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new DashboardApi(config, env.apiBaseUrl, axiosInstance);
}

export const dashboardService = {
  getFinancialSummary() {
    return getDashboardApi().dashboardGetFinancialSummary();
  },
};
