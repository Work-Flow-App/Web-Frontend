import styled from '@emotion/styled';
import type { SnackbarVariant } from './ISnackbar';
import { floowColors } from '../../../theme/colors';

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
        background: floowColors.success.main,
        color: floowColors.white,
        lightBg: floowColors.success.light,
      };
    case 'error':
      return {
        background: floowColors.error.main,
        color: floowColors.white,
        lightBg: floowColors.error.light,
      };
    case 'warning':
      return {
        background: floowColors.warning.main,
        color: floowColors.white,
        lightBg: floowColors.warning.light,
      };
    case 'info':
      return {
        background: floowColors.info.main,
        color: floowColors.white,
        lightBg: floowColors.info.light,
      };
    default:
      return {
        background: floowColors.success.main,
        color: floowColors.white,
        lightBg: floowColors.success.light,
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
  box-shadow: 0px 6px 24px ${floowColors.shadow.xl};
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
