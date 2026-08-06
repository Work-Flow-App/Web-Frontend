import { Box, styled } from '@mui/material';
import { floowColors } from '../../../theme/colors';

export const FieldsCard = styled(Box)(() => ({
  background: floowColors.white,
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  borderRadius: '14px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
}));

export const ActionsRow = styled(Box)(() => ({
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  paddingTop: '12px',
  borderTop: `1px solid ${floowColors.tailwind.gray[100]}`,
}));

export const EmptyText = styled('span')(() => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  color: floowColors.text.muted,
}));
