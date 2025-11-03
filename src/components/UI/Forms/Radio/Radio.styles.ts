import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../Typography/utility';

export const RadioGroupWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  width: '100%',
});

export const RadioGroupLabel = styled(Typography)(() => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: '#525252',
  lineHeight: rem(24),
  letterSpacing: '0.005em',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
}));

export const RadioOptionsContainer = styled(Box)<{ orientation?: 'horizontal' | 'vertical' }>(
  ({ orientation = 'vertical' }) => ({
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: rem(12),
  })
);

export const RadioOption = styled(Box)<{ isSelected?: boolean; hasError?: boolean }>(
  ({ theme, isSelected, hasError }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: rem(12),
    padding: rem(16),
    border: `${rem(2)} solid ${
      hasError
        ? theme.palette.error.main
        : isSelected
        ? theme.palette.primary.main
        : theme.palette.grey[300]
    }`,
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: isSelected ? `${theme.palette.primary.main}10` : theme.palette.common.white,
    '&:hover': {
      borderColor: hasError ? theme.palette.error.main : theme.palette.primary.main,
      backgroundColor: isSelected
        ? `${theme.palette.primary.main}15`
        : `${theme.palette.primary.main}05`,
    },
  })
);

export const RadioCircle = styled(Box)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: rem(20),
  height: rem(20),
  borderRadius: '50%',
  border: `${rem(2)} solid ${isSelected ? theme.palette.primary.main : theme.palette.grey[400]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.2s ease-in-out',
  '&::after': {
    content: '""',
    width: rem(10),
    height: rem(10),
    borderRadius: '50%',
    backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
    transition: 'all 0.2s ease-in-out',
  },
}));

export const RadioContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  flex: 1,
});

export const RadioLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 600,
  color: theme.palette.grey[900],
  lineHeight: rem(24),
}));

export const RadioDescription = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[600],
  lineHeight: rem(20),
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.error.main,
  lineHeight: rem(16),
}));
