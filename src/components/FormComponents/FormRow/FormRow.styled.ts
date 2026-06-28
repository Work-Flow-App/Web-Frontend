import { styled, Box } from '@mui/material';

interface WrapperProps {
  width?: string | number;
  gap?: string | number;
}

export const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'gap',
})<WrapperProps>(({ width, gap }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: gap || '1rem',
  width: width || '100%',
}));
