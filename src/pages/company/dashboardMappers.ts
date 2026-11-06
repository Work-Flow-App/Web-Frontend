import type {
  JobLocationResponse,
  RecentWorkflowActivityResponse,
  WorkflowEventJobResponse,
  WorkflowEventsResponse,
} from '../../services/api';
import type { PlaceDetails } from '../../components/UI/GoogleMap/GoogleMap.types';
import { floowColors } from '../../theme/colors';
import type { RecentWorkflowActivityData } from './components/Dashboard';

// ─── Recent workflow activity ─────────────────────────────────────────────────

export function toRecentWorkflowActivity(activity: RecentWorkflowActivityResponse): RecentWorkflowActivityData {
  return {
    id: activity.activityId,
    jobId: activity.jobId ?? 0,
    jobRef: activity.jobRef ?? activity.jobId ?? 0,
    workflowName: activity.workflowName ?? 'Workflow',
    stepId: activity.stepId,
    stepName: activity.stepName ?? 'Step',
    activityType: activity.activityType,
    message: activity.message,
    actorUsername: activity.actorUsername,
    status: activity.stepStatus?.toLowerCase() ?? 'pending',
    updatedAt: activity.createdAt ?? '',
  };
}

// ─── Job locations ────────────────────────────────────────────────────────────

export function toJobLocationMarkers(locations: JobLocationResponse[]): PlaceDetails[] {
  return locations.flatMap((job) => {
    if (job.lat == null || job.lng == null) return [];

    const jobRef = job.jobRef ?? job.jobId ?? 0;
    return {
      address: job.address ?? '',
      name: `Job #${jobRef}`,
      location: { lat: job.lat, lng: job.lng },
      jobLocationData: {
        jobId: jobRef,
        status: job.status ?? 'UNKNOWN',
        clientName: job.clientName,
        customerName: job.customerName,
        workerName: job.workerNames?.join(', ') || undefined,
      },
    };
  });
}

// ─── Workflow events ──────────────────────────────────────────────────────────

export interface StepEventGroup {
  stepName: string;
  orderIndex: number;
  count: number;
  color: string;
  jobs: WorkflowEventJobResponse[];
}

const STEP_COLORS = [
  floowColors.info.main, // #2196F3 — blue
  floowColors.warning.main, // #FFA500 — orange
  floowColors.chart.quaternary, // #ff9800 — amber
  floowColors.success.main, // #00A63E — green
  floowColors.indigo.main, // #6366F1 — purple
  floowColors.grey[500], // #737373 — gray
  floowColors.error.main, // #FB2C36 — red
  floowColors.chart.primary, // #3f51b5 — indigo
];

function getStepColor(index: number): string {
  return STEP_COLORS[index % STEP_COLORS.length];
}

/**
 * Template steps come first so a step with no jobs still shows in the pipeline
 * and keeps its colour; job groups are then laid over them by step name.
 */
export function toStepEventGroups(events: WorkflowEventsResponse): StepEventGroup[] {
  const groupMap = new Map<string, StepEventGroup>();

  const templateSteps = [...(events.templateSteps ?? [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  templateSteps.forEach((step, index) => {
    const name = step.name ?? `Step ${index + 1}`;
    if (!groupMap.has(name)) {
      groupMap.set(name, {
        stepName: name,
        orderIndex: step.orderIndex ?? index,
        count: 0,
        color: getStepColor(index),
        jobs: [],
      });
    }
  });

  (events.groups ?? []).forEach((group) => {
    const name = group.stepName ?? 'Unknown';
    if (!groupMap.has(name)) {
      groupMap.set(name, {
        stepName: name,
        orderIndex: group.orderIndex ?? 999,
        count: 0,
        color: getStepColor(groupMap.size),
        jobs: [],
      });
    }
    const target = groupMap.get(name)!;
    const jobs = group.jobs ?? [];
    target.count += group.jobCount ?? jobs.length;
    target.jobs.push(...jobs);
  });

  return Array.from(groupMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}
