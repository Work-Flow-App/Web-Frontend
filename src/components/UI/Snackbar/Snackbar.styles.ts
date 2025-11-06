import styled from '@emotion/styled';
import type { SnackbarVariant } from './Snackbar.types';

export const SnackbarWrapper = styled.div`
  /* Container for the snackbar */
`;

interface SnackbarContentProps {
  variant: SnackbarVariant;
}

const getVariantColors = (variant: SnackbarVariant) => {
  switch (variant) {
    case 'success':
      return {
        background: '#00A63E', // floowColors.success.main
        color: '#FFFFFF',
        lightBg: 'rgba(0, 166, 62, 0.15)',
      };
    case 'error':
      return {
        background: '#FB2C36', // floowColors.error.main
        color: '#FFFFFF',
        lightBg: 'rgba(251, 44, 54, 0.15)',
      };
    case 'warning':
      return {
        background: '#FFA500', // floowColors.warning.main
        color: '#FFFFFF',
        lightBg: 'rgba(255, 165, 0, 0.15)',
      };
    case 'info':
      return {
        background: '#2196F3', // floowColors.info.main
        color: '#FFFFFF',
        lightBg: 'rgba(33, 150, 243, 0.15)',
      };
    default:
      return {
        background: '#00A63E',
        color: '#FFFFFF',
        lightBg: 'rgba(0, 166, 62, 0.15)',
      };
  }
};

export const SnackbarContent = styled.div<SnackbarContentProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  min-width: 344px;
  max-width: 600px;
  background: ${({ variant }) => getVariantColors(variant).background};
  color: ${({ variant }) => getVariantColors(variant).color};
  border-radius: 8px;
  box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.1);
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 600px) {
    min-width: 280px;
    max-width: calc(100vw - 32px);
  }
`;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

export const Message = styled.span`
  flex: 1;
  word-break: break-word;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.8;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }

  &:active {
    opacity: 0.6;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;
