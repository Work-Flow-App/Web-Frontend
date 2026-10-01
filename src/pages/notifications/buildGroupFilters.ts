import type { NotificationFilterOption } from '../../components/UI/NotificationList';
import { getNotificationCategory } from '../../components/UI/NotificationList/notificationCategories';
// Imported from the generated client directly: the services barrel reads browser storage on load.
import { NotificationResponseTypeEnum } from '../../../workflow-api';
import type { NotificationResponse } from '../../../workflow-api';

const KNOWN_TYPES = new Set<string>(Object.values(NotificationResponseTypeEnum));

/**
 * Builds the group filter chips (All + one per category) with unread counts.
 *
 * The unread-count endpoint is typed as a string→number map. Today the backend returns a
 * single total (`{ unreadCount: n }`), so only keys that are real notification types are
 * treated as per-type counts; anything else (like that total) is ignored. When no per-type
 * counts are available, counts fall back to the unread items loaded on the page.
 */
export function buildGroupFilters(
  countsByType: Record<string, number>,
  items: NotificationResponse[]
): NotificationFilterOption[] {
  const totals = new Map<string, { label: string; count: number }>();

  const addType = (type: string | undefined, unread: number) => {
    const category = getNotificationCategory(type);
    const existing = totals.get(category.id);
    if (existing) {
      existing.count += unread;
    } else {
      totals.set(category.id, { label: category.label, count: unread });
    }
  };

  const perTypeCounts = Object.entries(countsByType).filter(([type]) => KNOWN_TYPES.has(type));

  if (perTypeCounts.length) {
    // Include types with unread items that aren't loaded yet, so their group doesn't vanish.
    perTypeCounts.forEach(([type, count]) => addType(type, Number.isFinite(count) ? count : 0));
    items.forEach((item) => addType(item.type, 0));
  } else {
    items.forEach((item) => addType(item.type, item.read ? 0 : 1));
  }

  return [
    { id: 'all', label: 'All' },
    ...Array.from(totals.entries())
      .map(([id, { label, count }]) => ({ id, label, count }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];
}
