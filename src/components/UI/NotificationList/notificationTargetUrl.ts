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

export function resolveNotificationTargetUrl(
  notification: { targetUrl?: string },
  isWorker: boolean
): ResolvedNotificationTarget {
  const { targetUrl } = notification;
  if (!targetUrl) return {};

  const stepVisitsMatch = targetUrl.match(STEP_VISITS_PATTERN);
  if (stepVisitsMatch) {
    // Only the worker step-detail page can be reached with just a stepId today —
    // the company job-details page needs a jobId the backend doesn't provide here.
    return isWorker ? { url: `/worker/steps/${stepVisitsMatch[1]}` } : { unresolved: true };
  }

  return { url: targetUrl };
}
