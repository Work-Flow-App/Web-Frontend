import { styled, Box } from '@mui/material';

interface SearchContainerProps {
  width?: string | number;
}

export const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width',
})<SearchContainerProps>(({ width }) => ({
  width: width || 300,
}));

export const SearchIcon = styled('svg')(() => ({
  flexShrink: 0,
  width: 24,
  height: 24,
}));
