import { styled, Box } from '@mui/material';
import { floowColors } from '../../../theme/colors';

export const WorkerShell = styled(Box)(() => ({
  width: '100%',
  maxWidth: 720,
  margin: '0 auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media (max-width: 600px)': {
    padding: '12px',
    gap: '12px',
  },
}));

export const WorkerHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '4px 0 8px',
  '& h1': {
    margin: 0,
    fontFamily: 'Manrope, sans-serif',
    fontSize: '22px',
    fontWeight: 800,
    color: floowColors.text.heading,
    letterSpacing: '-0.01em',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

export const BackIconButton = styled('button')(() => ({
  width: 36,
  height: 36,
  border: 'none',
  background: 'transparent',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: floowColors.text.heading,
  flexShrink: 0,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    background: floowColors.tailwind.gray[100],
  },
}));

export const FilterTabs = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  paddingBottom: '4px',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

interface FilterTabProps {
  active?: boolean;
}

export const FilterTab = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<FilterTabProps>(({ active }) => ({
  padding: '8px 16px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  border: `1px solid ${active ? floowColors.darkBlack : floowColors.tailwind.gray[200]}`,
  background: active ? floowColors.darkBlack : floowColors.white,
  color: active ? floowColors.white : floowColors.text.muted,
  borderRadius: '999px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  '&:hover': {
    borderColor: active ? floowColors.darkBlack : floowColors.tailwind.gray[300],
  },
}));

export const TaskList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

interface TaskCardProps {
  accentColor: string;
}

export const TaskCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentColor',
})<TaskCardProps>(({ accentColor }) => ({
  position: 'relative',
  background: floowColors.white,
  borderRadius: '14px',
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  padding: '14px 16px 14px 22px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  overflow: 'hidden',
  transition: 'all 0.2s ease',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 6,
    width: 4,
    borderRadius: '4px',
    background: accentColor,
  },
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
    borderColor: floowColors.tailwind.gray[300],
  },
}));

export const TaskCardTopRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap',
}));

export const RefBadgeRow = styled(Box)(() => ({
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
}));

export const RefBadge = styled(Box)(() => ({
  padding: '4px 10px',
  background: floowColors.tailwind.gray[100],
  borderRadius: '6px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  color: floowColors.text.muted,
  textTransform: 'uppercase',
}));

interface StatusPillProps {
  bg: string;
  fg: string;
}

export const StatusPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'fg',
})<StatusPillProps>(({ bg, fg }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 10px',
  borderRadius: '999px',
  background: bg,
  color: fg,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  '&::before': {
    content: '""',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: fg,
  },
}));

export const TaskTitle = styled('h3')(() => ({
  margin: 0,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '16px',
  fontWeight: 700,
  color: floowColors.text.heading,
  lineHeight: 1.3,
  letterSpacing: '-0.005em',
}));

export const TaskDescription = styled('p')(() => ({
  margin: 0,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  fontWeight: 400,
  color: floowColors.text.muted,
  lineHeight: 1.45,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

export const InfoBlock = styled(Box)(() => ({
  background: floowColors.tailwind.gray[50],
  borderRadius: '10px',
  padding: '10px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}));

export const InfoLine = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  color: floowColors.text.heading,
  lineHeight: 1.4,
  '& svg': {
    fontSize: 16,
    color: floowColors.text.muted,
    marginTop: 1,
    flexShrink: 0,
  },
}));

interface TimelineRowProps {
  fg: string;
}

export const TimelineRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'fg',
})<TimelineRowProps>(({ fg }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '12px',
  fontWeight: 600,
  color: fg,
  '& svg': {
    fontSize: 14,
    flexShrink: 0,
  },
}));

export const EmptyState = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '60px 24px',
  textAlign: 'center',
  color: floowColors.text.muted,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  '& svg': {
    fontSize: 48,
    opacity: 0.3,
  },
}));

export const LoadingBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 0',
}));

export const StepBadgesRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  marginBottom: '4px',
}));

export const PageTitle = styled('h1')(() => ({
  margin: '4px 0 12px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '26px',
  fontWeight: 800,
  color: floowColors.text.heading,
  letterSpacing: '-0.015em',
  lineHeight: 1.2,
  '@media (max-width: 600px)': {
    fontSize: '22px',
  },
}));

interface AccordionCardProps {
  accentColor: string;
}

export const AccordionCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accentColor',
})<AccordionCardProps>(({ accentColor }) => ({
  position: 'relative',
  background: floowColors.white,
  borderRadius: '14px',
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 14,
    bottom: 14,
    left: 6,
    width: 4,
    borderRadius: '4px',
    background: accentColor,
  },
}));

