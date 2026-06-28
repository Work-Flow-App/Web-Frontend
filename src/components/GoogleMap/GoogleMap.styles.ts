import { styled, Box, TextField, Typography, Button, Chip, IconButton } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { rem, Bold } from '../Typography/utility';

export const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `${rem(1)} solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '& > div': { height: '100%' },
}));

export const MapWrapper = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'relative',
});

export const SearchBoxContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: rem(600),
  zIndex: 1000,
}));

export const StyledSearchInput = styled(TextField)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: theme.palette.divider },
    '&:hover fieldset': { borderColor: theme.palette.primary.main },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
  },
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: theme.palette.background.default,
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  backgroundColor: theme.palette.error.light,
  padding: theme.spacing(3),
  flexDirection: 'column',
  gap: theme.spacing(2),
  color: theme.palette.error.main,
}));

export const RouteInfoPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(3),
  left: theme.spacing(1.5),
  zIndex: 10,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.25, 2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
  border: `1px solid ${theme.palette.divider}`,
  minWidth: 220,
}));

export const MarkerInfoWindow = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  minWidth: rem(200),
  '& h6': {
    fontWeight: Bold._600,
    marginBottom: theme.spacing(0.5),
  },
  '& p': {
    fontSize: rem(14),
    color: theme.palette.text.secondary,
  },
}));

export const MapOuterBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const InfoWindowRoot = styled(Box)({
  minWidth: 220,
  maxWidth: 300,
});

export const InfoWindowHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
});

export const InfoWindowRow = styled(Box)({
  display: 'flex',
  gap: 4,
  marginBottom: 2,
});

export const InfoWindowStatusDot = styled(Box)<{ statusColor: string }>(({ statusColor }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: statusColor,
}));

export const WorkerJobRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  paddingTop: 4,
  paddingBottom: 4,
  borderTop: '1px solid #eee',
});

export const DirectionsButtonBox = styled(Box)({
  marginTop: 8,
});

export const RouteInfoIconBox = styled(Box)({
  flex: 1,
  minWidth: 0,
});

// ─── Styled Typography variants ─────────────────────────────────────────────

export const JobIdText = styled(Typography)({
  fontWeight: 700,
  color: '#1976d2',
});

export const AddressCaptionText = styled(Typography)({
  display: 'block',
  color: '#555',
  marginBottom: 4,
});

export const LabelCaptionText = styled(Typography)({
  color: '#888',
  fontWeight: 600,
});

export const ValueCaptionText = styled(Typography)({
  color: '#555',
});

export const WorkerNameText = styled(Typography)({
  fontWeight: 700,
  marginBottom: 4,
});

export const WorkerContactText = styled(Typography)({
  display: 'block',
  color: '#555',
});

export const WorkerAddressText = styled(Typography)({
  display: 'block',
  color: '#888',
  marginBottom: 8,
});

export const WorkerPhoneText = styled(Typography)({
  display: 'block',
  color: '#555',
  marginBottom: 8,
});

export const JobIdChipText = styled(Typography)({
  fontWeight: 600,
  color: '#1976d2',
});

export const JobClientText = styled(Typography)({
  color: '#555',
});

export const DirectionsErrorText = styled(Typography)({
  display: 'block',
  marginTop: 4,
});

export const RouteDurationText = styled(Typography)({
  fontWeight: 700,
  color: '#1976d2',
  display: 'block',
  lineHeight: 1.2,
});

export const RouteDistanceText = styled(Typography)({
  color: '#555',
  display: 'block',
  lineHeight: 1.2,
});

// ─── Styled MUI components ───────────────────────────────────────────────────

export const JobStatusChip = styled(Chip)<{ statusColor: string }>(({ statusColor }) => ({
  height: 18,
  fontSize: '0.6rem',
  backgroundColor: statusColor,
  color: '#fff',
  fontWeight: 600,
}));

export const WorkerJobChip = styled(Chip)<{ statusColor: string }>(({ statusColor }) => ({
  height: 16,
  fontSize: '0.6rem',
  backgroundColor: statusColor,
  color: '#fff',
  marginLeft: 'auto',
}));

export const DirectionsButton = styled(Button)({
  fontSize: '0.72rem',
  paddingTop: 5,
  paddingBottom: 5,
  textTransform: 'none',
});

export const RouteCarIcon = styled(DirectionsCarIcon)({
  color: '#1976d2',
  fontSize: 22,
  flexShrink: 0,
});

export const ClearDirectionsButton = styled(IconButton)({
  marginLeft: 'auto',
  padding: 4,
  '& .MuiSvgIcon-root': {
    fontSize: 16,
  },
});