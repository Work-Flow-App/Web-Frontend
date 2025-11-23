import { useContext } from 'react';
import { PaginationModalContext, DataRowsContext, DataColumnContext } from './DataTableContext';

/**
 * Custom hook to access pagination context
 * @throws Error if used outside DataTableContextProvider
 */
export const usePagination = () => {
  const context = useContext(PaginationModalContext);
  if (!context) {
    throw new Error('usePagination must be used within DataTableContextProvider');
  }
  return context;
};

/**
 * Custom hook to access data rows context
 * @throws Error if used outside DataTableContextProvider
 */
export const useDataRow = () => {
  const context = useContext(DataRowsContext);
  if (!context) {
    throw new Error('useDataRow must be used within DataTableContextProvider');
  }
  return context;
};

/**
 * Custom hook to access data columns context
 * @throws Error if used outside DataTableContextProvider
 */
export const useDataColumn = () => {
  const context = useContext(DataColumnContext);
  if (!context) {
    throw new Error('useDataColumn must be used within DataTableContextProvider');
  }
  return context;
};

// Re-export the provider
export { DataTableContextProvider } from './DataTableContext';
