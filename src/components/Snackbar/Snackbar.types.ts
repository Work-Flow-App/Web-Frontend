export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarProps {
  open: boolean;
  message: string;
  variant?: SnackbarVariant;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  autoHideDuration?: number;
  onClose?: () => void;
}