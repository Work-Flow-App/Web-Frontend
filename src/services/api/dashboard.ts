import { DashboardApi, Configuration } from '../../../workflow-api';
import type {
  DashboardPreferencesResponse,
  DashboardPreferencesUpdateRequest,
  FinancialSummaryResponse,
  JobLocationResponse,
  JobStatsResponse,
  QuickActionPreference,
  RecentWorkflowActivityResponse,
  WidgetPreference,
  WorkflowEventJobResponse,
  WorkflowEventsResponse,
} from '../../../workflow-api';
import { env } from '../../config/env';
import { axiosInstance } from './axiosConfig';

export type {
  DashboardPreferencesResponse,
  DashboardPreferencesUpdateRequest,
  FinancialSummaryResponse,
  JobLocationResponse,
  JobStatsResponse,
  QuickActionPreference,
  RecentWorkflowActivityResponse,
  WidgetPreference,
  WorkflowEventJobResponse,
  WorkflowEventsResponse,
};

function getDashboardApi(): DashboardApi {
  const config = new Configuration({ basePath: env.apiBaseUrl });
  return new DashboardApi(config, env.apiBaseUrl, axiosInstance);
}

export const dashboardService = {
  getFinancialSummary() {
    return getDashboardApi().dashboardGetFinancialSummary();
  },
  getJobStats() {
    return getDashboardApi().dashboardGetJobStats();
  },
  getJobLocations() {
    return getDashboardApi().dashboardGetJobLocations();
  },
  getRecentWorkflowActivity(limit?: number) {
    return getDashboardApi().dashboardGetRecentWorkflowActivity(limit);
  },
  getWorkflowEvents(workflowId?: number) {
    return getDashboardApi().dashboardGetWorkflowEvents(workflowId);
  },
  getPreferences() {
    return getDashboardApi().dashboardGetPreferences();
  },
  updatePreferences(preferences: DashboardPreferencesUpdateRequest) {
    return getDashboardApi().dashboardUpdatePreferences(preferences);
  },
};
