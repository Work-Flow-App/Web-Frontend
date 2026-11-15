import { queryOptions } from '@tanstack/react-query';
import {
  companyService,
  dashboardService,
  jobService,
  workerJobWorkflowService,
  workflowService,
} from './api';

/**
 * Shared query definitions. Components that need the same data must use the
 * same entry here so TanStack Query de-duplicates the request and shares the
 * cached result (e.g. the dashboard page and the Workfloow Event widget both
 * read `queries.jobStats()`).
 */
export const queries = {
  companyProfile: () =>
    queryOptions({
      queryKey: ['company', 'profile'],
      queryFn: async () => (await companyService.getProfile()).data,
    }),

  companyPosts: (size?: number) =>
    queryOptions({
      queryKey: ['company', 'posts', size],
      queryFn: async () => (await companyService.getPosts(undefined, size)).data ?? [],
    }),

  financialSummary: () =>
    queryOptions({
      queryKey: ['dashboard', 'financial-summary'],
      queryFn: async () => (await dashboardService.getFinancialSummary()).data,
    }),

  jobStats: () =>
    queryOptions({
      queryKey: ['dashboard', 'job-stats'],
      queryFn: async () => (await dashboardService.getJobStats()).data,
    }),

  recentWorkflowActivity: (limit: number) =>
    queryOptions({
      queryKey: ['dashboard', 'recent-workflow-activity', limit],
      queryFn: async () => (await dashboardService.getRecentWorkflowActivity(limit)).data ?? [],
    }),

  jobLocations: () =>
    queryOptions({
      queryKey: ['dashboard', 'job-locations'],
      queryFn: async () => (await dashboardService.getJobLocations()).data ?? [],
    }),

  workflowEvents: (workflowId: number) =>
    queryOptions({
      queryKey: ['dashboard', 'workflow-events', workflowId],
      queryFn: async () => (await dashboardService.getWorkflowEvents(workflowId)).data,
    }),

  dashboardPreferences: () =>
    queryOptions({
      queryKey: ['dashboard', 'preferences'],
      queryFn: async () => (await dashboardService.getPreferences()).data,
    }),

  recentlyUpdatedJobs: (size: number) =>
    queryOptions({
      queryKey: ['jobs', 'recently-updated', size],
      queryFn: async () =>
        (await jobService.getAllJobs(undefined, { page: 0, size, sort: ['updatedAt,desc'] })).data,
    }),

  newestInProgressJobs: (size: number) =>
    queryOptions({
      queryKey: ['jobs', 'newest-in-progress', size],
      queryFn: async () =>
        (await jobService.getAllJobs({ status: 'IN_PROGRESS' }, { page: 0, size, sort: ['createdAt,desc'] })).data,
    }),

  workflows: () =>
    queryOptions({
      queryKey: ['workflows', 'list'],
      queryFn: async () => {
        const res = await workflowService.getAllWorkflows();
        return Array.isArray(res.data) ? res.data : [];
      },
    }),

  myAssignedSteps: () =>
    queryOptions({
      queryKey: ['worker', 'assigned-steps'],
      queryFn: async () => (await workerJobWorkflowService.getMyAssignedSteps()).data ?? [],
    }),
};
