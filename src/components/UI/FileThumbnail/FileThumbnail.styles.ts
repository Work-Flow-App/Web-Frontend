import { styled } from '@mui/material';
import { rem } from '../Typography/utility';

export const Thumbnail = styled('img', {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: number }>(({ theme, size }) => ({
  display: 'block',
  flexShrink: 0,
  objectFit: 'cover',
  ...(size
    ? {
        width: rem(size),
        height: rem(size),
        borderRadius: rem(6),
        border: `1px solid ${theme.palette.divider}`,
      }
    : {
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
      }),
}));