export const AccordionHeader = styled('button')(() => ({
  width: '100%',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px 14px 22px',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'Manrope, sans-serif',
  '&:hover': {
    background: floowColors.tailwind.gray[50],
  },
}));

interface AccordionIconProps {
  bg: string;
  fg: string;
}

export const AccordionIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'fg',
})<AccordionIconProps>(({ bg, fg }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: bg,
  color: fg,
  flexShrink: 0,
  '& svg': {
    fontSize: 18,
  },
}));

export const AccordionTitle = styled('span')(() => ({
  flex: 1,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '15px',
  fontWeight: 700,
  color: floowColors.text.heading,
  letterSpacing: '-0.005em',
}));

export const AccordionChevron = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.text.muted,
  transition: 'transform 0.2s ease',
  '& svg': {
    fontSize: 22,
  },
}));

export const AccordionBody = styled(Box)(() => ({
  padding: '4px 16px 16px 22px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderTop: `1px solid ${floowColors.tailwind.gray[100]}`,
  marginTop: 0,
  paddingTop: '14px',
}));

export const AccordionBodyRow = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  '& .label': {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: floowColors.text.muted,
    textTransform: 'uppercase',
  },
  '& .value': {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '14px',
    fontWeight: 500,
    color: floowColors.text.heading,
    lineHeight: 1.45,
    wordBreak: 'break-word',
  },
}));

export const PrimaryActionButton = styled('button')(() => ({
  width: '100%',
  padding: '12px 16px',
  border: 'none',
  borderRadius: '12px',
  background: 'rgba(244, 67, 54, 0.10)',
  color: '#D32F2F',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '0.01em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(244, 67, 54, 0.16)',
  },
  '& svg': {
    fontSize: 18,
  },
}));

export const StepActionsBar = styled(Box)(() => ({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '4px',
}));

export const FloatingActionButton = styled('button')(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '999px',
  background: '#FF8A00',
  color: floowColors.white,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '14px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(255, 138, 0, 0.35)',
  alignSelf: 'flex-end',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#F57C00',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(255, 138, 0, 0.45)',
  },
  '& svg': {
    fontSize: 18,
  },
}));

export const ActivityCard = styled(Box)(() => ({
  background: 'rgba(99, 102, 241, 0.10)',
  border: '1px solid rgba(99, 102, 241, 0.20)',
  borderRadius: '14px',
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: floowColors.indigo.main,
  '& svg': {
    fontSize: 20,
  },
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.16)',
  },
}));

export const ActivityTabsBar = styled(Box)(() => ({
  display: 'flex',
  gap: '6px',
  overflowX: 'auto',
  padding: '4px 0',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

export const ProgressOuter = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: 6,
  background: floowColors.tailwind.gray[200],
  borderRadius: 999,
  overflow: 'hidden',
}));

interface ProgressInnerProps {
  pct: number;
  fg: string;
}

export const ProgressInner = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'pct' && prop !== 'fg',
})<ProgressInnerProps>(({ pct, fg }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: `${Math.max(0, Math.min(100, pct))}%`,
  background: fg,
  borderRadius: 999,
  transition: 'width 0.3s ease',
}));

export const HeroCompletionCard = styled(Box)(() => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #1F1F23 0%, #0F0F12 100%)',
  borderRadius: '18px',
  padding: '20px 22px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  color: floowColors.white,
  fontFamily: 'Manrope, sans-serif',
  boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-40%',
    right: '-30%',
    width: '60%',
    height: '180%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  '& .label': {
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: '0.01em',
  },
  '& .value': {
    fontSize: '40px',
    fontWeight: 800,
    color: floowColors.white,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  },
  '& .meta': {
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.55)',
  },
}));

export const HeroProgressTrack = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  height: 8,
  background: 'rgba(255,255,255,0.10)',
  borderRadius: 999,
  overflow: 'hidden',
}));

interface HeroProgressFillProps {
  pct: number;
}

export const HeroProgressFill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'pct',
})<HeroProgressFillProps>(({ pct }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: `${Math.max(0, Math.min(100, pct))}%`,
  background: 'linear-gradient(90deg, #34D399 0%, #10B981 100%)',
  borderRadius: 999,
  transition: 'width 0.5s ease',
  boxShadow: '0 0 12px rgba(16,185,129,0.6)',
}));

export const SectionTitle = styled('h2')(() => ({
  margin: '4px 0 0',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '18px',
  fontWeight: 800,
  color: floowColors.text.heading,
  letterSpacing: '-0.01em',
}));

export const BreakdownGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '12px',
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  '@media (min-width: 900px)': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

interface BreakdownTileProps {
  iconBg: string;
  iconFg: string;
}

