import { queryOptions } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import {
  companyService,
  companyClientService,
  customerService,
  dashboardService,
  jobService,
  jobWorkflowService,
  stepActivityService,
  workerJobWorkflowService,
  workerService,
  workflowService,
} from './api';
import type { JobWorkflowResponse, StepActivityResponse, WorkflowStepResponse } from './api';

/**
 * Shared query definitions. Components that need the same data must use the
 * same entry here so TanStack Query de-duplicates the request and shares the
 * cached result (e.g. the dashboard page and the Workfloow Event widget both
 * read `queries.jobs()`).
 */
export const queries = {
  companyProfile: () =>
    queryOptions({
      queryKey: ['company', 'profile'],
      queryFn: async () => (await companyService.getProfile()).data,
    }),

  companyPosts: () =>
    queryOptions({
      queryKey: ['company', 'posts'],
      queryFn: async () => (await companyService.getPosts()).data ?? [],
    }),

  financialSummary: () =>
    queryOptions({
      queryKey: ['dashboard', 'financial-summary'],
      queryFn: async () => (await dashboardService.getFinancialSummary()).data,
    }),

  jobs: () =>
    queryOptions({
      queryKey: ['jobs', 'list'],
      queryFn: async () => (await jobService.getAllJobs()).data ?? [],
    }),

  archivedJobs: () =>
    queryOptions({
      queryKey: ['jobs', 'archived'],
      queryFn: async () => (await jobService.getArchivedJobs()).data ?? [],
    }),

  workers: () =>
    queryOptions({
      queryKey: ['workers', 'list'],
      queryFn: async () => (await workerService.getAllWorkers()).data ?? [],
    }),

  clients: () =>
    queryOptions({
      queryKey: ['clients', 'list'],
      queryFn: async () => (await companyClientService.getAllClients()).data ?? [],
    }),

  customers: () =>
    queryOptions({
      queryKey: ['customers', 'list'],
      queryFn: async () => (await customerService.getAllCustomers()).data ?? [],
    }),

  workflows: () =>
    queryOptions({
      queryKey: ['workflows', 'list'],
      queryFn: async () => {
        const res = await workflowService.getAllWorkflows();
        return Array.isArray(res.data) ? res.data : [];
      },
    }),

  workflowSteps: (workflowId: number) =>
    queryOptions({
      queryKey: ['workflows', workflowId, 'steps'],
      queryFn: async (): Promise<WorkflowStepResponse[]> => {
        const res = await workflowService.getWorkflowSteps(workflowId);
        return Array.isArray(res.data) ? res.data : [];
      },
    }),

  /** Resolves to null when the job has no workflow (404), so that result is cached too. */
  jobWorkflow: (jobId: number) =>
    queryOptions({
      queryKey: ['job-workflows', jobId],
      queryFn: async (): Promise<JobWorkflowResponse | null> => {
        try {
          return (await jobWorkflowService.getJobWorkflowByJobId(jobId)).data ?? null;
        } catch (err) {
          if (isAxiosError(err) && err.response?.status === 404) return null;
          throw err;
        }
      },
    }),

  stepTimeline: (stepId: number) =>
    queryOptions({
      queryKey: ['job-workflow-steps', stepId, 'timeline'],
      queryFn: async (): Promise<StepActivityResponse[]> =>
        ((await stepActivityService.getTimeline(stepId)).data ?? []) as StepActivityResponse[],
    }),

  myAssignedSteps: () =>
    queryOptions({
      queryKey: ['worker', 'assigned-steps'],
      queryFn: async () => (await workerJobWorkflowService.getMyAssignedSteps()).data ?? [],
    }),
};
