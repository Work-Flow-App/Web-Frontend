import { useEffect } from 'react';
import { useGlobalModalInnerContext } from '../context';
import { Box, Typography } from '@mui/material';
import { floowColors } from '../../../../theme/colors';

export interface ConfirmationModalProps {
  /**
   * The title of the confirmation modal
   */
  title?: string;

  /**
   * The message to display in the confirmation modal
   */
  message: string;

  /**
   * The text for the confirm button
   * @default 'Confirm'
   */
  confirmButtonText?: string;

  /**
   * The text for the cancel button
   * @default 'Cancel'
   */
  cancelButtonText?: string;

  /**
   * Callback when the user confirms
   */
  onConfirm: () => void;

  /**
   * Callback when the user cancels
   */
  onCancel?: () => void;

  /**
   * Additional description or details
   */
  description?: string;

  /**
   * Variant of the confirmation modal (affects styling/severity)
   * @default 'default'
   */
  variant?: 'default' | 'warning' | 'danger';
}

export const ConfirmationModal = ({
  title = 'Confirm Action',
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
  description,
  variant = 'default',
}: ConfirmationModalProps) => {
  const {
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm,
  } = useGlobalModalInnerContext();

  useEffect(() => {
    // Configure modal
    updateModalTitle(title);

    updateGlobalModalInnerConfig({
      confirmModalButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
    });

    updateOnClose(() => {
      onCancel?.();
    });

    updateOnConfirm(() => {
      onConfirm();
    });
  }, [
    title,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel,
    updateModalTitle,
    updateGlobalModalInnerConfig,
    updateOnClose,
    updateOnConfirm,
  ]);

  const getMessageColor = () => {
    switch (variant) {
      case 'warning':
        return floowColors.warning.main;
      case 'danger':
        return floowColors.error.main;
      default:
        return floowColors.text.primary;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="body1"
        sx={{
          mb: description ? 2 : 0,
          color: getMessageColor(),
          fontWeight: variant === 'danger' || variant === 'warning' ? 500 : 400,
        }}
      >
        {message}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ color: floowColors.text.secondary }}>
          {description}
        </Typography>
      )}
    </Box>
  );
};
