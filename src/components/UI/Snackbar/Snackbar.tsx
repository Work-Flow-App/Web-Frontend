import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { SnackbarProps, SnackbarVariant } from './Snackbar.types';
import {
  SnackbarWrapper,
  SnackbarContent,
  MessageContainer,
  IconWrapper,
  Message,
  CloseButton,
} from './Snackbar.styles';

// Icon components
const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"
      fill="currentColor"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
      fill="currentColor"
    />
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 20H20L10 0L0 20ZM11 17H9V15H11V17ZM11 13H9V9H11V13Z"
      fill="currentColor"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z"
      fill="currentColor"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 1.81286L16.1871 0L9 7.18714L1.81286 0L0 1.81286L7.18714 9L0 16.1871L1.81286 18L9 10.8129L16.1871 18L18 16.1871L10.8129 9L18 1.81286Z"
      fill="currentColor"
    />
  </svg>
);

const getIcon = (variant: SnackbarVariant) => {
  switch (variant) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'info':
      return <InfoIcon />;
    default:
      return <SuccessIcon />;
  }
};

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  message,
  variant = 'success',
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  autoHideDuration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  const getPosition = () => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    // Vertical positioning
    if (anchorOrigin.vertical === 'top') {
      styles.top = '24px';
    } else {
      styles.bottom = '24px';
    }

    // Horizontal positioning
    if (anchorOrigin.horizontal === 'left') {
      styles.left = '24px';
    } else if (anchorOrigin.horizontal === 'center') {
      styles.left = '50%';
      styles.transform = 'translateX(-50%)';
    } else {
      styles.right = '24px';
    }

    return styles;
  };

  const snackbarElement = (
    <SnackbarWrapper style={getPosition()}>
      <SnackbarContent variant={variant}>
        <MessageContainer>
          <IconWrapper>{getIcon(variant)}</IconWrapper>
          <Message>{message}</Message>
        </MessageContainer>
        {onClose && (
          <CloseButton onClick={onClose} aria-label="Close">
            <CloseIcon />
          </CloseButton>
        )}
      </SnackbarContent>
    </SnackbarWrapper>
  );

  return createPortal(snackbarElement, document.body);
};
