import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/api/auth';
import { subscriptionService } from '../services/api/subscription';
import { getRoleFromToken } from '../utils/jwt';
import type { SubscriptionStatusResponse } from '../services/api/subscription';

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
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isCompanyUser = useCallback((): boolean => {
    const token = authService.getAccessToken();
    if (!token) return false;
    const role = getRoleFromToken(token);
    return role === 'ROLE_COMPANY' || role === 'COMPANY';
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (!isCompanyUser()) return;
    try {
      const { data } = await subscriptionService.getStatus();
      setStatus(data);
    } catch {
      // silently fail — 402 redirect handled globally in API client
    }
  }, [isCompanyUser]);

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
