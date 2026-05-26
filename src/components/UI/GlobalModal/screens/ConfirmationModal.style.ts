import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { floowColors } from '../../../../theme/colors';
import type { ConfirmationModalProps } from './IConfirmationModal';

export const ModalContainer = styled(Box)({
  padding: '16px',
});

export const MessageText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'colorVariant' && prop !== 'hasDescription',
})<{ colorVariant?: ConfirmationModalProps['variant']; hasDescription?: boolean }>(
  ({ colorVariant, hasDescription }) => ({
    marginBottom: hasDescription ? '16px' : 0,
    color:
      colorVariant === 'warning'
        ? floowColors.warning.main
        : colorVariant === 'danger'
          ? floowColors.error.main
          : floowColors.text.primary,
    fontWeight: colorVariant === 'danger' || colorVariant === 'warning' ? 500 : 400,
  })
);
export const DescriptionText = styled(Typography)({
  color: floowColors.text.secondary,
});