import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../UI/Typography/utility';

export const Wrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
  width: '100%',
});

export const StatusText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'success' | 'warning' }>(({ theme, tone }) => ({
  fontSize: rem(14),
  textAlign: 'center',
  color: tone === 'success' ? theme.palette.success.main : theme.palette.warning.main,
}));
