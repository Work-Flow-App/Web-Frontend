import { styled, Box, TextField } from '@mui/material';
import { rem, Bold } from '../Typography/utility';

export const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  border: `${rem(1)} solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  // LoadScript renders a plain <div> with no height — force it to fill
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
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
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
