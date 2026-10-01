import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { queries } from '../../services/queries';
import type { JobResponse, JobWorkflowStepResponse, StepActivityResponse } from '../../services/api';
import type { RecentWorkflowActivityData } from './components/Dashboard';
import type { PlaceDetails } from '../../components/UI/GoogleMap/GoogleMap.types';
import { prepareJobLocationMarkers } from '../../utils/mapDataHelpers';

/**
 * Dashboard widgets whose data is derived from several API calls. Each one is
 * its own query so a slow widget (e.g. map geocoding) never holds up another,
 * and the underlying list/per-job requests are shared through `queries`.
 *
 * TODO: replace with the single-request endpoints in the "Dashboard API Ticket"
 * (recent-workflow-activity, job-locations) once the backend ships them.
 */

const RECENT_JOBS_SCANNED = 10;
const MAX_ACTIVITIES = 10;

async function loadRecentWorkflowActivity(queryClient: QueryClient): Promise<RecentWorkflowActivityData[]> {
  const activeJobs = await queryClient.fetchQuery(queries.jobs());

  // Fetch workflows and step activities for the most recently updated jobs
  const targetJobs = [...activeJobs]
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, RECENT_JOBS_SCANNED);

  const workflowResults = await Promise.all(
    targetJobs.map((j) => queryClient.fetchQuery(queries.jobWorkflow(j.id!)).catch(() => null))
  );

  // For each workflow, gather active/non-skipped steps and fetch their activity timelines
  const stepTimelinePromises: Promise<{
    job: JobResponse;
    workflowName: string;
    step: JobWorkflowStepResponse;
    timeline: StepActivityResponse[];
  }>[] = [];

  workflowResults.forEach((jw, idx) => {
    if (!jw) return;
    const job = targetJobs[idx];
    const workflowName = job.workflowName || job.templateName || 'Workflow';
    const activeSteps = (jw.steps || []).filter(
      (s: JobWorkflowStepResponse) => s.id && s.status?.toUpperCase() !== 'SKIPPED'
    );

    activeSteps.forEach((step: JobWorkflowStepResponse) => {
      stepTimelinePromises.push(
        queryClient
          .fetchQuery(queries.stepTimeline(step.id!))
          .catch((): StepActivityResponse[] => [])
          .then((timeline) => ({ job, workflowName, step, timeline }))
      );
    });
  });

  const stepTimelineResults = await Promise.all(stepTimelinePromises);

  const activities: RecentWorkflowActivityData[] = [];
  const jobsWithActivities = new Set<number>();

  stepTimelineResults.forEach(({ job, workflowName, step, timeline }) => {
    timeline.forEach((act) => {
      jobsWithActivities.add(job.id || 0);
      activities.push({
        id: act.id,
        jobId: job.id || 0,
        jobRef: job.jobRef || job.id || 0,
        workflowName,
        stepId: step.id,
        stepName: step.name || 'Step',
        activityType: act.type,
        message: act.message,
        actorUsername: act.actorUsername,
        status: step.status?.toLowerCase() || 'pending',
        updatedAt: act.createdAt || step.updatedAt || job.updatedAt || job.createdAt || '',
      });
    });
  });

  // Fallback: If any target job produced 0 timeline activities from its steps, add its active step
  targetJobs.forEach((job, idx) => {
    if (jobsWithActivities.has(job.id || 0)) return;
    const jw = workflowResults[idx];
    if (!jw || !jw.steps || jw.steps.length === 0) return;

    const activeStep =
      jw.steps.find((s: JobWorkflowStepResponse) => s.status === 'STARTED' || s.status === 'ONGOING') ||
      jw.steps.find((s: JobWorkflowStepResponse) => s.status === 'NOT_STARTED') ||
      jw.steps[jw.steps.length - 1];

    activities.push({
      jobId: job.id || 0,
      jobRef: job.jobRef || job.id || 0,
      workflowName: job.workflowName || job.templateName || 'Workflow',
      stepId: activeStep?.id,
      stepName: activeStep?.name || 'Start',
      activityType: 'STATUS_CHANGED',
      message: `Status: ${activeStep?.status || 'Pending'}`,
      status: activeStep?.status?.toLowerCase() || 'pending',
      updatedAt: job.updatedAt || job.createdAt || '',
    });
  });

  // Sort final activities desc by date and keep top 10
  activities.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return activities.slice(0, MAX_ACTIVITIES);
}

async function loadJobLocationMarkers(queryClient: QueryClient): Promise<PlaceDetails[]> {
  const [jobs, workers, clients, customers] = await Promise.all([
    queryClient.fetchQuery(queries.jobs()),
    queryClient.fetchQuery(queries.workers()).catch(() => []),
    queryClient.fetchQuery(queries.clients()).catch(() => []),
    queryClient.fetchQuery(queries.customers()).catch(() => []),
  ]);
  return prepareJobLocationMarkers(jobs, workers, clients, customers);
}

export function useRecentWorkflowActivity(enabled: boolean) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['dashboard', 'recent-workflow-activity'],
    queryFn: () => loadRecentWorkflowActivity(queryClient),
    enabled,
  });
}

export function useJobLocationMarkers(enabled: boolean) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['dashboard', 'job-location-markers'],
    queryFn: () => loadJobLocationMarkers(queryClient),
    enabled,
  });
}
