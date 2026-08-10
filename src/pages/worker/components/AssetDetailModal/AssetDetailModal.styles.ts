import { Box, styled } from '@mui/material';
import { floowColors } from '../../../../theme/colors';

export const DetailBody = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '4px 2px',
}));

export const EmptyText = styled(Box)(() => ({
  padding: '32px 16px',
  textAlign: 'center',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '14px',
  color: floowColors.text.muted,
}));

export const AttachmentList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}));

export const AttachmentLink = styled('a')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  fontWeight: 600,
  color: floowColors.indigo.main,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  '& svg': {
    fontSize: 16,
  },
}));
