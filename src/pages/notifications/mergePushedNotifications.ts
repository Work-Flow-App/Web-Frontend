import type { NotificationResponse } from '../../services/api/notification';

const toTime = (value?: string): number => (value ? new Date(value).getTime() : 0);

/**
 * Prepends notifications from the context's live `recent` list that this page hasn't
 * loaded yet and that are newer than its newest item. Returns `loaded` unchanged
 * (same reference) when there is nothing new, so callers can skip a re-render.
 */
export function mergePushedNotifications(
  loaded: NotificationResponse[],
  recent: NotificationResponse[],
  unreadOnly: boolean
): NotificationResponse[] {
  const newestLoaded = toTime(loaded[0]?.createdAt);
  const loadedIds = new Set(loaded.map((n) => n.id));
  const incoming = recent.filter(
    (n) => !loadedIds.has(n.id) && (!unreadOnly || !n.read) && toTime(n.createdAt) > newestLoaded
  );
  return incoming.length ? [...incoming, ...loaded] : loaded;
}
