import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import GoogleMap from '../../../../components/UI/GoogleMap/GoogleMap';

export const SectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: '0.75rem',
  border: `0.0625rem solid ${theme.palette.divider}`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
  borderBottom: `0.0625rem solid ${theme.palette.divider}`,
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
  height: '0.0625rem',
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(1, 2.5),
}));

export const InlineEditContainer = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}));

export const MapEditWrapper = styled(Box)(({ theme }) => ({
  padding: '0.5rem 1.25rem 0.5rem 1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  borderBottom: `0.0625rem solid ${theme.palette.divider}`,
  backgroundColor: '#FFFFFF',
  // Target the autocomplete search input inside GoogleMap
  '& .MuiAutocomplete-root .MuiOutlinedInput-root': {
    height: '2.25rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    backgroundColor: '#fff',
    padding: '0.125rem 0.5625rem',
    '& input': {
      padding: '0 !important',
    }
  },
}));

export const MapActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));

export const StyledGoogleMap = styled(GoogleMap)(() => ({
  height: '100% !important',
  // Scale Map/Satellite toggle container (top-left)
  '& .gm-style-mtc': {
    transform: 'scale(0.65) !important',
    transformOrigin: 'top left !important',
  },
  // Scale top-right control container (Fullscreen) slightly smaller
  '& .gm-style > div > .gmnoprint:has(.gm-svpc), & .gm-style > div > .gmnoprint:has(.gm-fullscreen-control)': {
    transform: 'scale(0.65) !important',
    transformOrigin: 'top right !important',
  },
  // Hide Street View Pegman completely
  '& .gm-svpc': {
    display: 'none !important',
  },
  // Scale bottom-right control container (Zoom controls) slightly smaller
  '& .gm-style > div > .gmnoprint:has(.gm-bundled-control), & .gm-bundled-control': {
    transform: 'scale(0.65) !important',
    transformOrigin: 'bottom right !important',
  },
}));

export const MapCancelButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.625rem',
  fontWeight: 600,
  borderRadius: '50rem',
  backgroundColor: '#ffffff',
  color: theme.palette.error.main,
  border: `0.0625rem solid ${theme.palette.error.light}`,
  padding: '0 0.5rem',
  height: '1.375rem',
  minWidth: 'auto',
  lineHeight: 1,
  '&:hover': {
    backgroundColor: '#fff5f5',
    borderColor: theme.palette.error.main,
  },
}));

export const MapSaveButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.625rem',
  fontWeight: 600,
  borderRadius: '50rem',
  backgroundColor: '#ffffff',
  color: theme.palette.primary.main,
  border: `0.0625rem solid ${theme.palette.primary.light}`,
  padding: '0 0.5rem',
  height: '1.375rem',
  minWidth: 'auto',
  lineHeight: 1,
  '&:hover': {
    backgroundColor: '#f5f8ff',
    borderColor: theme.palette.primary.main,
  },
}));

