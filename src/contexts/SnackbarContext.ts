import { createContext, useContext } from 'react';

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

export const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within GlobalSnackbarProvider');
  }
  return context;
};
