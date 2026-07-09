import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const OverviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const OverviewCard = styled(Box)(({ theme }) => ({
  flex: '1 1 11.25rem',
  minWidth: '11.25rem',
  backgroundColor: '#FFFFFF',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '0.75rem',
  padding: theme.spacing(1, 2),
  height: '5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
}));

export const CardLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.03125rem',
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(1),
}));

export const CardValueContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.125rem',
}));

export const CardValueMain = styled(Typography)(({ theme }) => ({
  fontSize: '1.12rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

export const CardValueSub = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const CardFooterText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

export const ProgressBarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '0.375rem',
  backgroundColor: theme.palette.action.hover,
  borderRadius: '0.1875rem',
  marginTop: theme.spacing(1),
  overflow: 'hidden',
}));

export const ProgressBarFill = styled(Box)<{ progress: number }>(({ theme, progress }) => ({
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  width: `${progress}%`,
  transition: 'width 0.3s ease-in-out',
}));
