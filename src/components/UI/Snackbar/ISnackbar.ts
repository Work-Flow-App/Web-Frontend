export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

export interface ISnackbarPosition {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface ISnackbar {
  /**
   * Whether the snackbar is open
   */
  open: boolean;

  /**
   * Message to display
   */
  message: string;

  /**
   * Variant/type of snackbar
   * @default 'success'
   */
  variant?: SnackbarVariant;

  /**
   * Position of the snackbar
   * @default { vertical: 'bottom', horizontal: 'right' }
   */
  anchorOrigin?: ISnackbarPosition;

  /**
   * Auto hide duration in milliseconds
   * @default 3000
   */
  autoHideDuration?: number;

  /**
   * Callback fired when the snackbar is closed
   */
  onClose?: () => void;
}
