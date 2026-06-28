import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { rem } from '../../Typography/utility';

export const CheckboxWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
  width: '100%',
  '@media (min-width: 1921px)': {
    gap: rem(10),
  },
  '@media (max-width: 1536px)': {
    gap: rem(7),
  },
  '@media (max-width: 1366px)': {
    gap: rem(6),
  },
});

export const CheckboxContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hasError' && prop !== 'disabled',
})<{ hasError?: boolean; disabled?: boolean }>(
  ({ disabled }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: rem(12),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
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

export const CheckboxBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isChecked' && prop !== 'hasError' && prop !== 'disabled',
})<{ isChecked?: boolean; hasError?: boolean; disabled?: boolean }>(
  ({ theme, isChecked, hasError, disabled }) => ({
    width: rem(18),
    height: rem(18),
    borderRadius: rem(4),
    border: `${rem(2)} solid ${
      hasError
        ? theme.palette.error.main
        : isChecked
        ? theme.palette.primary.main
        : theme.palette.grey[400]
    }`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease-in-out',
    backgroundColor: isChecked ? theme.palette.primary.main : theme.palette.common.white,
    marginTop: rem(2),
    '&:hover': {
      borderColor: disabled
        ? undefined
        : hasError
        ? theme.palette.error.main
        : theme.palette.primary.main,
    },
    '@media (min-width: 1921px)': {
      width: rem(20),
      height: rem(20),
      borderRadius: rem(5),
    },
    '@media (max-width: 1536px)': {
      width: rem(16),
      height: rem(16),
      borderRadius: rem(3),
    },
    '@media (max-width: 1366px)': {
      width: rem(14),
      height: rem(14),
      borderRadius: rem(3),
    },
  })
);

export const CheckIcon = styled('svg', {
  shouldForwardProp: (prop) => prop !== 'isChecked',
})<{ isChecked?: boolean }>(({ theme, isChecked }) => ({
  width: rem(12),
  height: rem(12),
  fill: 'none',
  stroke: theme.palette.common.white,
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  opacity: isChecked ? 1 : 0,
  transition: 'opacity 0.2s ease-in-out',
  '@media (min-width: 1921px)': {
    width: rem(14),
    height: rem(14),
  },
  '@media (max-width: 1536px)': {
    width: rem(10),
    height: rem(10),
  },
  '@media (max-width: 1366px)': {
    width: rem(9),
    height: rem(9),
  },
}));

export const CheckboxContent = styled(Box)({
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

export const CheckboxLabel = styled(Typography)(({ theme }) => ({
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

export const CheckboxDescription = styled(Typography)(({ theme }) => ({
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
  marginLeft: rem(30),
  '@media (min-width: 1921px)': {
    fontSize: rem(12),
    lineHeight: rem(16),
    marginLeft: rem(34),
  },
  '@media (max-width: 1536px)': {
    fontSize: rem(10),
    lineHeight: rem(14),
    marginLeft: rem(26),
  },
  '@media (max-width: 1366px)': {
    fontSize: rem(9),
    lineHeight: rem(13),
    marginLeft: rem(22),
  },
}));
