import { Box, styled } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

// White tiles floating on the (grey) DetailCard/FieldsCard background - that contrast, plus a
// hint of shadow, is what actually separates each field visually instead of everything reading
// as one flat grey mass.
export const RowWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
  padding: rem(16),
  borderRadius: rem(12),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : floowColors.grey[100]}`,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : floowColors.white,
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 1px 2px rgba(16, 24, 40, 0.04)',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',

  '&:hover': {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.14)' : floowColors.grey[200],
  },
}));

export const LabelRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: rem(10),
}));

export const LabelGroup = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  minWidth: 0,
}));

// Tonal icon badge - a soft tint of the brand navy, not a rainbow per field type. Keeps every
// field visually anchored the same restrained way; the icon shape itself carries the meaning.
export const TypeIconBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(30),
  height: rem(30),
  borderRadius: rem(8),
  flexShrink: 0,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : `${floowColors.navy}0D`,
  color: theme.palette.mode === 'dark' ? theme.palette.grey[300] : floowColors.navy,
  '& svg': {
    fontSize: rem(16),
  },
}));

export const Label = styled('span')(({ theme }) => ({
  fontSize: rem(13.5),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  minWidth: 0,
  overflowWrap: 'break-word',
}));

export const RequiredMark = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: rem(2),
}));

export const Value = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  paddingLeft: rem(40),
}));

export const FileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: rem(12),
  fontSize: rem(13.5),
  paddingLeft: rem(40),
  '& a': {
    color: theme.palette.success.main,
    fontWeight: Bold._600,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
}));

export const NoFileText = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
}));

export const FieldContent = styled(Box)(() => ({
  paddingLeft: rem(40),
}));
