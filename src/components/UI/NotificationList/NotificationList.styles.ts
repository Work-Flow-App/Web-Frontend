import { styled, Box, Avatar } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

// Table Tile - Main notification container
export const NotificationListContainer = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: rem(10),
  gap: rem(8),
  width: rem(336),
  maxHeight: rem(400),
  background: floowColors.white,
  border: `1px solid ${floowColors.grey[200]}`,
  boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.1)',
  borderRadius: rem(12),
  overflowY: 'auto',

  '&::-webkit-scrollbar': {
    width: rem(6),
  },
  '&::-webkit-scrollbar-thumb': {
    background: floowColors.grey[300],
    borderRadius: rem(3),
  },
  '&::-webkit-scrollbar-track': {
    background: floowColors.grey[100],
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: rem(336),
  },
}));

// Header section
export const NotificationHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0px',
  width: '100%',
  flexShrink: 0,
}));

export const NotificationTitle = styled(Box)(() => ({
  fontSize: rem(16),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.black,
  lineHeight: 1.5,
}));

export const ClearAllButton = styled(Box)(() => ({
  fontSize: rem(14),
  fontWeight: 500,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.error.main,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.8,
  },
}));

// Notification items container
export const NotificationItems = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: rem(8),
  width: '100%',
  flex: 1,
}));

// Frame 2095585195/196/197 - Individual notification item
export const NotificationItemContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: rem(8),
  width: '100%',
  flexShrink: 0,
  flexGrow: 0,
}));

// Notification content wrapper
export const NotificationContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '0px',
  gap: rem(10),
  width: '100%',
}));

// Notification icon/avatar container
export const NotificationIconContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(40),
  height: rem(40),
  flexShrink: 0,
  borderRadius: rem(8),
  background: floowColors.grey[100],

  '& svg': {
    width: rem(24),
    height: rem(24),
  },
}));

export const NotificationAvatar = styled(Avatar)(() => ({
  width: rem(40),
  height: rem(40),
  fontSize: rem(14),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  flexShrink: 0,
}));

// Notification text content
export const NotificationTextContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0px',
  gap: rem(4),
  flex: 1,
  minWidth: 0,
}));

export const NotificationMainText = styled(Box)(() => ({
  fontSize: rem(14),
  fontWeight: 500,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.black,
  lineHeight: 1.4,
  wordWrap: 'break-word',
  width: '100%',
}));

export const NotificationSubText = styled(Box)(() => ({
  fontSize: rem(12),
  fontWeight: 400,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[500],
  lineHeight: 1.3,
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

// User profile section - Frame 2095585177
export const UserProfileSection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '0px',
  gap: rem(4),
  maxWidth: '100%',
  height: rem(16),
  flex: '1 1 auto',
  order: 0,
  minWidth: 0,
  overflow: 'hidden',
}));

export const UserProfileAvatar = styled(Avatar)(() => ({
  width: rem(16),
  height: rem(16),
  fontSize: rem(8),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  borderRadius: rem(2),
  flexShrink: 0,
  flex: 'none',
  order: 0,
  flexGrow: 0,
}));

export const UserProfileName = styled(Box)(() => ({
  maxWidth: rem(100),
  height: rem(16),
  fontSize: rem(12),
  fontWeight: 500,
  fontFamily: 'Manrope, sans-serif',
  lineHeight: rem(16),
  letterSpacing: '0.005em',
  color: floowColors.grey[900],
  flex: '1 1 auto',
  order: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

// Action buttons container - Frame 2095585160
export const NotificationActions = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '0px',
  gap: rem(10),
  width: rem(316),
  height: rem(32),
  flex: 'none',
  order: 1,
  alignSelf: 'stretch',
  flexGrow: 0,
}));

// Mail icon button - Left button with border
export const MailButton = styled(Box)(() => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: rem(8),
  gap: rem(4),
  width: rem(153),
  height: rem(32),
  border: `1px solid ${floowColors.grey[200]}`,
  borderRadius: rem(6),
  flex: 'none',
  order: 0,
  flexGrow: 1,
  cursor: 'pointer',
  transition: 'all 0.2s ease',

  '&:hover': {
    borderColor: floowColors.grey[300],
    background: floowColors.grey[50],
  },

  '&:active': {
    transform: 'scale(0.98)',
  },
}));

// View button wrapper - Right button to match MailButton dimensions
export const ViewButtonWrapper = styled(Box)(() => ({
  width: rem(153),
  height: rem(32),
  flex: 'none',
  order: 1,
  flexGrow: 1,

  '& > button': {
    width: '100%',
    height: '100%',
    minHeight: rem(32),
    padding: rem(8),
    fontSize: rem(14),
    fontWeight: 500,
    textTransform: 'none',
  },
}));

// Divider between notifications
export const NotificationDivider = styled(Box)(() => ({
  width: '100%',
  height: '1px',
  background: floowColors.grey[200],
  margin: `${rem(4)} 0`,
}));
