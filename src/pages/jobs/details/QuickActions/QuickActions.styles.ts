import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const QuickActionsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  letterSpacing: '0.03125rem',
  textTransform: 'uppercase',
  paddingLeft: theme.spacing(1),
}));

export const ActionsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const ActionCard = styled(Box)(({ theme }) => ({
  flex: '1 1 calc(50% - 0.5rem)',
  minWidth: '12.5rem',
  backgroundColor: '#FFFFFF',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '0.75rem',
  padding: theme.spacing(2.5),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 0.25rem 0.75rem rgba(0,0,0,0.05)',
  },
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '0.5rem',
  backgroundColor: '#EEF2FF', // light primary tint
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(1),
  '& svg': {
    fontSize: '1.25rem',
  },
}));

export const ActionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ActionSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}));
