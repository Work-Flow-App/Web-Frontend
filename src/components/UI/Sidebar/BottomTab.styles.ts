import { styled, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { rem } from '../Typography/utility';

/**
 * Bottom tab bar container (fixed to bottom, mobile only)
 */
export const BottomTabContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1100,
  height: rem(64),
  backgroundColor: theme.palette.background.paper || theme.palette.colors?.white || '#fff',
  borderTop: `${rem(1)} solid ${theme.palette.colors?.grey_200 || theme.palette.divider}`,
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: `0 ${rem(-2)} ${rem(10)} rgba(0, 0, 0, 0.05)`,
  boxSizing: 'border-box',
  padding: `0 ${rem(8)}`,

  [theme.breakpoints.down('sm')]: {
    display: 'flex',
  },
}));

/**
 * Flex layout row for buttons wrapper
 */
export const BottomTabButtonsWrapper = styled(Box)(() => ({
  display:'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}));

/**
 * Individual tab button (wrapper for interactive item)
 */
export const TabButton = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: '100%',
  cursor: 'pointer',
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  transition: 'color 0.2s ease',
  padding: `${rem(4)} 0`,

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    height: rem(3),
    width: rem(32),
    backgroundColor: 'transparent',
    borderRadius: `0 0 ${rem(2)} ${rem(2)}`,
    transition: 'background-color 0.25s ease',
  },

  '&:hover': {
    color: theme.palette.colors?.grey_800 || theme.palette.text.primary,
  },

  '&.active': {
    color: '#4D9409',
    '&::before': {
      backgroundColor: '#77E20D',
    },
    '& svg': {
      color: '#77E20D',
    },
  },
}));

/**
 * Custom router Link wrapper to reset styles
 */
export const TabButtonLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
}));

/**
 * Icon container for tab items
 */
export const TabIconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(22),
  height: rem(22),
  margin: 0,

  '& svg': {
    width: '100%',
    height: '100%',
    fill: 'currentColor',
  },
}));

/**
 * Label text for tab items
 */
export const TabLabel = styled(Typography)(() => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: rem(10),
  fontWeight: 500,
  marginTop: rem(2),
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  color: 'inherit',

  '.active &': {
    fontWeight: 700,
  },
}));

/**
 * Styled wrapper for the Arrow Toggle Button
 */
export const ArrowButtonOuter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(38),
  height: rem(38),
  borderRadius: rem(10),
  border: `${rem(1)} solid ${theme.palette.colors?.grey_300 || theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,

  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || theme.palette.action.hover,
  },

  '&.active': {
    borderColor: '#77E20D',
    backgroundColor: 'rgba(119, 226, 13, 0.05)',
    color: '#4D9409',
  },
}));

/**
 * Transparent click-away backdrop to close popups
 */
export const Backdrop = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1000,
  backgroundColor: 'transparent',
}));

interface PopupCardProps {
  isOpen: boolean;
  positionType: 'workers' | 'jobs' | 'arrow';
}

/**
 * Popover card container with slide-up animations
 */
export const PopupCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== 'positionType',
})<PopupCardProps>(({ theme, isOpen, positionType }) => {
  const getPositionStyles = () => {
    switch (positionType) {
      case 'workers':
        return {
          left: rem(16),
          transform: isOpen ? 'translateY(0)' : `translateY(${rem(15)})`,
        };
      case 'jobs':
        return {
          left: '50%',
          transform: isOpen ? 'translateX(-50%) translateY(0)' : `translateX(-50%) translateY(${rem(15)})`,
        };
      case 'arrow':
        return {
          right: rem(16),
          transform: isOpen ? 'translateY(0)' : `translateY(${rem(15)})`,
        };
      default:
        return {};
    }
  };

  return {
    position: 'fixed',
    bottom: rem(74),
    zIndex: 1011,
    backgroundColor: theme.palette.background.paper || theme.palette.colors?.white || '#fff',
    borderRadius: rem(16),
    boxShadow: theme.palette.boxShadow?.dropDownListShadow || `0 ${rem(4)} ${rem(20)} rgba(0, 0, 0, 0.1)`,
    border: `${rem(1)} solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
    padding: rem(12),
    width: rem(190),
    boxSizing: 'border-box',
    opacity: isOpen ? 1 : 0,
    pointerEvents: isOpen ? 'auto' : 'none',
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
    ...getPositionStyles(),
  };
});

interface PopupTriangleProps {
  positionType: 'workers' | 'jobs' | 'arrow';
}

/**
 * Triangle/arrow pointer for popovers pointing to their trigger buttons
 */
export const PopupTriangle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'positionType',
})<PopupTriangleProps>(({ theme, positionType }) => {
  const getTrianglePosition = () => {
    switch (positionType) {
      case 'workers':
        return {
          left: rem(88),
        };
      case 'jobs':
        return {
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        };
      case 'arrow':
        return {
          right: rem(24),
        };
      default:
        return {};
    }
  };

  return {
    position: 'absolute',
    bottom: rem(-6),
    width: rem(10),
    height: rem(10),
    backgroundColor: theme.palette.background.paper || theme.palette.colors?.white || '#fff',
    borderRight: `${rem(1)} solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
    borderBottom: `${rem(1)} solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
    transform: positionType === 'jobs' ? 'translateX(-50%) rotate(45deg)' : 'rotate(45deg)',
    zIndex: 1012,
    ...getTrianglePosition(),
  };
});

/**
 * Grid wrapper for popup navigation items
 */
export const PopupGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: rem(8),
  width: '100%',
}));

/**
 * Individual popup navigation item as a Link
 */
export const PopupItemLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(10),
  borderRadius: rem(12),
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || 'rgba(0,0,0,0.04)',
    color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  },

  '&.active': {
    backgroundColor: 'rgba(119, 226, 13, 0.1)',
    color: '#4D9409',
    '& svg': {
      color: '#77E20D',
    },
  },
}));

/**
 * Individual popup navigation item as a Box (for buttons without href)
 */
export const PopupItemButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(10),
  borderRadius: rem(12),
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,
  transition: 'all 0.2s ease',

  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || 'rgba(0,0,0,0.04)',
    color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  },

  '&.active': {
    backgroundColor: 'rgba(119, 226, 13, 0.1)',
    color: '#4D9409',
    '& svg': {
      color: '#77E20D',
    },
  },
}));

/**
 * Icon container for popover items
 */
export const PopupItemIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(20),
  height: rem(20),
  marginBottom: rem(4),
  color: 'inherit',

  '& svg': {
    width: '100%',
    height: '100%',
    fill: 'currentColor',
  },
}));

/**
 * Label typography for popover items
 */
export const PopupItemLabel = styled(Typography)(() => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: rem(11),
  fontWeight: 500,
  textAlign: 'center',
  whiteSpace: 'nowrap',
  color: 'inherit',

  '.active &': {
    fontWeight: 600,
  },
}));
