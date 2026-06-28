import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../Typography/utility';

export const RadioGroupWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  width: '100%',
  '@media (min-width: 1921px)': {
    gap: rem(14),
  },
  '@media (max-width: 1536px)': {
    gap: rem(10),
  },
  '@media (max-width: 1366px)': {
    gap: rem(8),
  },
});

export const RadioGroupLabel = styled(Typography)(() => ({
  fontSize: rem(14),
  fontWeight: 700,
  color: '#525252',
  lineHeight: rem(20),
  letterSpacing: '0.005em',
  fontFamily: 'Manrope',
  fontStyle: 'normal',
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
    lineHeight: rem(24),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
    lineHeight: rem(19),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
    lineHeight: rem(18),
  },
}));

export const RadioOptionsContainer = styled(Box)<{ orientation?: 'horizontal' | 'vertical' }>(
  ({ orientation = 'vertical' }) => ({
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: rem(12),
    '@media (min-width: 1921px)': {
      gap: rem(14),
    },
    '@media (max-width: 1536px)': {
      gap: rem(10),
    },
    '@media (max-width: 1366px)': {
      gap: rem(8),
    },
  })
);

export const RadioOption = styled(Box)<{ isSelected?: boolean; hasError?: boolean }>(
  ({ theme, isSelected, hasError }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: rem(12),
    padding: rem(14),
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
    '@media (min-width: 1921px)': {
      gap: rem(14),
      padding: rem(16),
    },
    '@media (max-width: 1536px)': {
      gap: rem(10),
      padding: rem(12),
    },
    '@media (max-width: 1366px)': {
      gap: rem(8),
      padding: rem(10),
    },
  })
);

export const RadioCircle = styled(Box)<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  width: rem(18),
  height: rem(18),
  borderRadius: '50%',
  border: `${rem(2)} solid ${isSelected ? theme.palette.primary.main : theme.palette.grey[400]}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.2s ease-in-out',
  '&::after': {
    content: '""',
    width: rem(9),
    height: rem(9),
    borderRadius: '50%',
    backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
    transition: 'all 0.2s ease-in-out',
  },
  '@media (min-width: 1921px)': {
    width: rem(20),
    height: rem(20),
    '&::after': {
      width: rem(10),
      height: rem(10),
    },
  },
  '@media (max-width: 1536px)': {
    width: rem(16),
    height: rem(16),
    '&::after': {
      width: rem(8),
      height: rem(8),
    },
  },
  '@media (max-width: 1366px)': {
    width: rem(14),
    height: rem(14),
    '&::after': {
      width: rem(7),
      height: rem(7),
    },
  },
}));

export const RadioContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  flex: 1,
  '@media (min-width: 1921px)': {
    gap: rem(5),
  },
  '@media (max-width: 1536px)': {
    gap: rem(3),
  },
  '@media (max-width: 1366px)': {
    gap: rem(2),
  },
});

export const RadioLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: 600,
  color: theme.palette.grey[900],
  lineHeight: rem(20),
  '@media (min-width: 1921px)': {
    fontSize: rem(16),
    lineHeight: rem(24),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(13),
    lineHeight: rem(19),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(12),
    lineHeight: rem(18),
  },
}));

export const RadioDescription = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.grey[600],
  lineHeight: rem(18),
  '@media (min-width: 1921px)': {
    fontSize: rem(14),
    lineHeight: rem(20),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(11),
    lineHeight: rem(16),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(10),
    lineHeight: rem(15),
  },
}));

export const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.error.main,
  lineHeight: rem(15),
  '@media (min-width: 1921px)': {
    fontSize: rem(12),
    lineHeight: rem(16),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(10),
    lineHeight: rem(14),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(9),
    lineHeight: rem(13),
  },
}));
