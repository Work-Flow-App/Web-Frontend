import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { notificationService } from '../services/api/notification';
import { createNotificationSocket } from '../services/notificationSocket';
import { apiClient } from '../services/api/client';
import {
  notificationReducer,
  initialNotificationState,
  sumUnreadCount,
  type NotificationState,
} from './notificationReducer';
import type { NotificationResponse } from '../../workflow-api';
import { NotificationResponseTypeEnum } from '../../workflow-api';
import { useAuth } from './AuthContext';

const RECONCILE_INTERVAL_MS = 120_000;
const INITIAL_FETCH_SIZE = 20;

export interface NotificationContextValue {
  unreadCount: number;
  recent: NotificationResponse[];
  refresh: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

const reconcileUnreadCount = async (
  dispatch: Dispatch<{ type: 'RECONCILE_UNREAD_COUNT'; unreadCount: number }>
): Promise<void> => {
  try {
    const { data } = await notificationService.getUnreadCount();
    dispatch({ type: 'RECONCILE_UNREAD_COUNT', unreadCount: sumUnreadCount(data ?? {}) });
  } catch {
    // best-effort — badge simply keeps its last known value
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);
  const stateRef = useRef<NotificationState>(state);
  const socketRef = useRef<ReturnType<typeof createNotificationSocket> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const forceLogout = useCallback(() => {
    socketRef.current?.deactivate();
    apiClient.clearAuthToken();
    apiClient.clearRefreshToken();
    window.location.href = '/login';
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!accessToken) return;
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.list({ unreadOnly: true, size: INITIAL_FETCH_SIZE }),
      ]);
      dispatch({
        type: 'SET_INITIAL',
        unreadCount: sumUnreadCount(countRes.data ?? {}),
        recent: listRes.data.data ?? [],
      });
    } catch {
      // silently fail — badge/dropdown just keep their last known values
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    refresh();

    const socket = createNotificationSocket({
      onMessage: (notification) => {
        if (notification.type === NotificationResponseTypeEnum.ForceLogout) {
          forceLogout();
          return;
        }
        dispatch({ type: 'PUSHED', notification });
      },
      onError: (error) => {
        console.error('Notification socket error:', error);
      },
    });
    socketRef.current = socket;
    socket.activate();

    const reconcileTimer = setInterval(() => reconcileUnreadCount(dispatch), RECONCILE_INTERVAL_MS);
    const handleFocus = () => reconcileUnreadCount(dispatch);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(reconcileTimer);
      window.removeEventListener('focus', handleFocus);
      socket.deactivate();
      socketRef.current = null;
      dispatch({ type: 'SET_INITIAL', unreadCount: 0, recent: [] });
    };
  }, [accessToken, refresh, forceLogout]);

  const markAsRead = useCallback(async (id: number): Promise<void> => {
    const previous = stateRef.current;
    dispatch({ type: 'MARK_READ', id });
    try {
      await notificationService.markAsRead(id);
    } catch {
      dispatch({ type: 'RESTORE', state: previous });
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    const previous = stateRef.current;
    dispatch({ type: 'MARK_ALL_READ' });
    try {
      await notificationService.markAllAsRead();
    } catch {
      dispatch({ type: 'RESTORE', state: previous });
    }
  }, []);

  const value: NotificationContextValue = {
    unreadCount: state.unreadCount,
    recent: state.recent,
    refresh,
    markAsRead,
    markAllAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
