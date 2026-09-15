import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const ModalFormContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  padding: '0.25rem 0',
}));

export const ModalFormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '1rem',

  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));
