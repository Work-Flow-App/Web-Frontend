import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { rem } from '../Typography/utility';

export const StrengthContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  marginTop: rem(4),
});

export const StrengthBar = styled(Box)<{ strength: number }>(({ strength }) => {
  let backgroundColor = '#E0E0E0';
  if (strength >= 80) backgroundColor = '#66BB6A';
  else if (strength >= 50) backgroundColor = '#FFA726';
  else if (strength > 0) backgroundColor = '#EF5350';

  return {
    height: rem(4),
    borderRadius: rem(2),
    transition: 'all 0.3s ease',
    flex: 1,
    backgroundColor,
  };
});

export const StrengthLabel = styled(Typography)<{ strength: number }>(({ strength }) => {
  let color = '#9E9E9E';
  if (strength >= 80) color = '#66BB6A';
  else if (strength >= 50) color = '#FFA726';
  else if (strength > 0) color = '#EF5350';

  return {
    fontSize: rem(12),
    fontWeight: 500,
    color,
    minWidth: rem(60),
  };
});