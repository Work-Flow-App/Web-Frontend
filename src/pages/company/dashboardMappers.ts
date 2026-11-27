import type {
  JobLocationResponse,
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

const hasCoordinates = (job: JobLocationResponse): job is JobLocationResponse & Location =>
  job.lat != null && job.lng != null;

// DATE fields arrive as ISO-8601 local date-time, e.g. 2026-11-16T10:00:00
const ISO_LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;

/**
 * "16 Nov 2026, 10:00" for a date-time, or "16 Nov 2026" at midnight, since DATE
 * fields are entered without a time. Values from other field types are shown as entered.
 */
function formatScheduledTime(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;

  const match = ISO_LOCAL_DATE_TIME.exec(value);
  if (!match) return value;

  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const hasTime = hour !== 0 || minute !== 0;
  return new Date(year, month - 1, day, hour, minute).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(hasTime && { hour: '2-digit', minute: '2-digit' }),
  });
}

export function toJobLocationMarkers(locations: JobLocationResponse[]): PlaceDetails[] {
  return locations.flatMap((job) => {
    if (!hasCoordinates(job)) return [];

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
        scheduledTime: formatScheduledTime(job.scheduledTime),
      },
    };
  });
}

/** Rows `job-locations` sends with null coordinates, which the map places from their address. */
export const selectUnlocatedJobs = (locations: JobLocationResponse[]) =>
  locations.filter((job) => !hasCoordinates(job) && job.address?.trim());

/**
 * Places unlocated rows by geocoding their address, keeping everything else the row
 * carries. One at a time to stay within Google's rate limit; addresses Google can't
 * find are left off the map.
 */
export async function geocodeUnlocatedJobs(
  locations: JobLocationResponse[],
  geocode: (address: string) => Promise<Location | null>
): Promise<JobLocationResponse[]> {
  const located: JobLocationResponse[] = [];

  for (const job of selectUnlocatedJobs(locations)) {
    const location = await geocode(job.address!.trim());
    if (location) located.push({ ...job, lat: location.lat, lng: location.lng });
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
