import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem as MuiMenuItem,
  IconButton,
  LinearProgress,
  styled,
} from '@mui/material';
import type { SelectProps } from '@mui/material';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { rem } from '../../../components/UI/Typography/utility';
import { floowColors } from '../../../theme/colors';

// ─── Layout ───────────────────────────────────────────────────────────────────

export const SectionWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: rem(16),
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: rem(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: rem(12),
    marginBottom: rem(8),
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: 700,
  color: theme.palette.text.primary,
  letterSpacing: rem(-0.2),
}));

// ─── Stat Box (Work In Progress) ──────────────────────────────────────────────

export const StatBoxesContainer = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: rem(16),
  width: '100%',
}));

export const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  borderLeft: `${rem(4)} solid ${floowColors.info.main}`,
  boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.03)`,
  padding: `${rem(16)} ${rem(22)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(6),
  boxSizing: 'border-box',
  transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  '&:hover': {
    boxShadow: `0 ${rem(4)} ${rem(12)} rgba(0, 0, 0, 0.06)`,
  },
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
}));

export const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(28),
  fontWeight: 800,
  color: theme.palette.text.primary,
  lineHeight: 1.1,
}));

export const StatSubText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginTop: rem(2),
}));

export const StatProgressBar = styled(LinearProgress)(({ theme }) => ({
  borderRadius: rem(4),
  height: rem(6),
  backgroundColor: theme.palette.grey[100] || '#f3f4f6',
  '& .MuiLinearProgress-bar': {
    backgroundColor: floowColors.info.main,
    borderRadius: rem(4),
  },
}));

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────

export const PipelineBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  border: `${rem(1)} solid ${theme.palette.divider}`,
  borderRadius: rem(16),
  padding: `${rem(12)} ${rem(18)}`,
  boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.03)`,
  boxSizing: 'border-box',
}));

export const PipelineMoreWrapper = styled(Box)(() => ({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
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
  letterSpacing: rem(2),
}));

export const DropdownPopup = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: `calc(100% + ${rem(8)})`,
  right: 0,
  width: rem(250),
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(12),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  boxShadow: `0 ${rem(8)} ${rem(24)} rgba(0, 0, 0, 0.12)`,
  zIndex: 50,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

export const DropdownHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${rem(6)} ${rem(12)}`,
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

export const DropdownTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
}));

export const DropdownCloseButton = styled(IconButton)(({ theme }) => ({
  padding: rem(2),
  color: theme.palette.text.secondary,
  borderRadius: rem(4),
  '&:hover': {
    backgroundColor: theme.palette.action.hover || '#f3f4f6',
    color: theme.palette.text.primary,
  },
}));

export const DropdownCloseIcon = styled(CloseIcon)(() => ({
  fontSize: rem(15),
}));

export const DropdownListWrapper = styled(Box)(() => ({
  padding: `${rem(4)} 0`,
  maxHeight: rem(260),
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
}));

export const DropdownMenuItem = styled(Box)(({ theme }) => ({
  padding: `${rem(4)} ${rem(12)}`,
  cursor: 'pointer',
  transition: 'background-color 0.12s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover || '#f8fafc',
  },
}));

export const DropdownPipelineChip = styled(Box, {
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
  width: '100%',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: chipColor,
    color: '#fff',
  },
}));

// ─── Two-column content layout ────────────────────────────────────────────────

export const ContentRow = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: `1fr ${rem(320)}`,
  gap: rem(20),
  alignItems: 'flex-start',
  [`@media (max-width: ${rem(1100)})`]: {
    gridTemplateColumns: '1fr',
  },
}));

// ─── Job Events List ──────────────────────────────────────────────────────────

export const EventsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.03)`,
  overflow: 'hidden',
}));

export const EventsCardHeader = styled(Box)(({ theme }) => ({
  padding: `${rem(18)} ${rem(22)}`,
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
}));

export const EventsCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const EventsCardSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  marginTop: rem(2),
}));

export const EventRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(14),
  padding: `${rem(14)} ${rem(22)}`,
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'background-color 0.12s ease',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': {
    backgroundColor: theme.palette.action.hover || '#f8fafc',
  },
}));

export const CountBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeColor',
})<{ badgeColor: string }>(({ badgeColor }) => ({
  width: rem(52),
  height: rem(52),
  borderRadius: rem(10),
  backgroundColor: badgeColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: '#fff',
  fontWeight: 800,
  fontSize: rem(20),
  letterSpacing: rem(-0.5),
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
  fontSize: rem(14),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const EventNote = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  fontWeight: 400,
}));

export const EventSubText = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  marginTop: rem(3),
}));

export const ProgressTrack = styled(Box)(({ theme }) => ({
  width: '100%',
  height: rem(4),
  borderRadius: rem(2),
  backgroundColor: theme.palette.grey[100] || '#f3f4f6',
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
  color: theme.palette.grey[300] || '#d1d5db',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
}));

export const EventArrowIcon = styled(ChevronRightIcon)(() => ({
  color: floowColors.grey[300],
  fontSize: rem(20),
}));

// ─── Right Summary Panel ──────────────────────────────────────────────────────

export const SummaryCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(16),
  border: `${rem(1)} solid ${theme.palette.divider}`,
  boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.03)`,
  padding: rem(22),
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

export const SummaryTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: 700,
  color: theme.palette.text.primary,
  paddingBottom: rem(12),
  borderBottom: `${rem(1)} solid ${theme.palette.divider}`,
}));

