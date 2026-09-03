import { styled, Box, Avatar } from '@mui/material';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

type Variant = 'dropdown' | 'page';
const shouldForwardVariant = (prop: string) => prop !== 'variant';

// Main notification list container — compact popover in the bell dropdown,
// full-width card on the standalone Notifications page.
export const NotificationListContainer = styled(Box, { shouldForwardProp: shouldForwardVariant })<{
  variant?: Variant;
}>(({ theme, variant = 'dropdown' }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  background: floowColors.white,
  borderRadius: rem(12),
  overflow: 'hidden',

  ...(variant === 'dropdown'
    ? {
        width: rem(384),
        maxWidth: '92vw',
        maxHeight: rem(480),
        border: `1px solid ${floowColors.grey[200]}`,
        boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
      }
    : {
        width: '100%',
        border: `1px solid ${floowColors.grey[200]}`,
        boxShadow: 'none',
      }),

  [theme.breakpoints.down('sm')]: {
    width: variant === 'dropdown' ? '100%' : '100%',
    maxWidth: variant === 'dropdown' ? rem(384) : '100%',
  },
}));

// Header section
export const NotificationHeader = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${rem(14)} ${rem(16)}`,
  width: '100%',
  flexShrink: 0,
  borderBottom: `1px solid ${floowColors.grey[100]}`,
}));

export const NotificationTitleGroup = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const NotificationTitle = styled(Box)(() => ({
  fontSize: rem(16),
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.black,
  lineHeight: 1.4,
}));

export const UnreadCountBadge = styled(Box)(() => ({
  fontSize: rem(12),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.white,
  background: floowColors.error.main,
  borderRadius: rem(10),
  padding: `${rem(1)} ${rem(7)}`,
  lineHeight: 1.6,
}));

export const MarkAllReadButton = styled('button')(() => ({
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: rem(13),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.blue.main,
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.75,
    textDecoration: 'underline',
  },
  '&:disabled': {
    color: floowColors.grey[400],
    cursor: 'default',
    textDecoration: 'none',
  },
}));

// Group/category filter chip row
export const FilterBar = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: rem(8),
  padding: `${rem(10)} ${rem(16)}`,
  width: '100%',
  overflowX: 'auto',
  flexShrink: 0,
  borderBottom: `1px solid ${floowColors.grey[100]}`,

  '&::-webkit-scrollbar': {
    height: rem(4),
  },
  '&::-webkit-scrollbar-thumb': {
    background: floowColors.grey[300],
    borderRadius: rem(2),
  },
}));

export const FilterChip = styled('button', { shouldForwardProp: (prop) => prop !== 'active' })<{
  active?: boolean;
}>(({ active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(6),
  whiteSpace: 'nowrap',
  flexShrink: 0,
  border: `1px solid ${active ? floowColors.black : floowColors.grey[200]}`,
  background: active ? floowColors.black : floowColors.white,
  color: active ? floowColors.white : floowColors.grey[700],
  borderRadius: rem(20),
  padding: `${rem(6)} ${rem(12)}`,
  fontSize: rem(13),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.15s ease',

  '&:hover': {
    borderColor: floowColors.black,
  },
}));

export const FilterChipCount = styled('span', { shouldForwardProp: (prop) => prop !== 'active' })<{
  active?: boolean;
}>(({ active }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: active ? floowColors.white : floowColors.grey[500],
}));

// Notification items container
export const NotificationItems = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  flex: 1,
  overflowY: 'auto',

  '&::-webkit-scrollbar': {
    width: rem(6),
  },
  '&::-webkit-scrollbar-thumb': {
    background: floowColors.grey[300],
    borderRadius: rem(3),
  },
  '&::-webkit-scrollbar-track': {
    background: floowColors.grey[50],
  },
}));

// Individual notification row
export const NotificationItemContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'unread' && prop !== 'accentColor',
})<{ unread?: boolean; accentColor?: string }>(({ unread, accentColor }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: rem(12),
  width: '100%',
  padding: `${rem(12)} ${rem(16)}`,
  cursor: 'pointer',
  background: unread ? floowColors.blue[50] : 'transparent',
  borderLeft: `3px solid ${accentColor ?? 'transparent'}`,
  transition: 'background 0.15s ease',

  '&:hover': {
    background: unread ? floowColors.blue[50] : floowColors.grey[50],
  },
  '&:hover .notification-mark-read': {
    opacity: 1,
    pointerEvents: 'auto',
  },
  '&:focus-visible': {
    outline: `2px solid ${floowColors.blue.main}`,
    outlineOffset: rem(-2),
  },
}));

export const NotificationIconCircle = styled(Box, { shouldForwardProp: (prop) => prop !== 'color' && prop !== 'bg' })<{
  color?: string;
  bg?: string;
}>(({ color, bg }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(40),
  height: rem(40),
  flexShrink: 0,
  borderRadius: '50%',
  background: bg ?? floowColors.grey[100],
  color: color ?? floowColors.grey[500],

  '& svg': {
    fontSize: rem(20),
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

// Text content
export const NotificationTextContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(2),
  flex: 1,
  minWidth: 0,
}));

export const NotificationTopRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: rem(8),
  width: '100%',
}));

export const NotificationMainText = styled(Box, { shouldForwardProp: (prop) => prop !== 'unread' })<{
  unread?: boolean;
}>(({ unread }) => ({
  fontSize: rem(14),
  fontWeight: unread ? 700 : 500,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.black,
  lineHeight: 1.4,
  wordBreak: 'break-word',
}));

export const NotificationSubText = styled(Box)(() => ({
  fontSize: rem(13),
  fontWeight: 400,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[600],
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

export const NotificationMetaRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  marginTop: rem(4),
  minHeight: rem(18),
}));

export const CategoryLabel = styled('span', { shouldForwardProp: (prop) => prop !== 'color' })<{ color?: string }>(
  ({ color }) => ({
    fontSize: rem(12),
    fontWeight: 600,
    fontFamily: 'Manrope, sans-serif',
    color: color ?? floowColors.grey[500],
  })
);

export const MetaDot = styled('span')(() => ({
  width: rem(3),
  height: rem(3),
  borderRadius: '50%',
  background: floowColors.grey[400],
  flexShrink: 0,
}));

export const MetaTime = styled('span')(() => ({
  fontSize: rem(12),
  fontWeight: 400,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[500],
  whiteSpace: 'nowrap',
}));

export const UrgentTag = styled('span')(() => ({
  fontSize: rem(11),
  fontWeight: 700,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.error.main,
  background: floowColors.error.light,
  borderRadius: rem(4),
  padding: `0 ${rem(6)}`,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
}));

export const UnreadDot = styled(Box)(() => ({
  width: rem(9),
  height: rem(9),
  borderRadius: '50%',
  background: floowColors.blue.main,
  flexShrink: 0,
  marginTop: rem(4),
}));

export const MarkReadButton = styled('button')(() => ({
  border: 'none',
  background: 'transparent',
  padding: 0,
  marginLeft: 'auto',
  fontSize: rem(12),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.blue.main,
  cursor: 'pointer',
  opacity: 0,
  pointerEvents: 'none',
  transition: 'opacity 0.15s ease',
  whiteSpace: 'nowrap',

  '&:focus-visible': {
    opacity: 1,
    pointerEvents: 'auto',
    outline: `2px solid ${floowColors.blue.main}`,
  },
}));

// Divider between notifications
export const NotificationDivider = styled(Box)(() => ({
  width: '100%',
  height: '1px',
  background: floowColors.grey[100],
}));

// Empty state
export const EmptyState = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(8),
  width: '100%',
  padding: `${rem(48)} ${rem(24)}`,
  color: floowColors.grey[400],

  '& svg': {
    fontSize: rem(36),
    color: floowColors.grey[300],
  },
}));

export const EmptyStateTitle = styled(Box)(() => ({
  fontSize: rem(14),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[600],
}));

export const EmptyStateSubtitle = styled(Box)(() => ({
  fontSize: rem(13),
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.grey[400],
  textAlign: 'center',
}));

// Skeleton row (loading)
export const SkeletonRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: rem(12),
  width: '100%',
  padding: `${rem(12)} ${rem(16)}`,
}));

// Footer — e.g. "View all notifications" link in the dropdown
export const NotificationFooter = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: rem(12),
  borderTop: `1px solid ${floowColors.grey[100]}`,
  flexShrink: 0,
}));

export const FooterLink = styled('button')(() => ({
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: rem(13),
  fontWeight: 600,
  fontFamily: 'Manrope, sans-serif',
  color: floowColors.blue.main,
  cursor: 'pointer',

  '&:hover': {
    textDecoration: 'underline',
  },
}));