export const BreakdownTile = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'iconBg' && prop !== 'iconFg',
})<BreakdownTileProps>(({ iconBg, iconFg }) => ({
  background: floowColors.white,
  borderRadius: '14px',
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  fontFamily: 'Manrope, sans-serif',
  minWidth: 0,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
    borderColor: floowColors.tailwind.gray[300],
  },
  '& .icon': {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: iconBg,
    color: iconFg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      fontSize: 20,
    },
  },
  '& .count': {
    fontSize: '28px',
    fontWeight: 800,
    color: floowColors.text.heading,
    lineHeight: 1,
  },
  '& .name': {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: floowColors.text.muted,
  },
}));

export const DistributionCard = styled(Box)(() => ({
  background: floowColors.white,
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  borderRadius: '14px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  '& h3': {
    margin: 0,
    fontFamily: 'Manrope, sans-serif',
    fontSize: '15px',
    fontWeight: 700,
    color: floowColors.text.heading,
  },
}));

export const DistributionRow = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '88px 1fr 28px',
  alignItems: 'center',
  gap: '12px',
  fontFamily: 'Manrope, sans-serif',
  '& .label': {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: floowColors.text.muted,
  },
  '& .count': {
    fontSize: '14px',
    fontWeight: 800,
    color: floowColors.text.heading,
    textAlign: 'right',
  },
}));

interface DistributionBarFillProps {
  pct: number;
  fg: string;
}

export const DistributionBar = styled(Box)(() => ({
  position: 'relative',
  height: 8,
  background: floowColors.tailwind.gray[100],
  borderRadius: 999,
  overflow: 'hidden',
}));

export const DistributionBarFill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'pct' && prop !== 'fg',
})<DistributionBarFillProps>(({ pct, fg }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  width: `${Math.max(0, Math.min(100, pct))}%`,
  background: fg,
  borderRadius: 999,
  transition: 'width 0.5s ease',
}));

export const LocationCard = styled(Box)(() => ({
  background: floowColors.white,
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  borderRadius: '14px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'Manrope, sans-serif',
  '&:hover': {
    borderColor: floowColors.tailwind.gray[300],
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
  },
  '& .icon': {
    width: 36,
    height: 36,
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#B91C1C',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '& svg': {
      fontSize: 20,
    },
  },
  '& .body': {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  '& .title': {
    fontSize: '13px',
    fontWeight: 700,
    color: floowColors.text.heading,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .meta': {
    fontSize: '12px',
    fontWeight: 500,
    color: floowColors.text.muted,
    lineHeight: 1.3,
  },
  '& .chevron': {
    color: floowColors.tailwind.gray[300],
    flexShrink: 0,
    '& svg': {
      fontSize: 22,
    },
  },
}));

export const StatsGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '10px',
  '@media (min-width: 720px)': {
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '16px',
  },
}));

interface StatCardProps {
  accent: string;
}

export const StatCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'accent',
})<StatCardProps>(({ accent }) => ({
  position: 'relative',
  background: floowColors.white,
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  borderRadius: '14px',
  padding: '14px 14px 14px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  fontFamily: 'Manrope, sans-serif',
  minWidth: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 6,
    width: 3,
    borderRadius: '3px',
    background: accent,
  },
  '& .label': {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: floowColors.text.muted,
    lineHeight: 1.3,
  },
  '& .value': {
    fontSize: '28px',
    fontWeight: 800,
    color: floowColors.text.heading,
    lineHeight: 1.1,
  },
  '& .meta': {
    fontSize: '11px',
    fontWeight: 600,
    color: floowColors.text.muted,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    '& svg': {
      fontSize: 14,
    },
  },
}));

export const SectionHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '10px',
  '& h2': {
    margin: 0,
    fontFamily: 'Manrope, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: floowColors.text.heading,
  },
  '& .subtitle': {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '12px',
    color: floowColors.text.muted,
    fontWeight: 500,
  },
}));

export const PipelineRail = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  overflowX: 'auto',
  padding: '4px 2px',
  WebkitOverflowScrolling: 'touch',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

interface PipelinePillProps {
  bg: string;
  fg: string;
  active?: boolean;
}

export const PipelinePill = styled('button', {
  shouldForwardProp: (prop) => prop !== 'bg' && prop !== 'fg' && prop !== 'active',
})<PipelinePillProps>(({ bg, fg, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  border: 'none',
  borderRadius: '999px',
  background: bg,
  color: fg,
  fontFamily: 'Manrope, sans-serif',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: 'all 0.2s ease',
  outline: active ? `2px solid ${fg}` : 'none',
  outlineOffset: '1px',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
  '& .count': {
    background: 'rgba(0,0,0,0.08)',
    borderRadius: '999px',
    padding: '0 8px',
    fontSize: '11px',
    fontWeight: 800,
  },
}));

export const PipelineArrow = styled('span')(() => ({
  fontSize: '18px',
  color: floowColors.tailwind.gray[300],
  flexShrink: 0,
  fontWeight: 700,
}));

