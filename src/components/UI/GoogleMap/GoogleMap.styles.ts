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
