import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const FooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem 1.25rem',
  background: theme.palette.colors.white,
  borderTop: `1px solid ${theme.palette.colors.grey_100}`,
}));
