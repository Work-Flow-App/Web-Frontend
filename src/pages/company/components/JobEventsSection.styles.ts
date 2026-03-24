import { Box, Typography, Button, styled } from '@mui/material';
import { rem } from '../../../components/UI/Typography/utility';
import { floowColors } from '../../../theme/colors';

// ─── Layout ───────────────────────────────────────────────────────────────────

export const SectionWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: rem(16),
}));

export const SectionHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: rem(4),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(26),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const NewJobButton = styled(Button)(() => ({
  backgroundColor: floowColors.blue.hover,
  color: floowColors.white,
  fontWeight: 600,
  fontSize: rem(14),
  borderRadius: rem(8),
  padding: `${rem(10)} ${rem(20)}`,
  textTransform: 'none',
  gap: rem(8),
  '&:hover': {
    backgroundColor: floowColors.blue.dark,
  },
}));

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────

export const PipelineBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  overflowX: 'auto',
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  border: `1px solid ${theme.palette.colors?.grey_200 || '#e5e7eb'}`,
  borderRadius: rem(12),
  padding: `${rem(10)} ${rem(16)}`,
  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  '&::-webkit-scrollbar': { height: rem(3) },
  '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.12)', borderRadius: rem(2) },
}));

export const PipelineChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'chipColor' && prop !== 'isActive',
})<{ chipColor: string; isActive?: boolean }>(({ chipColor, isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  padding: `${rem(6)} ${rem(14)}`,
  backgroundColor: isActive ? chipColor : `${chipColor}20`,
  color: isActive ? '#fff' : chipColor,
  borderRadius: rem(20),
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.18s ease',
  fontWeight: 600,
  fontSize: rem(13),
  flexShrink: 0,
  '&:hover': {
    backgroundColor: chipColor,
    color: '#fff',
  },
}));

export const PipelineChipCount = styled('span')(() => ({
  fontWeight: 800,
  fontSize: rem(14),
}));

export const PipelineChipName = styled('span')(() => ({
  fontWeight: 600,
}));

export const PipelineArrow = styled(Box)(({ theme }) => ({
  color: theme.palette.colors?.grey_300 || '#d1d5db',
  fontSize: rem(18),
  lineHeight: 1,
  flexShrink: 0,
  padding: `0 ${rem(4)}`,
  userSelect: 'none',
}));

export const PipelineMore = styled(Box)(({ theme }) => ({
  color: theme.palette.colors?.grey_500 || '#6b7280',
  fontSize: rem(18),
  padding: `0 ${rem(8)}`,
  cursor: 'pointer',
  fontWeight: 700,
  letterSpacing: '2px',
}));

// ─── Two-column content layout ────────────────────────────────────────────────

export const ContentRow = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 320px',
  gap: rem(20),
  alignItems: 'flex-start',
  '@media (max-width: 1100px)': {
    gridTemplateColumns: '1fr',
  },
}));

// ─── Job Events List ──────────────────────────────────────────────────────────

export const EventsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(14),
  border: `1px solid ${theme.palette.colors?.grey_200 || '#e5e7eb'}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  overflow: 'hidden',
}));

export const EventsCardHeader = styled(Box)(({ theme }) => ({
  padding: `${rem(18)} ${rem(20)}`,
  borderBottom: `1px solid ${theme.palette.colors?.grey_100 || '#f3f4f6'}`,
}));

export const EventsCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(17),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const EventsCardSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || '#6b7280',
  marginTop: rem(2),
}));

export const EventRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
  padding: `${rem(14)} ${rem(20)}`,
  borderBottom: `1px solid ${theme.palette.colors?.grey_100 || '#f3f4f6'}`,
  cursor: 'pointer',
  transition: 'background 0.12s ease',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': {
    backgroundColor: theme.palette.colors?.grey_50 || '#f9fafb',
  },
}));

export const CountBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeColor',
})<{ badgeColor: string }>(({ badgeColor }) => ({
  width: rem(56),
  height: rem(56),
  borderRadius: rem(10),
  backgroundColor: badgeColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: '#fff',
  fontWeight: 800,
  fontSize: rem(20),
  letterSpacing: '-0.5px',
}));

export const EventInfo = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const EventNameRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: rem(6),
  flexWrap: 'wrap',
}));

export const EventName = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: 600,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
}));

export const EventNote = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_400 || '#9ca3af',
  fontWeight: 400,
}));

export const EventSubText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || '#6b7280',
  marginTop: rem(3),
}));

export const ProgressTrack = styled(Box)(({ theme }) => ({
  width: '100%',
  height: rem(4),
  borderRadius: rem(2),
  backgroundColor: theme.palette.colors?.grey_100 || '#f3f4f6',
  marginTop: rem(6),
  overflow: 'hidden',
}));

export const ProgressFill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fillColor' && prop !== 'fillPct',
})<{ fillColor: string; fillPct: number }>(({ fillColor, fillPct }) => ({
  height: '100%',
  width: `${Math.max(fillPct, 4)}%`,
  backgroundColor: fillColor,
  borderRadius: rem(2),
  transition: 'width 0.4s ease',
}));

export const EventArrow = styled(Box)(({ theme }) => ({
  color: theme.palette.colors?.grey_300 || '#d1d5db',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
}));

// ─── Right Summary Panel ──────────────────────────────────────────────────────

export const SummaryCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors?.white || theme.palette.background.paper,
  borderRadius: rem(14),
  border: `1px solid ${theme.palette.colors?.grey_200 || '#e5e7eb'}`,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  padding: rem(20),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

export const SummaryTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: 700,
  color: theme.palette.colors?.grey_900 || theme.palette.text.primary,
  paddingBottom: rem(8),
  borderBottom: `1px solid ${theme.palette.colors?.grey_100 || '#f3f4f6'}`,
}));

export const SummaryStatRow = styled(Box)(() => ({
  display: 'flex',
  gap: rem(12),
  alignItems: 'center',
}));

export const SummaryBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bubbleColor',
})<{ bubbleColor: string }>(({ bubbleColor }) => ({
  width: rem(54),
  height: rem(54),
  borderRadius: '50%',
  border: `2px solid ${bubbleColor}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: bubbleColor,
  fontWeight: 700,
  fontSize: rem(18),
  flexShrink: 0,
}));

export const SummaryBubbleLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.colors?.grey_500 || '#6b7280',
}));

export const SummaryDivider = styled(Box)(({ theme }) => ({
  height: '1px',
  backgroundColor: theme.palette.colors?.grey_100 || '#f3f4f6',
}));

export const SummarySectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: theme.palette.colors?.grey_400 || '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  marginBottom: rem(6),
}));

export const SummaryRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(5)} 0`,
}));

export const SummaryRowName = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.colors?.grey_700 || theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
}));

export const SummaryRowCount = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'countColor',
})<{ countColor?: string }>(({ countColor }) => ({
  fontSize: rem(13),
  fontWeight: 700,
  color: countColor || floowColors.text.label,
  marginLeft: rem(8),
  flexShrink: 0,
}));

// ─── Shared ───────────────────────────────────────────────────────────────────

export const LoadingBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(60),
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${rem(48)} ${rem(20)}`,
  color: theme.palette.colors?.grey_400 || '#9ca3af',
  fontSize: rem(14),
  flexDirection: 'column',
  gap: rem(8),
}));
