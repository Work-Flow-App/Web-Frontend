import { styled, Box } from '@mui/material';
import { rem, Bold } from '../Typography/utility';

export const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  // padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `${rem(1)} solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,

  // Leaflet CSS overrides to match theme
  '& .leaflet-container': {
    height: '100% !important',
    width: '100% !important',
    borderRadius: theme.spacing(1),
  },

  '& .leaflet-popup-content-wrapper': {
    borderRadius: theme.spacing(0.5),
    boxShadow: theme.shadows[3],
  },

  '& .leaflet-popup-content': {
    margin: theme.spacing(1),
  },

  '& .leaflet-control-attribution': {
    fontSize: rem(10),
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
}));

export const SearchBoxContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: rem(600),
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[4],
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

export const MarkerPopupContent = styled(Box)(({ theme }) => ({
  minWidth: rem(200),
  '& h6': {
    fontWeight: Bold._600,
    marginBottom: theme.spacing(0.5),
    fontSize: rem(14),
  },
  '& p': {
    fontSize: rem(12),
    color: theme.palette.text.secondary,
    margin: 0,
  },
}));

export const GeocodingLoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[3],
}));
