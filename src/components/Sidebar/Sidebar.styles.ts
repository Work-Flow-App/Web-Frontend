import { styled, Box, IconButton, Typography, ListItemButton, ListItemIcon } from '@mui/material';
import { Link } from 'react-router-dom';
import { rem } from '../Typography/utility';

interface SidebarWrapperProps {
  isCollapsed?: boolean;
}

/**
 * Main sidebar container
 */
export const SidebarWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed',
})<SidebarWrapperProps>(({ theme, isCollapsed }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: isCollapsed ? rem(80) : rem(250),
  height: '100vh',
  padding: rem(16),
  gap: rem(8),
  backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  borderRight: `${rem(1)} solid ${theme.palette.colors?.grey_200 || theme.palette.divider}`,
  overflow: 'auto',
  boxSizing: 'border-box',
  flexShrink: 0,
  transition: 'width 0.3s ease',

  [theme.breakpoints.down('lg')]: {
    width: isCollapsed ? rem(75) : rem(220),
    padding: rem(14),
  },

  [theme.breakpoints.down('md')]: {
    width: isCollapsed ? rem(70) : rem(200),
    padding: rem(12),
  },

  [theme.breakpoints.down('sm')]: {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: rem(250),
    height: '100vh',
    padding: rem(16),
    zIndex: 1200,
    display: 'flex',
    transform: isCollapsed ? 'translateX(-100%)' : 'translateX(0)',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'transform, visibility',
    visibility: isCollapsed ? 'hidden' : 'visible',
  },
}));

/**
 * Individual sidebar item button
 */
export const SidebarItemButton = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: `${rem(8)} ${rem(12)}`,
  gap: rem(12),
  width: '100%',
  minHeight: rem(40),
  backgroundColor: 'transparent',
  borderRadius: rem(10),
  cursor: 'pointer',
  border: 'none',
  fontSize: rem(14),
  fontWeight: 500,
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,
  userSelect: 'none',
  transition: 'all 0.25s ease',
  boxSizing: 'border-box',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    height: 0,
    width: rem(3),
    borderRadius: rem(3),
    background: '#6366F1',
    transform: 'translateY(-50%)',
    transition: 'height 0.25s ease',
  },

  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || theme.palette.action.hover,
    color: theme.palette.colors?.grey_800 || theme.palette.text.primary,
    transform: 'translateX(3px)',
  },

  '&.active': {
    backgroundColor: 'rgba(99, 102, 241, 0.10)',
    color: '#4338CA',
    fontWeight: 700,

    '&::before': {
      height: '60%',
    },

    '& svg': {
      color: '#6366F1',
    },
  },

  [theme.breakpoints.down('lg')]: {
    padding: `${rem(7)} ${rem(11)}`,
    minHeight: rem(38),
    fontSize: rem(13),
  },

  [theme.breakpoints.down('md')]: {
    padding: `${rem(6)} ${rem(10)}`,
    minHeight: rem(36),
  },

  [theme.breakpoints.down('sm')]: {
    padding: `${rem(8)} ${rem(10)}`,
    minHeight: rem(36),
    fontSize: rem(12),
    gap: rem(8),
  },
}));

/**
 * Parent item — overrides justifyContent to space-between for expand icon
 */
export const SidebarParentItemButton = styled(SidebarItemButton)(() => ({
  justifyContent: 'space-between',
  alignItems: 'center',
}));

/**
 * Child sidebar item — slightly smaller font than parent
 */
export const SidebarChildItemButton = styled(SidebarItemButton)(() => ({
  fontSize: rem(13),
}));

/**
 * Icon wrapper for sidebar items
 */
export const IconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: rem(20),
  height: rem(20),

  '& svg': {
    width: '100%',
    height: '100%',
    fill: 'currentColor',
  },
}));

interface SidebarBackdropProps {
  isVisible?: boolean;
}

/**
 * Mobile sidebar backdrop/overlay
 */
export const SidebarBackdrop = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVisible',
})<SidebarBackdropProps>(({ theme, isVisible }) => ({
  display: 'none',

  [theme.breakpoints.down('sm')]: {
    display: isVisible ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.colors?.overlay_backdrop || 'rgba(0, 0, 0, 0.5)',
    zIndex: 1100,
    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    willChange: 'opacity',
  },
}));

/**
 * Logo section at top of sidebar
 */
export const SidebarLogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(12),
  paddingBottom: rem(16),
  borderBottom: `${rem(1)} solid ${theme.palette.colors?.grey_200 || theme.palette.divider}`,
  boxSizing: 'border-box',
  width: '100%',

  '& img': {
    height: rem(28),
    width: 'auto',
    maxWidth: '100%',
  },

  [theme.breakpoints.down('lg')]: {
    gap: rem(10),
    paddingBottom: rem(14),
    '& img': { height: rem(26) },
  },

  [theme.breakpoints.down('md')]: {
    gap: rem(8),
    paddingBottom: rem(12),
    '& img': { height: rem(24) },
  },

  [theme.breakpoints.down('sm')]: {
    gap: rem(6),
    paddingBottom: rem(10),
    '& img': { height: rem(22) },
  },
}));

