import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const TeamContainer = styled(Box)({
  width: '100%',
  height: '100%',
});

export const StatusBadge = styled('span')<{ color: string }>(({ color, theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: theme.typography.fontWeightSemiBold,
  backgroundColor: `${color}20`,
  color: color,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));
