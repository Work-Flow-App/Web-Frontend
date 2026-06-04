import { Box, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../../../components/UI/Typography/utility';
import { floowColors } from '../../../../../theme/colors';

// ─── Re-export shared structural styles ───────────────────────────────────────

export {
  StepActivityLayout as WorkLogsLayout,
  StepsSidebar,
  StepsSidebarHeader,
  StepsSidebarTitle,
  StepsCountBadge,
  StepsScrollArea,
  StepRowItem,
  StepCircleIcon,
  StepTextGroup,
  StepNameText,
  StepStatusText,
  StepItemCountBadge,
  EmptyFeedBox,
} from './StepActivityTab.styles';

// ─── Right panel ──────────────────────────────────────────────────────────────

export const WorkLogsPanel = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  backgroundColor: floowColors.tailwind.gray[50],
}));

export const WorkLogsPanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.75, 3),
  backgroundColor: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const WorkLogsPanelHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

export const WorkLogsPanelTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(15),
  fontWeight: theme.typography.fontWeightBold,
  lineHeight: 1.25,
  color: theme.palette.text.primary,
}));

export const WorkLogsPanelMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
}));

export const WorkLogsHeaderCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'circleColor',
})<{ circleColor?: string }>(({ theme, circleColor }) => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  backgroundColor: circleColor || theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.white,
  fontSize: rem(13),
  fontWeight: Bold._700,
  flexShrink: 0,
}));

// ─── Stats row ────────────────────────────────────────────────────────────────

export const WorkLogsStatsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  backgroundColor: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  flexWrap: 'wrap',
}));

export const WorkLogStatCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
  padding: theme.spacing(1, 2),
  borderRadius: rem(8),
  backgroundColor: floowColors.tailwind.gray[50],
  border: `1px solid ${theme.palette.colors.grey_200}`,
  minWidth: rem(100),
}));

export const WorkLogStatLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
}));

export const WorkLogStatValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

// ─── Scroll area ──────────────────────────────────────────────────────────────

export const WorkLogsScrollArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2, 3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  minHeight: 0,
}));

// ─── Work log cards ───────────────────────────────────────────────────────────

export const WorkLogCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: rem(12),
  padding: theme.spacing(1.75, 2.5),
  boxShadow: `0 1px 4px ${floowColors.shadow.sm}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  transition: 'box-shadow 0.15s ease',
  '&:hover': {
    boxShadow: `0 3px 10px ${floowColors.shadow.md}`,
  },
}));

export const WorkLogCardTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
}));

export const WorkLogDateBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(4),
  padding: `${rem(3)} ${rem(10)}`,
  borderRadius: rem(6),
  backgroundColor: theme.palette.colors.grey_100,
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
}));

export const WorkLogTimeRange = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightMedium,
}));

export const WorkLogTimeSeparator = styled('span')(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: rem(12),
}));

export const WorkLogDurationBadge = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(4),
  padding: `${rem(3)} ${rem(10)}`,
  borderRadius: rem(20),
  backgroundColor: theme.palette.primary.main,
  color: floowColors.white,
  fontSize: rem(12),
  fontWeight: Bold._700,
  whiteSpace: 'nowrap',
  flexShrink: 0,
}));

export const WorkLogDescription = styled(Typography)(({ theme }) => ({
  fontSize: rem(13.5),
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  wordBreak: 'break-word',
  paddingLeft: rem(2),
}));

export const WorkLogCardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(0.5),
  borderTop: `1px solid ${theme.palette.colors.grey_100}`,
  marginTop: rem(2),
}));

export const WorkLogCreatedText = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
}));

export const WorkLogCardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));
