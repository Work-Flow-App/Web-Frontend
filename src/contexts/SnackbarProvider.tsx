import { useState, useCallback, type ReactNode } from 'react';
import { Snackbar } from '../components/Snackbar';
import { SnackbarContext, type SnackbarVariant, type SnackbarState } from './SnackbarContext';

interface GlobalSnackbarProviderProps {
  children: ReactNode;
}

export const GlobalSnackbarProvider = ({ children }: GlobalSnackbarProviderProps) => {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: '',
    variant: 'success',
  });

  const showSnackbar = useCallback((message: string, variant: SnackbarVariant = 'success') => {
    setSnackbarState({ open: true, message, variant });
  }, []);

  const showSuccess = useCallback((message: string) => showSnackbar(message, 'success'), [showSnackbar]);
  const showError = useCallback((message: string) => showSnackbar(message, 'error'), [showSnackbar]);
  const showWarning = useCallback((message: string) => showSnackbar(message, 'warning'), [showSnackbar]);
  const showInfo = useCallback((message: string) => showSnackbar(message, 'info'), [showSnackbar]);

  const hideSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <SnackbarContext.Provider
      value={{ showSnackbar, showSuccess, showError, showWarning, showInfo, hideSnackbar, snackbarState }}
    >
      {children}
      <Snackbar
        open={snackbarState.open}
        message={snackbarState.message}
        variant={snackbarState.variant}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
};
