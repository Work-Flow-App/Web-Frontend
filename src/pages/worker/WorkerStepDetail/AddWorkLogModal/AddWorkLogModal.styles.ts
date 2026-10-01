import { styled, Box } from '@mui/material';

export const ModalFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  minWidth: 0,
}));

export const ModalFormRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  width: '100%',
  minWidth: 0,
  '& > *': { minWidth: 0 },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));
