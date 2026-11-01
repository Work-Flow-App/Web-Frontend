import { styled } from '@mui/material';
import { rem } from '../Typography/utility';

export const PreviewLink = styled('a')(({ theme }) => ({
  display: 'block',
  width: rem(240),
  maxWidth: '100%',
  marginBottom: theme.spacing(1),
  borderRadius: rem(8),
  overflow: 'hidden',
  backgroundColor: theme.palette.colors.grey_100,
}));

export const PreviewImage = styled('img')({
  display: 'block',
  width: '100%',
  height: 'auto',
  maxHeight: rem(320),
  objectFit: 'cover',
});
