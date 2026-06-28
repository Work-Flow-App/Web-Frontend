import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PageWrapperContextValue, PageAction } from '../PageWrapper.types';

const PageWrapperContext = createContext<PageWrapperContextValue | undefined>(undefined);

export const usePageWrapperContext = () => {
  const context = useContext(PageWrapperContext);
  if (!context) {
    throw new Error('usePageWrapperContext must be used within PageWrapperProvider');
  }
  return context;
};

interface PageWrapperProviderProps {
  children: ReactNode;
  initialTitle?: string;
  initialDescription?: string;
}

export const PageWrapperProvider = ({
  children,
  initialTitle = '',
  initialDescription = '',
}: PageWrapperProviderProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [actions, setActions] = useState<PageAction[]>([]);
  const [headerExtra, setHeaderExtra] = useState<ReactNode>(null);

  const addAction = useCallback((action: PageAction) => {
    setActions((prev) => [...prev, action]);
  }, []);

  const removeAction = useCallback((label: string) => {
    setActions((prev) => prev.filter((action) => action.label !== label));
  }, []);

  const clearActions = useCallback(() => {
    setActions([]);
  }, []);

  const value: PageWrapperContextValue = {
    title,
    description,
    setTitle,
    setDescription,
    addAction,
    removeAction,
    clearActions,
    setHeaderExtra,
  };

  return <PageWrapperContext.Provider value={value}>{children}</PageWrapperContext.Provider>;
};
