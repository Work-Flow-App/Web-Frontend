import { Box, styled } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

export const RowWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
  padding: `${rem(12)} 0`,
  borderBottom: `1px dashed ${floowColors.slate.light || theme.palette.divider}`,
}));

export const LabelRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(10),
}));

export const Label = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const RequiredMark = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  marginLeft: rem(2),
}));

export const Value = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
}));

export const FileRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: rem(12),
  fontSize: rem(13.5),
  '& a': {
    color: theme.palette.success.main,
    fontWeight: Bold._600,
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
}));
