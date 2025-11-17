import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

/**
 * Wrapper for search input with icon
 */
export const SearchInputWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: rem(400),

  [theme.breakpoints.down('lg')]: {
    maxWidth: rem(300),
  },

  [theme.breakpoints.down('md')]: {
    maxWidth: rem(250),
  },
}));

/**
 * Search icon styling
 */
export const SearchIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: rem(12),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
  color: floowColors.grey[400],

  '& svg': {
    width: rem(18),
    height: rem(18),
  },
}));

/**
 * Default styled search input component (light variant)
 */
export const StyledSearchInput = styled('input')(({ theme }) => ({
  width: '100%',
  maxWidth: rem(400),
  padding: `${rem(8)} ${rem(12)} ${rem(8)} ${rem(36)}`,
  fontSize: rem(14),
  fontFamily: 'inherit',
  border: `${rem(1)} solid ${floowColors.grey[300]}`,
  borderRadius: rem(4),
  backgroundColor: floowColors.white,
  color: floowColors.dark.tertiary,
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',

  '&::placeholder': {
    color: floowColors.grey[500],
  },

  '&:focus': {
    borderColor: floowColors.dark.slate,
    boxShadow: `0 0 0 2px rgba(27, 35, 45, 0.1)`,
  },

  '&:hover': {
    borderColor: floowColors.grey[400],
  },

  '&:disabled': {
    backgroundColor: floowColors.grey[100],
    color: floowColors.grey[500],
    cursor: 'not-allowed',
    borderColor: floowColors.grey[200],
  },

  [theme.breakpoints.down('lg')]: {
    maxWidth: rem(300),
  },

  [theme.breakpoints.down('md')]: {
    maxWidth: rem(250),
  },
}));

/**
 * Dark variant styled search input component (for dark backgrounds like TopNav)
 */
export const StyledSearchInputDark = styled('input')(({ theme }) => ({
  width: '100%',
  maxWidth: rem(400),
  padding: `${rem(6)} ${rem(12)} ${rem(6)} ${rem(36)}`,
  fontSize: rem(14),
  fontFamily: 'inherit',
  border: `1px solid ${floowColors.grey[500]}`,
  borderRadius: rem(8),
  backgroundColor: floowColors.dark.slate,
  color: floowColors.white,
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',

  '&::placeholder': {
    color: floowColors.grey[400],
  },

  '&:focus': {
    borderColor: floowColors.grey[400],
    boxShadow: `0 0 0 2px rgba(161, 161, 161, 0.15)`,
  },

  '&:hover': {
    borderColor: floowColors.grey[400],
  },

  '&:disabled': {
    backgroundColor: floowColors.dark.slate,
    color: floowColors.grey[500],
    cursor: 'not-allowed',
    borderColor: floowColors.grey[500],
    opacity: 0.6,
  },

  [theme.breakpoints.down('lg')]: {
    maxWidth: rem(300),
  },

  [theme.breakpoints.down('md')]: {
    maxWidth: rem(250),
  },
}));
