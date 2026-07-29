import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
} from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(1),
    width: '100%',
    maxWidth: 520,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
    margin: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      maxWidth: 'calc(100% - 16px)',
      borderRadius: theme.spacing(1),
    },
  },
}));

export const ModalHeader = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

export const ModalTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
  padding: theme.spacing(0.5),
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.grey[100],
  },
}));

export const ModalContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2.5, 2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const FormGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}));

export const FormLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

export const FormInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontSize: '0.875rem',
    borderRadius: theme.spacing(0.75),
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8.5px 12px',
  },
}));

export const DurationRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));

export const DurationFieldGroup = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const DurationInputsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const SmallNumberInput = styled(TextField)(({ theme }) => ({
  width: 70,
  '& .MuiOutlinedInput-root': {
    fontSize: '0.8125rem',
    borderRadius: theme.spacing(0.75),
  },
  '& .MuiOutlinedInput-input': {
    padding: '6px 8px',
    textAlign: 'center',
  },
}));

export const UnitLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

export const ModalActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  borderColor: theme.palette.grey[300],
  '&:hover': {
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 600,
  borderRadius: theme.spacing(0.75),
  padding: '6px 16px',
}));

export const WorkerChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: '0.75rem',
  fontWeight: 500,
  borderRadius: theme.spacing(0.5),
}));
