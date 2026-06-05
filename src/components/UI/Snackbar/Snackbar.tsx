import React, { useEffect } from 'react';
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
import {
  SuccessIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  CloseIcon,
} from './Icon';

const getIcon = (variant: SnackbarVariant) => {
  switch (variant) {
    case 'success':  return <SuccessIcon />;
    case 'error':    return <ErrorIcon />;
    case 'warning':  return <WarningIcon />;
    case 'info':     return <InfoIcon />;
    default:         return <SuccessIcon />;
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

  const getPosition = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 9999,
    };

    if (anchorOrigin.vertical === 'top') {
      styles.top = '24px';
    } else {
      styles.bottom = '24px';
    }

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