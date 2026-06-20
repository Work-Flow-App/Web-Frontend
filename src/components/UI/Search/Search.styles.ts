import { styled, Box } from '@mui/material';
import { rem } from '../Typography/utility';
import type { SearchSize } from './Search.types';

interface SearchContainerProps {
  width?: string | number;
  $size?: SearchSize;
}

const sizeWidths: Record<SearchSize, string> = {
  small: rem(240),
  medium: rem(300),
  large: rem(360),
};

export const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== '$size',
})<SearchContainerProps>(({ width, $size }) => ({
  width: width || ($size ? sizeWidths[$size] : rem(300)),
}));

export const SearchIcon = styled('svg')(() => ({
  flexShrink: 0,
  width: 24,
  height: 24,
}));
