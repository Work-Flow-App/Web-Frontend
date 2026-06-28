import { Box, Divider, Typography, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { rem, Bold } from '../../../../components/Typography/utility';

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
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  border: `1px solid ${theme.palette.colors?.grey_200 ?? theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

export const TimerGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
}));

export const TimerFieldBlock = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
}));

export const TimerFieldLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: rem(13),
  fontWeight: Bold._700,
  color: theme.palette.colors?.grey_600 ?? theme.palette.text.secondary,
  lineHeight: rem(20),
}));

export const TimerFieldLabelIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    fontSize: rem(15),
    color: theme.palette.text.secondary,
  },
}));

export const FieldHint = styled(Box)<{ hintVariant?: 'warning' | 'error' }>(
  ({ theme, hintVariant }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.4),
    fontSize: rem(11),
    fontWeight: Bold._500,
    paddingBlock: rem(3),
    paddingInline: rem(7),
    borderRadius: rem(4),
    width: 'fit-content',
    backgroundColor:
      hintVariant === 'error'
        ? alpha(theme.palette.error.main, 0.09)
        : hintVariant === 'warning'
          ? alpha(theme.palette.warning.main, 0.10)
          : alpha(theme.palette.text.secondary, 0.07),
    color:
      hintVariant === 'error'
        ? theme.palette.error.main
        : hintVariant === 'warning'
          ? (theme.palette.warning as any).dark ?? theme.palette.warning.main
          : theme.palette.text.secondary,
    '& svg': {
      fontSize: rem(12),
    },
  })
);

export const DurationInputRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(1),
}));

export const DurationUnit = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  fontWeight: Bold._500,
  userSelect: 'none',
  lineHeight: 1,
}));
