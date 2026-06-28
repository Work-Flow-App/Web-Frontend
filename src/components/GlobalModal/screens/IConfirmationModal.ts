export interface ConfirmationModalProps {
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  description?: string;
  variant?: 'default' | 'warning' | 'danger';
}