import type { JobResponse, JobWorkflowResponse, WorkflowStepResponse } from '../../../services/api';

/**
 * Normalizes status strings for safe comparison (handles undefined, null, case differences).
 */
const normalizeStatus = (status?: string | null): string => status?.toUpperCase().trim() || '';

const isCompleteStatus = (status: string): boolean =>
  status === 'COMPLETED' || status === 'SKIPPED';

const isOngoingStatus = (status: string): boolean =>
  status === 'ONGOING' || status === 'STARTED' || status === 'IN_PROGRESS' || status === 'PROGRESS';

/**
 * Determine the current step name for a job based on the business rules:
 * 1. When just created (NEW / no steps progressed): show the first step.
 * 2. When complete (job/workflow completed, or all steps done): show the last step.
 * 3. Mid-time (ongoing / in-progress): show the most recent ongoing/started step,
 *    or the next pending step if transitioning.
 * 
 * If a runtime jobWorkflow instance is not available (e.g. newly created job or pending start),
 * templateSteps will be used as baseline to guarantee the correct step name is displayed.
 */
export function getCurrentStepName(
  job?: JobResponse | null,
  jobWorkflow?: JobWorkflowResponse | null,
  templateSteps?: WorkflowStepResponse[] | null
): string {
  // 1. If runtime jobWorkflow has steps, use them with full live status tracking
  if (jobWorkflow?.steps && jobWorkflow.steps.length > 0) {
    const sortedSteps = [...jobWorkflow.steps].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );

    const firstStep = sortedSteps[0];
    const lastStep = sortedSteps[sortedSteps.length - 1];

    const jobStatus = normalizeStatus(job?.status);
    const workflowStatus = normalizeStatus(jobWorkflow?.status);

    // Rule 2: When complete -> show the last step
    const isJobCompleted = jobStatus === 'COMPLETED';
    const isWorkflowCompleted = workflowStatus === 'COMPLETED';
    const areAllStepsCompleted = sortedSteps.every((s) => isCompleteStatus(normalizeStatus(s.status)));

    if (isJobCompleted || isWorkflowCompleted || areAllStepsCompleted) {
      return lastStep?.name || '-';
    }

    // Rule 3 (Active ongoing): Check if any step is currently marked ONGOING / STARTED / IN_PROGRESS
    // We check this BEFORE checking initial state so that even if job.status in DB is still 'NEW',
    // an updated ongoing step will immediately be displayed as the current step!
    const ongoingSteps = sortedSteps.filter((s) => isOngoingStatus(normalizeStatus(s.status)));

    if (ongoingSteps.length > 0) {
      // Pick the most recent ongoing step:
      // If startedAt timestamps exist and differ, use the latest timestamp.
      // Otherwise, pick the one with highest orderIndex (further along in the workflow).
      const sortedByRecent = [...ongoingSteps].sort((a, b) => {
        if (a.startedAt && b.startedAt) {
          const timeA = new Date(a.startedAt).getTime();
          const timeB = new Date(b.startedAt).getTime();
          if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
            return timeB - timeA;
          }
        }
        return (b.orderIndex ?? 0) - (a.orderIndex ?? 0);
      });
      return sortedByRecent[0]?.name || '-';
    }

    // Rule 3 (Transitioning / Mid-time): Check if any steps have been completed,
    // in which case the current step is the next pending / non-completed step.
    const hasCompletedSteps = sortedSteps.some((s) => normalizeStatus(s.status) === 'COMPLETED');
    if (hasCompletedSteps) {
      const nextPendingStep = sortedSteps.find((s) => !isCompleteStatus(normalizeStatus(s.status)));
      if (nextPendingStep) {
        return nextPendingStep.name || '-';
      }
      return lastStep?.name || '-';
    }

    // Rule 1: When just created (no steps completed, none ongoing): show the first step
    return firstStep?.name || '-';
  }

  // 2. If runtime jobWorkflow has not yet been initialized, use template steps
  if (templateSteps && templateSteps.length > 0) {
    const sortedTemplateSteps = [...templateSteps].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );

    const jobStatus = normalizeStatus(job?.status);
    // If job is completed, show last step of template
    if (jobStatus === 'COMPLETED') {
      return sortedTemplateSteps[sortedTemplateSteps.length - 1]?.name || '-';
    }

    // Default for newly created / in-progress job without runtime steps yet -> first step
    return sortedTemplateSteps[0]?.name || '-';
  }

  return '-';
}
