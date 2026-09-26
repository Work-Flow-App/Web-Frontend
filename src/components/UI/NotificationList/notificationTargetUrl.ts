export interface ResolvedNotificationTarget {
  /** In-app path to navigate to, when one is known. */
  url?: string;
  /** True when the notification carried a link we deliberately did not navigate to. */
  unresolved?: boolean;
}

// The backend currently sends some notifications (VISIT_LOG_ADDED, at least)
// with their own REST resource path as `targetUrl` — e.g. "/job-workflow-steps/245/visits"
// — instead of an actual frontend route, which 404s. Translate the shapes we
// can map to a real route; anything else matching a known-bad backend path is
// reported as unresolved so callers can skip the navigate instead of sending
// the user to a dead page. This translation should move to the backend once
// it sends real frontend routes (or enough metadata to build one for every role).
const STEP_VISITS_PATTERN = /^\/job-workflow-steps\/(\d+)\/visits\/?$/;

/** Reads a numeric id from notification metadata, e.g. metadata.jobId, if the backend sent one. */
function metadataId(metadata: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = metadata?.[key];
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (typeof value === 'string' && /^\d+$/.test(value)) return value;
  return undefined;
}

export function resolveNotificationTargetUrl(
  notification: { targetUrl?: string; metadata?: Record<string, unknown> },
  isWorker: boolean
): ResolvedNotificationTarget {
  const { targetUrl, metadata } = notification;
  if (!targetUrl) return {};

  const stepVisitsMatch = targetUrl.match(STEP_VISITS_PATTERN);
  if (stepVisitsMatch) {
    if (isWorker) return { url: `/worker/steps/${stepVisitsMatch[1]}` };
    // The company job-details page needs a jobId, which only arrives if the backend
    // includes it in metadata.
    const jobId = metadataId(metadata, 'jobId');
    return jobId ? { url: `/company/jobs/${jobId}/details` } : { unresolved: true };
  }

  // Newer notifications carry real company routes (e.g. /company/jobs/58/details). Workers
  // can't open those, so send them to the matching worker page when metadata allows.
  if (isWorker && targetUrl.startsWith('/company/')) {
    const stepId = metadataId(metadata, 'stepId');
    if (stepId) return { url: `/worker/steps/${stepId}` };
    const jobWorkflowId = metadataId(metadata, 'jobWorkflowId');
    if (jobWorkflowId) return { url: `/worker/job-workflows/${jobWorkflowId}` };
    return { unresolved: true };
  }

  return { url: targetUrl };
}
