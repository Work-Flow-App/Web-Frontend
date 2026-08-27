import type { NotificationResponse } from '../../workflow-api';

export interface NotificationState {
  unreadCount: number;
  recent: NotificationResponse[];
}

export const initialNotificationState: NotificationState = {
  unreadCount: 0,
  recent: [],
};

export type NotificationAction =
  | { type: 'SET_INITIAL'; unreadCount: number; recent: NotificationResponse[] }
  | { type: 'PUSHED'; notification: NotificationResponse }
  | { type: 'MARK_READ'; id: number }
  | { type: 'MARK_ALL_READ' }
  | { type: 'RECONCILE_UNREAD_COUNT'; unreadCount: number }
  | { type: 'RESTORE'; state: NotificationState };

const MAX_RECENT = 20;

export function sumUnreadCount(counts: Record<string, number>): number {
  return Object.values(counts).reduce(
    (total, value) => total + (Number.isFinite(value) ? value : 0),
    0
  );
}

export function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'SET_INITIAL':
      return { unreadCount: action.unreadCount, recent: action.recent };

    case 'PUSHED': {
      if (state.recent.some((n) => n.id === action.notification.id)) {
        return state;
      }
      const recent = [action.notification, ...state.recent].slice(0, MAX_RECENT);
      const unreadCount = action.notification.read ? state.unreadCount : state.unreadCount + 1;
      return { unreadCount, recent };
    }

    case 'MARK_READ': {
      let wasUnread = false;
      const recent = state.recent.map((n) => {
        if (n.id === action.id && !n.read) {
          wasUnread = true;
          return { ...n, read: true };
        }
        return n;
      });
      return {
        recent,
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }

    case 'MARK_ALL_READ':
      return {
        unreadCount: 0,
        recent: state.recent.map((n) => ({ ...n, read: true })),
      };

    case 'RECONCILE_UNREAD_COUNT':
      return { ...state, unreadCount: action.unreadCount };

    case 'RESTORE':
      return action.state;

    default:
      return state;
  }
}
