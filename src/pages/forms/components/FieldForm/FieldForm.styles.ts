import { Box, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const FormRowResponsive = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(16),
  width: '100%',
  '& > *': {
    flex: 1,
    minWidth: 0,
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: rem(12),
    '& > *': {
      width: '100%',
    },
  },
}));
