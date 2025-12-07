import { styled } from '@mui/material/styles';

export const StyledLink = styled('span')(({ theme }) => ({
  cursor: 'pointer',
  color: theme.palette.info.main,
  textDecoration: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  transition: 'all 0.2s ease',
  '&:hover': {
    textDecoration: 'underline',
  },
}));
