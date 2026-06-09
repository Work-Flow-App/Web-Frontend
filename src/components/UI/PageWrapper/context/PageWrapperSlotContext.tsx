import { createContext, useContext, type ReactNode } from 'react';

export interface PageWrapperSlotContextValue {
  setHeaderExtra: (extra: ReactNode) => void;
}

export const PageWrapperSlotContext = createContext<PageWrapperSlotContextValue | undefined>(undefined);

export const usePageWrapperSlot = () => useContext(PageWrapperSlotContext);
