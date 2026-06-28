import { styled, Box } from '@mui/material';
import { rem } from '../../Typography/utility';

export const Wrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: rem(6),
}));

export const LabelSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const Label = styled('label')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: theme.palette.colors.grey_600,
  lineHeight: rem(20),
  display: 'block',
}));

export const RequiredIndicator = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: rem(2),
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const ContentSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
}));
