import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { subscriptionService } from '../services/api/subscription';
import type { SubscriptionStatusResponse } from '../services/api/subscription';
import { useAuth } from './AuthContext';

export interface SubscriptionContextValue {
  status: SubscriptionStatusResponse | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export const useSubscription = (): SubscriptionContextValue => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { accessToken, userRole } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async (): Promise<void> => {
    if (!accessToken || (userRole !== 'ROLE_COMPANY' && userRole !== 'COMPANY')) return;
    try {
      const { data } = await subscriptionService.getStatus();
      setStatus(data);
    } catch {
      // silently fail — 402 redirect handled globally in API client
    }
  }, [accessToken, userRole]);

  useEffect(() => {
    setIsLoading(true);
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const value: SubscriptionContextValue = {
    status,
    isLoading,
    refresh,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};
