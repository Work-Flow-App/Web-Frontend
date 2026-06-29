import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

export const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '0.75rem',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  letterSpacing: '0.03125rem',
  textTransform: 'uppercase',
}));

export const FieldsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 0),
}));

export const FieldRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.25, 2.5),
  minHeight: '3.5rem',
}));

export const FieldIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(2),
  '& svg': {
    fontSize: '1.25rem',
  },
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  width: '7.5rem',
  flexShrink: 0,
}));

export const FieldValue = styled(Typography)<{ $notSet?: boolean }>(({ theme, $notSet }) => ({
  fontSize: '0.875rem',
  color: $notSet ? theme.palette.text.disabled : theme.palette.text.primary,
  fontWeight: $notSet ? 400 : 500,
  flex: 1,
  fontStyle: $notSet ? 'italic' : 'normal',
}));

export const FieldAction = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: theme.spacing(0.5, 1),
  minWidth: 'auto',
}));

export const DividerLine = styled(Box)(({ theme }) => ({
  height: '1px',
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(1, 2.5),
}));

export const InlineEditContainer = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));