export const SummaryStatRow = styled(Box)(() => ({
  display: 'flex',
  gap: rem(12),
  alignItems: 'center',
}));

export const SummaryBubbleItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const SummaryBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bubbleColor',
})<{ bubbleColor: string }>(({ bubbleColor }) => ({
  width: rem(54),
  height: rem(54),
  borderRadius: '50%',
  border: `${rem(2)} solid ${bubbleColor}`,
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
  textAlign: 'center',
  marginTop: rem(4),
}));

export const SummaryDivider = styled(Box)(({ theme }) => ({
  height: rem(1),
  backgroundColor: theme.palette.divider,
}));

export const SummarySection = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const SummarySectionLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
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
  color: theme.palette.text.primary,
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
  color: theme.palette.text.secondary,
  fontSize: rem(14),
  flexDirection: 'column',
  gap: rem(8),
}));

export const EmptyStateIcon = styled(WorkOutlineIcon)(() => ({
  fontSize: rem(40),
  opacity: 0.3,
}));

// ─── Primary Workflow Dropdown Extras ─────────────────────────────────────────

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: rem(8),
    width: '100%',
  },
}));

export const WorkflowFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: rem(200),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const WorkflowSelect = styled((props: SelectProps) =>
  React.createElement(Select, {
    ...props,
    MenuProps: {
      ...props.MenuProps,
      PaperProps: {
        ...props.MenuProps?.PaperProps,
        sx: {
          maxHeight: '25rem',
          borderRadius: rem(12),
          boxShadow: `0 ${rem(4)} ${rem(20)} rgba(0, 0, 0, 0.08)`,
          border: (t: any) => `${rem(1)} solid ${t.palette.divider}`,
          ...props.MenuProps?.PaperProps?.sx,
        },
      },
    },
  })
)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: 600,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: rem(10),
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

export const WorkflowAdornment = styled(AccountTreeOutlinedIcon)(() => ({
  fontSize: rem(16),
  marginRight: rem(4),
  color: floowColors.text.muted,
}));

export const WorkflowMenuItemContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(2),
  width: '100%',
}));

export const WorkflowName = styled('span')(() => ({
  fontSize: rem(13),
  fontWeight: 'inherit',
  color: 'inherit',
}));

export const WorkflowMenuItem = styled(MuiMenuItem, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted' && prop !== 'isPrimary' && prop !== 'isPrimaryMode',
})<{ isHighlighted?: boolean; isPrimary?: boolean; isPrimaryMode?: boolean }>(
  ({ isHighlighted, isPrimary, isPrimaryMode }) => ({
    fontSize: rem(13),
    fontWeight: (isHighlighted || isPrimary) ? 700 : 400,
    backgroundColor: isHighlighted 
      ? `${floowColors.indigo.main}0a` 
      : isPrimary 
        ? `${floowColors.indigo.main}05`
        : 'transparent',
    color: (isHighlighted || isPrimary) 
      ? floowColors.indigo.main 
      : 'inherit',
    borderRadius: rem(6),
    marginLeft: rem(4),
    marginRight: rem(4),
    transition: 'all 0.15s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    '&.Mui-selected': {
      backgroundColor: isHighlighted 
        ? `${floowColors.indigo.main}0f` 
        : isPrimary 
          ? `${floowColors.indigo.main}0a`
          : undefined,
      color: (isHighlighted || isPrimary) ? floowColors.indigo.main : undefined,
    },
    '&.Mui-selected:hover': {
      backgroundColor: isPrimaryMode
        ? (isHighlighted ? `${floowColors.indigo.main}0f` : 'transparent')
        : (isPrimary ? `${floowColors.indigo.main}0f` : undefined),
    },
    '&:hover': {
      backgroundColor: isPrimaryMode
        ? (isHighlighted ? `${floowColors.indigo.main}0f` : 'transparent')
        : isPrimary 
          ? `${floowColors.indigo.main}0a`
          : `${floowColors.grey[100]}80`,
      color: (isHighlighted || isPrimary) ? floowColors.indigo.main : undefined,
    },
  })
);

export const PrimaryTag = styled('span')(() => ({
  fontSize: rem(7.5),
  fontWeight: 800,
  textTransform: 'uppercase',
  color: floowColors.indigo.main,
  letterSpacing: rem(0.4),
  marginTop: rem(1),
  lineHeight: 1.1,
  flexShrink: 0,
}));

export const PrimaryMenuDivider = styled(Box)(({ theme }) => ({
  height: rem(1),
  backgroundColor: theme.palette.colors?.grey_100 || '#f3f4f6',
  margin: `${rem(4)} 0`,
}));

export const PrimaryMenuAction = styled(MuiMenuItem, {
  shouldForwardProp: (prop) => prop !== 'isSaveMode',
})<{ isSaveMode?: boolean }>(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(8),
  fontSize: rem(13),
  fontWeight: 700,
  color: floowColors.indigo.main,
  background: 'transparent',
  borderRadius: rem(6),
  margin: `${rem(6)} ${rem(8)}`,
  padding: `${rem(8)} ${rem(12)}`,
  border: `${rem(1)} solid ${floowColors.indigo.main}`,
  transition: 'all 0.15s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    background: `${floowColors.indigo.main}0d`,
    color: floowColors.indigo.main,
  },
  '&:active': {
    background: `${floowColors.indigo.main}1a`,
  },
}));

