import { Box, Typography, styled } from '@mui/material';
import { rem } from '../../../../../components/UI/Typography/utility';

export const Container = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  padding: rem(20),
  display: 'flex',
  flexDirection: 'column',
  height: rem(380),
  maxHeight: rem(380),
  width: '100%',
  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
  boxSizing: 'border-box',
}));

export const Header = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: rem(16),
  flexShrink: 0,
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ActionLink = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
  transition: 'color 0.15s ease',
  '&:hover': {
    color: theme.palette.primary.dark,
    textDecoration: 'underline',
  },
}));

export const AnnouncementsList = styled(Box)(() => ({
  width: '100%',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: rem(12),
  paddingRight: rem(6),
  '&::-webkit-scrollbar': {
    width: rem(4),
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#e4e4e7',
    borderRadius: rem(4),
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#d4d4d8',
  },
}));

export const AnnouncementItem = styled(Box)(({ theme }) => ({
  borderRadius: rem(12),
  border: `${rem(1)} solid ${theme.palette.grey[200]}`,
  padding: rem(14),
  backgroundColor: theme.palette.grey[50],
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
  flexShrink: 0,
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: theme.palette.grey[300],
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
  },
}));

// ── Post header (avatar + author block) ───────────────────────────────────────

export const PostHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
}));

export const AuthorAvatar = styled(Box)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  minWidth: rem(36),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: rem(13),
  fontWeight: 700,
  flexShrink: 0,
}));

export const AuthorBlock = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  minWidth: 0,
}));

export const AuthorName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

export const AuthorMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: rem(4),
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  '& svg': {
    fontSize: rem(12),
  },
}));

export const MetaDot = styled('span')(({ theme }) => ({
  width: rem(3),
  height: rem(3),
  borderRadius: '50%',
  backgroundColor: theme.palette.text.secondary,
  display: 'inline-block',
  flexShrink: 0,
}));

// ── Rich-text content area (mirrors PostCard.styles.ts PostContent) ───────────

export const RichContent = styled('div')(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  wordBreak: 'break-word',
  '& p': {
    margin: 0,
    '& + p': { marginTop: rem(4) },
  },
  '& em, & i': { fontStyle: 'italic !important' },
  '& u': { textDecoration: 'underline' },
  '& strong, & b': { fontWeight: 700 },
  '& h1': { fontSize: rem(17), fontWeight: 700, margin: `${rem(8)} 0 ${rem(4)} 0` },
  '& h2': { fontSize: rem(15), fontWeight: 600, margin: `${rem(6)} 0 ${rem(4)} 0` },
  '& h3': { fontSize: rem(13), fontWeight: 600, margin: `${rem(4)} 0 ${rem(2)} 0` },
  '& ul, & ol': {
    paddingLeft: rem(18),
    margin: `${rem(4)} 0`,
    '& li': { marginBottom: rem(2) },
  },
  '& blockquote': {
    borderLeft: `${rem(3)} solid ${theme.palette.grey[300]}`,
    paddingLeft: rem(10),
    marginLeft: 0,
    marginRight: 0,
    marginTop: rem(4),
    marginBottom: rem(4),
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  '& mark': {
    backgroundColor: '#fef08a',
    borderRadius: rem(2),
    padding: `${rem(1)} ${rem(2)}`,
  },
}));

// ── Skeleton & empty state ────────────────────────────────────────────────────

export const SkeletonHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(10),
}));

export const SkeletonMeta = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
  flex: 1,
}));

export const EmptyText = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));
