import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Snackbar } from '../components/UI/Snackbar';

export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarState {
  open: boolean;
  message: string;
  variant: SnackbarVariant;
}

export interface SnackbarContextValue {
  showSnackbar: (message: string, variant?: SnackbarVariant) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  hideSnackbar: () => void;
  snackbarState: SnackbarState;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within GlobalSnackbarProvider');
  }
  return context;
};

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
    setSnackbarState({
      open: true,
      message,
      variant,
    });
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showSnackbar(message, 'success');
    },
    [showSnackbar]
  );

  const showError = useCallback(
    (message: string) => {
      showSnackbar(message, 'error');
    },
    [showSnackbar]
  );

  const showWarning = useCallback(
    (message: string) => {
      showSnackbar(message, 'warning');
    },
    [showSnackbar]
  );

  const showInfo = useCallback(
    (message: string) => {
      showSnackbar(message, 'info');
    },
    [showSnackbar]
  );

  const hideSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  const value: SnackbarContextValue = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar,
    snackbarState,
  };

  return (
    <SnackbarContext.Provider value={value}>
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
