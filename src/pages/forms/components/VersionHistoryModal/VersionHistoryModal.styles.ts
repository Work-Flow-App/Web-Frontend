import { Box, styled } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../theme/colors';

export const HistoryList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(10),
}));

interface VersionRowProps {
  iscurrent: 'true' | 'false';
}

export const VersionRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iscurrent',
})<VersionRowProps>(({ theme, iscurrent }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
  padding: `${rem(12)} ${rem(14)}`,
  borderRadius: rem(10),
  border: `1px solid ${iscurrent === 'true' ? theme.palette.success.main : floowColors.slate.light || theme.palette.divider}`,
  backgroundColor:
    iscurrent === 'true'
      ? theme.palette.mode === 'dark'
        ? 'rgba(46, 125, 50, 0.12)'
        : floowColors.green[50]
      : 'transparent',
}));

export const VersionInfo = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
}));

export const VersionLabel = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
}));

export const FieldCount = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
}));

export const EmptyHint = styled('p')(({ theme }) => ({
  margin: 0,
  fontSize: rem(13.5),
  color: theme.palette.text.secondary,
}));
