import type {
  JobLocationResponse,
  JobResponse,
  RecentWorkflowActivityResponse,
  WorkflowEventJobResponse,
  WorkflowEventsResponse,
} from '../../services/api';
import type { Location, PlaceDetails } from '../../components/UI/GoogleMap/GoogleMap.types';
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

/**
 * `job-locations` omits jobs with no stored coordinates, so place the ones that
 * have an address from that address. One at a time to stay within Google's rate limit.
 */
export async function geocodeJobsWithoutCoordinates(
  jobs: JobResponse[],
  geocode: (address: string) => Promise<Location | null>
): Promise<JobLocationResponse[]> {
  const located: JobLocationResponse[] = [];

  for (const job of jobs) {
    const stored = job.address;
    if (!stored || (stored.latitude != null && stored.longitude != null)) continue;

    const address = [stored.street, stored.city, stored.state, stored.postalCode, stored.country]
      .filter(Boolean)
      .join(', ');
    if (!address) continue;

    const location = await geocode(address);
    if (!location) continue;

    located.push({
      jobId: job.id,
      jobRef: job.jobRef,
      status: job.status,
      lat: location.lat,
      lng: location.lng,
      address,
      clientName: job.clientName,
      customerName: job.customerName,
    });
  }

  return located;
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

/** The server lists every step in pipeline order, including steps with no jobs. */
export function toStepEventGroups(events: WorkflowEventsResponse): StepEventGroup[] {
  return (events.groups ?? []).map((group, index) => {
    const jobs = group.jobs ?? [];
    return {
      stepName: group.stepName ?? `Step ${index + 1}`,
      orderIndex: group.orderIndex ?? index,
      count: group.jobCount ?? jobs.length,
      color: getStepColor(index),
      jobs,
    };
  });
}