export const EventCard = styled(Box)(() => ({
  background: floowColors.white,
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  borderRadius: '14px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
}));

export const EventRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 8px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: floowColors.tailwind.gray[50],
  },
  '& + &': {
    borderTop: `1px solid ${floowColors.tailwind.gray[100]}`,
  },
}));

interface EventBadgeProps {
  bg: string;
}

export const EventBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bg',
})<EventBadgeProps>(({ bg }) => ({
  width: 40,
  height: 40,
  borderRadius: '10px',
  background: bg,
  color: floowColors.white,
  fontFamily: 'Manrope, sans-serif',
  fontWeight: 800,
  fontSize: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const EventBody = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  '& .name': {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '14px',
    fontWeight: 700,
    color: floowColors.text.heading,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .meta': {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '12px',
    fontWeight: 500,
    color: floowColors.text.muted,
  },
}));

export const EventChevron = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.tailwind.gray[300],
  flexShrink: 0,
  '& svg': {
    fontSize: 22,
  },
}));

export const WorkLogsHeader = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
  '& h3': {
    margin: 0,
    fontFamily: 'Manrope, sans-serif',
    fontSize: '15px',
    fontWeight: 700,
    color: floowColors.text.heading,
  },
}));

export const WorkLogsSummaryGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '8px',
  '@media (min-width: 600px)': {
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  },
}));

export const WorkLogsSummaryTile = styled(Box)(() => ({
  background: floowColors.tailwind.gray[50],
  border: `1px solid ${floowColors.tailwind.gray[100]}`,
  borderRadius: '10px',
  padding: '10px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontFamily: 'Manrope, sans-serif',
  '& .label': {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: floowColors.text.muted,
  },
  '& .value': {
    fontSize: '18px',
    fontWeight: 800,
    color: floowColors.text.heading,
    lineHeight: 1.2,
  },
}));

export const WorkLogList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
}));

export const WorkLogItem = styled(Box)(() => ({
  position: 'relative',
  background: floowColors.white,
  border: `1px solid ${floowColors.tailwind.gray[200]}`,
  borderRadius: '12px',
  padding: '12px 14px 12px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 6,
    width: 3,
    borderRadius: '3px',
    background: '#FF8A00',
  },
}));

export const WorkLogTopRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap',
  fontFamily: 'Manrope, sans-serif',
  '& .date': {
    fontSize: '13px',
    fontWeight: 700,
    color: floowColors.text.heading,
  },
  '& .duration': {
    fontSize: '13px',
    fontWeight: 700,
    color: '#B45309',
    background: 'rgba(245, 158, 11, 0.14)',
    padding: '3px 10px',
    borderRadius: '999px',
  },
}));

export const WorkLogTimeRow = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: 'Manrope, sans-serif',
  fontSize: '12px',
  fontWeight: 600,
  color: floowColors.text.muted,
  '& svg': {
    fontSize: 14,
  },
}));

export const WorkLogDescription = styled(Box)(() => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: '13px',
  fontWeight: 400,
  color: floowColors.text.heading,
  lineHeight: 1.45,
  wordBreak: 'break-word',
}));

export const WorkLogMeta = styled(Box)(() => ({
  fontFamily: 'Manrope, sans-serif',
  fontSize: '11px',
  fontWeight: 500,
  color: floowColors.text.muted,
}));

export const StatusTheme = {
  COMPLETED: { accent: '#10B981', pillBg: 'rgba(16, 185, 129, 0.12)', pillFg: '#047857' },
  STARTED: { accent: '#2563EB', pillBg: 'rgba(37, 99, 235, 0.12)', pillFg: '#1D4ED8' },
  ONGOING: { accent: '#2563EB', pillBg: 'rgba(37, 99, 235, 0.12)', pillFg: '#1D4ED8' },
  PENDING: { accent: '#F59E0B', pillBg: 'rgba(245, 158, 11, 0.14)', pillFg: '#B45309' },
  INITIATED: { accent: '#8B5CF6', pillBg: 'rgba(139, 92, 246, 0.12)', pillFg: '#6D28D9' },
  SKIPPED: { accent: '#6B7280', pillBg: 'rgba(107, 114, 128, 0.16)', pillFg: '#374151' },
  NOT_STARTED: { accent: '#9CA3AF', pillBg: 'rgba(156, 163, 175, 0.18)', pillFg: '#4B5563' },
} as const;

export type StatusKey = keyof typeof StatusTheme;

export const resolveStatusTheme = (status?: string) => {
  const key = (status || 'NOT_STARTED').toUpperCase() as StatusKey;
  return StatusTheme[key] || StatusTheme.NOT_STARTED;
};