/**
 * Desktop-only logo row — hidden on xs, flex from sm up
 */
export const SidebarDesktopLogoRow = styled(Box)(() => ({
  display: 'none',
  '@media (min-width:600px)': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}));

/**
 * Bare logo section variant — no padding, no border, flex: 1
 */
export const SidebarLogoSectionFlat = styled(Box)(() => ({
  flex: 1,
  margin: 0,
  padding: 0,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/**
 * Mobile header row — logo + close button, xs only
 */
export const SidebarMobileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(8),
  paddingBottom: rem(12),
  marginBottom: rem(12),
  borderBottom: `${rem(1)} solid ${theme.palette.colors?.grey_200 || theme.palette.divider}`,

  '@media (min-width:600px)': {
    display: 'none',
  },
}));

/**
 * Mobile header brand block — icon + name/subtitle stack
 */
export const SidebarMobileBrand = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),

  '& img': {
    height: rem(28),
    width: rem(28),
    objectFit: 'contain',
  },
}));

/**
 * Brand text stack (name + optional subtitle)
 */
export const SidebarBrandTextStack = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 1.1,
}));

/**
 * Brand name label
 */
export const SidebarBrandName = styled(Box)(({ theme }) => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: rem(15),
  fontWeight: 800,
  color: theme.palette.colors?.text_heading || theme.palette.text.primary,
  letterSpacing: '-0.01em',
}));

/**
 * Brand subtitle label (e.g. workspace tag)
 */
export const SidebarBrandSubtitle = styled(Box)(() => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: rem(10),
  fontWeight: 700,
  color: '#6366F1',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}));

/**
 * Close button in mobile header
 */
export const SidebarCloseButton = styled(IconButton)(({ theme }) => ({
  padding: rem(4),
  minWidth: rem(36),
  minHeight: rem(36),
  color: theme.palette.colors?.grey_700 || theme.palette.text.secondary,

  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_100 || theme.palette.action.hover,
    color: theme.palette.colors?.grey_800 || theme.palette.text.primary,
  },
}));

/**
 * Collapsed state — centred icon-only logo row
 */
export const SidebarCollapsedLogoRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingBottom: rem(16),
}));

/**
 * Full-width wrapper for parent nav items with children
 */
export const SidebarNavItemWrapper = styled(Box)(() => ({
  width: '100%',
}));

/**
 * Parent item content row — icon + label
 */
export const SidebarParentItemContent = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
}));

/**
 * Wrapper for the child items list under a collapsible parent
 */
export const SidebarChildItemsList = styled(Box)(() => ({
  paddingLeft: rem(32),
  paddingTop: rem(8),
}));

/**
 * Router Link wrapper — resets anchor styles for nav items
 */
export const SidebarNavLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  width: '100%',
}));

/**
 * Popover content wrapper
 */
export const SidebarPopoverContent = styled(Box)(() => ({
  paddingTop: rem(8),
  paddingBottom: rem(8),
}));

/**
 * Popover section header — uppercase label above child list
 */
export const SidebarPopoverLabel = styled(Typography)(() => ({
  paddingLeft: rem(16),
  paddingRight: rem(16),
  paddingBottom: rem(6),
  fontSize: rem(11),
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'text.secondary',
}));

/**
 * Popover list item button
 */
export const SidebarPopoverListItem = styled(ListItemButton)(() => ({
  paddingLeft: rem(16),
  paddingRight: rem(16),
  paddingTop: rem(8),
  paddingBottom: rem(8),
  gap: rem(4),
})) as typeof ListItemButton;

/**
 * Popover list item icon
 */
export const SidebarPopoverListIcon = styled(ListItemIcon)(() => ({
  minWidth: rem(32),

  '& svg': {
    fontSize: rem(16),
  },
}));

/**
 * Logo section variant used in collapsed state — no margin, padding, or border
 */
export const SidebarCollapsedLogoSection = styled(Box)(() => ({
  margin: 0,
  padding: 0,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/**
 * Popover paper props — passed to Popover slotProps.paper
 */
export const sidebarPopoverPaperProps = {
  sx: {
    ml: rem(4),
    borderRadius: rem(8),
    minWidth: rem(180),
  },
};

/**
 * Popover list item primary text props factory
 * Returns slotProps.primary for ListItemText based on active state
 */
export const sidebarPopoverTextSlotProps = (isActive: boolean) => ({
  primary: {
    fontSize: rem(13),
    fontWeight: isActive ? 600 : 400,
  },
});