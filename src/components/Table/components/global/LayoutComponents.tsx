import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/**
 * Parent container for the table layout
 * Provides the flex container for left, center, and right sections
 */
export const ParentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  background: theme.palette.colors.white,
}));

/**
 * Left container for sticky columns (checkboxes, IDs, etc.)
 * Stays fixed on the left side while center scrolls
 */
export const LeftContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  left: 0,
  zIndex: 2,
  background: theme.palette.colors.white,
  borderRight: `1px solid ${theme.palette.colors.grey_100}`,
  flexShrink: 0,
}));

/**
 * Center container for scrollable data columns
 * Contains the main table data that scrolls horizontally
 */
export const CenterContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  background: theme.palette.colors.white,

  '&::-webkit-scrollbar': {
    width: '0.5rem',
    height: '0.5rem',
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.colors.grey_100,
  },

  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.colors.grey_300,
    borderRadius: '0.25rem',

    '&:hover': {
      background: theme.palette.colors.grey_400,
    },
  },
}));

/**
 * Right container for sticky action columns
 * Stays fixed on the right side while center scrolls
 */
export const RightContainer = styled(Box)(({ theme }) => ({
  position: 'sticky',
  right: 0,
  zIndex: 2,
  background: theme.palette.colors.white,
  borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
  flexShrink: 0,
}));
