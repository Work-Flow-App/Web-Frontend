import { Box, Typography, Tabs, Tab, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';

export const SectionsGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  alignItems: 'start',
  gap: rem(24),
  width: '100%',
  '@media (max-width: 1024px)': {
    gap: rem(20),
    gridTemplateColumns: '1fr',
  },
}));

export const SideCol = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(18),
}));

export const SectionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(12),
  padding: rem(28),
  boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
  '@media (max-width: 1366px)': {
    padding: rem(20),
    gap: rem(16),
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  paddingBottom: rem(12),
  borderBottom: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  '@media (max-width: 1366px)': {
    fontSize: rem(15),
    paddingBottom: rem(10),
  },
}));

export const FieldRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

interface FieldValueProps {
  $empty?: boolean;
}

export const FieldValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$empty',
})<FieldValueProps>(({ theme, $empty }) => ({
  fontSize: rem(15),
  fontWeight: 400,
  fontStyle: $empty ? 'italic' : 'normal',
  color: $empty
    ? theme.palette.colors?.grey_400 || theme.palette.text.disabled
    : theme.palette.colors?.grey_900 || theme.palette.text.primary,
  '@media (max-width: 1366px)': {
    fontSize: rem(14),
  },
}));

export const FieldsGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: rem(16),
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: rem(300),
}));

export const PageContent = styled(Box)(() => ({
  maxWidth: rem(1200),
  width: '100%',
  margin: '0 auto',
  padding: `${rem(28)} ${rem(32)} ${rem(60)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
  '@media (max-width: 900px)': {
    padding: `${rem(20)} ${rem(16)} ${rem(40)}`,
  },
}));

/* ── Profile header (LinkedIn-style) ───────────────────────────────── */

export const ProfileHeaderCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(14),
  overflow: 'hidden',
}));

export const HeaderRow = styled(Box)(() => ({
  display: 'flex',
  gap: rem(20),
  alignItems: 'flex-start',
  padding: `${rem(24)} ${rem(28)} ${rem(20)}`,
  '@media (max-width: 640px)': {
    flexWrap: 'wrap',
  },
}));

export const HeaderTop = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: rem(16),
  flexWrap: 'wrap',
}));

export const IdBlock = styled(Box)(() => ({
  minWidth: 0,
}));

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(26),
  fontWeight: 700,
  margin: `0 0 ${rem(4)}`,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const HeaderTagline = styled(Typography)(({ theme }) => ({
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  fontSize: rem(14.5),
  margin: `0 0 ${rem(14)}`,
}));

export const HeaderMetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: rem(6),
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  fontSize: rem(13.5),
  '& a': {
    color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
    fontWeight: 500,
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.success?.main,
      textDecoration: 'underline',
    },
  },
}));

export const HeaderMetaDot = styled('span')(({ theme }) => ({
  color: theme.palette.colors?.grey_200 || theme.palette.grey[300],
}));

export const HeaderActionsRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
  flex: 'none',
}));

export const CopyLinkWrap = styled(Box)(() => ({
  position: 'relative',
}));

interface CopiedProps {
  $copied?: boolean;
}

export const CopyLinkButton = styled('button', {
  shouldForwardProp: (prop) => prop !== '$copied',
})<CopiedProps>(({ theme, $copied }) => ({
  width: rem(38),
  height: rem(38),
  borderRadius: '50%',
  border: `1.5px solid ${$copied ? theme.palette.success.main : theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  background: $copied ? theme.palette.success.light : theme.palette.colors?.white || theme.palette.background.paper,
  color: $copied ? theme.palette.success.main : theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: $copied ? theme.palette.success.main : theme.palette.colors?.grey_300 || theme.palette.grey[400],
  },
  '& svg': {
    fontSize: rem(17),
  },
}));

export const CopyTooltip = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$visible',
})<{ $visible?: boolean }>(({ theme, $visible }) => ({
  position: 'absolute',
  top: rem(-34),
  left: '50%',
  transform: `translateX(-50%) translateY(${$visible ? 0 : rem(2)})`,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: rem(11.5),
  fontWeight: 600,
  padding: `${rem(5)} ${rem(9)}`,
  borderRadius: rem(6),
  opacity: $visible ? 1 : 0,
  pointerEvents: 'none',
  transition: 'opacity 0.15s ease, transform 0.15s ease',
  whiteSpace: 'nowrap',
}));

/* ── Tabs ───────────────────────────────────────────────────────────── */

export const TabsWrapper = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.colors?.grey_100 || theme.palette.divider}`,
  padding: `0 ${rem(28)}`,
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: rem(44),
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.success.main,
    height: rem(3),
    borderRadius: `${rem(3)} ${rem(3)} 0 0`,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 600,
  fontSize: rem(14.5),
  textTransform: 'none',
  minHeight: rem(44),
  padding: `${rem(16)} ${rem(4)}`,
  marginRight: rem(22),
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  '&.Mui-selected': {
    color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  },
}));

export const TabContent = styled(Box)(() => ({
  width: '100%',
}));

/* ── Icon-row info list (read-only Overview) ───────────────────────── */

export const InfoGroup = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const InfoGroupLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  padding: `${rem(16)} ${rem(4)} ${rem(4)}`,
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
  padding: `${rem(11)} ${rem(4)}`,
  borderBottom: `1px solid ${theme.palette.colors?.grey_100 || theme.palette.grey[100]}`,
  borderRadius: rem(8),
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_50 || theme.palette.background.default,
  },
}));

export const InfoIconBadge = styled(Box)(({ theme }) => ({
  width: rem(32),
  height: rem(32),
  minWidth: rem(32),
  borderRadius: rem(9),
  backgroundColor: theme.palette.colors?.grey_100 || theme.palette.grey[100],
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  '& svg': {
    fontSize: rem(16),
  },
}));

export const InfoRowMain = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: rem(12),
}));

export const InfoRowLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13.5),
  fontWeight: 500,
  color: theme.palette.colors?.grey_500 || theme.palette.text.secondary,
  flex: 'none',
}));

export const InfoRowValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$empty',
})<{ $empty?: boolean }>(({ theme, $empty }) => ({
  fontSize: rem(14),
  fontWeight: $empty ? 400 : 500,
  color: $empty
    ? theme.palette.colors?.grey_300 || theme.palette.text.disabled
    : theme.palette.colors?.grey_900 || theme.palette.text.primary,
  textAlign: 'right',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

export const InfoAddButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  color: theme.palette.success.main,
  fontSize: rem(13.5),
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
  whiteSpace: 'nowrap',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

/* ── Empty state cards (Address / Bank) ────────────────────────────── */

export const EmptyCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.colors?.grey_200 || theme.palette.grey[200]}`,
  borderRadius: rem(14),
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  padding: `${rem(28)} ${rem(24)}`,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const EmptyCardIconBadge = styled(Box)(({ theme }) => ({
  width: rem(44),
  height: rem(44),
  borderRadius: rem(12),
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: rem(14),
  '& svg': {
    fontSize: rem(20),
  },
}));

export const EmptyCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  marginBottom: rem(2),
}));

export const EmptyCardText = styled(Typography)(({ theme }) => ({
  color: theme.palette.colors?.grey_400 || theme.palette.text.secondary,
  fontSize: rem(13.5),
  margin: `0 0 ${rem(18)}`,
}));
