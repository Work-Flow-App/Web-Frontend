import { styled, Box, Typography, Paper, Chip } from '@mui/material';

export const ContentSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  height: 'calc(100vh - 200px)',
  alignItems: 'stretch',

  [theme.breakpoints.down('lg')]: {
    flexDirection: 'column',
    height: 'auto',
  },
}));

export const MapSection = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  height: '100%',

  [theme.breakpoints.down('lg')]: {
    minHeight: '500px',
  },
}));

export const SidePanel = styled(Box)(({ theme }) => ({
  width: '450px',
  flexShrink: 0,
  padding: theme.spacing(2),
  height: '100%',

  [theme.breakpoints.down('lg')]: {
    width: '100%',
    height: 'auto',
  },
}));

export const SidePanelPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const QuickLocationSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

export const SectionDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'block',
}));

export const LocationChipContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const LocationChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 500,
  fontSize: '0.875rem',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },

  '&:active': {
    transform: 'translateY(0)',
  },
}));

export const LocationInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const LocationDetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),

  '&:last-child': {
    marginBottom: 0,
  },
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

export const PlaceIdValue = styled(InfoValue)(() => ({
  fontSize: '0.75rem',
  wordBreak: 'break-all',
}));

export const InstructionsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
}));

export const InstructionsText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,

  '& strong': {
    fontWeight: 600,
  },
}));
