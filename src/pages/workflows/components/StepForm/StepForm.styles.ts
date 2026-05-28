import { Box, Divider, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';

export const SectionDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1.5, 0),
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
}));

export const SectionIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: rem(16),
  },
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const TimerFieldsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
  borderLeft: `2px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const FieldHint = styled(Typography)<{ hintVariant?: 'warning' | 'error' }>(
  ({ theme, hintVariant }) => ({
    fontSize: rem(11),
    marginTop: theme.spacing(0.25),
    color:
      hintVariant === 'error'
        ? theme.palette.error.main
        : hintVariant === 'warning'
          ? theme.palette.warning.main
          : theme.palette.text.secondary,
  })
);
