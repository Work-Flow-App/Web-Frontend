import { Box, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';
import { floowColors } from '../../theme/colors';

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 2),
}));

export const DetailsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
  '@media (max-width: 960px)': {
    gap: theme.spacing(2),
  },
}));

export const DetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: '0 1px 3px ${floowColors.shadow.md}',
  height: '100%',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightSemiBold,
  marginBottom: theme.spacing(2),
  fontSize: rem(16),
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const SubSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightSemiBold,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
}));

export const Divider = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '1px',
  backgroundColor: theme.palette.divider,
  margin: theme.spacing(3, 0),
}));

export const PlaceholderText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  padding: theme.spacing(2, 0),
}));

export const TwoColumnLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(3),
  width: '100%',
  '@media (max-width: 960px)': {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));

export const ColumnBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Job Overview Card Styles
export const JobOverviewCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: '0 1px 3px ${floowColors.shadow.md}',
}));

export const JobTitle = styled('h1')(({ theme }) => ({
  fontSize: rem(28),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  margin: 0,
  marginBottom: theme.spacing(1),
}));

export const JobDescription = styled('p')(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  margin: 0,
  marginBottom: theme.spacing(3),
}));

export const MetadataRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(4),
  flexWrap: 'wrap',
  paddingTop: theme.spacing(2),
  margin: `0 -${theme.spacing(3)}`,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const MetadataColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(8),
}));

interface StatusBadgeProps {
  statusType?: string;
}

export const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusType',
})<StatusBadgeProps>(({ statusType = 'NEW' }) => {
  const getStatusStyles = () => {
    switch (statusType) {
      case 'NEW':
        return { backgroundColor: floowColors.statusBadge.active.bg, color: floowColors.statusBadge.active.text };
      case 'PENDING':
        return { backgroundColor: '#FFE0B2', color: '#E65100' };
      case 'IN_PROGRESS':
        return { backgroundColor: floowColors.statusBadge.pending.bg, color: floowColors.statusBadge.pending.text };
      case 'COMPLETED':
        return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case 'CANCELLED':
        return { backgroundColor: floowColors.statusBadge.inactive.bg, color: floowColors.statusBadge.inactive.text };
      default:
        return { backgroundColor: floowColors.statusBadge.default.bg, color: floowColors.statusBadge.default.text };
    }
  };

  const styles = getStatusStyles();

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: rem(6),
    padding: `${rem(6)} ${rem(12)}`,
    borderRadius: rem(6),
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    fontSize: rem(13),
    fontWeight: Bold._600,
    whiteSpace: 'nowrap',
  };
});

export const StatusIcon = styled('span')(() => ({
  width: rem(8),
  height: rem(8),
  borderRadius: '50%',
  backgroundColor: 'currentColor',
  display: 'inline-block',
}));

export const MetadataLabel = styled('span')(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  textTransform: 'capitalize',
}));

export const MetadataValue = styled('div')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const PriorityIndicator = styled('span')(() => ({
  width: rem(8),
  height: rem(8),
  borderRadius: '50%',
  backgroundColor: floowColors.chart.tertiary,
  display: 'inline-block',
}));

export const Avatar = styled('div')(({ theme }) => ({
  width: rem(28),
  height: rem(28),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightBold,
}));

export const TagsContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  marginLeft: 'auto',
}));

interface TagProps {
  color?: string;
}

export const Tag = styled('span')<TagProps>(({ color = floowColors.tag.default }) => ({
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(16),
  backgroundColor: color,
  color: floowColors.white,
  fontSize: rem(12),
  fontWeight: Bold._600,
  whiteSpace: 'nowrap',
}));

// Asset Chips Container and Styles
export const AssetChipsContainer = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(8),
  alignItems: 'center',
}));

export const AssetChip = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(8),
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.colors.white,
  whiteSpace: 'nowrap',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px ${floowColors.shadow.xxxl}',
  },
}));

// Workflow Stages Styles
export const WorkflowCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: '0 1px 3px ${floowColors.shadow.md}',
}));

export const WorkflowTitle = styled('h2')(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  margin: `0 -${theme.spacing(2.5)}`,
  marginBottom: theme.spacing(1.5),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const StagesContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(12),
  overflow: 'auto',
}));

interface StageArrowProps {
  color?: string;
  textColor?: string;
  active?: boolean;
}

export const StageArrow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'textColor' && prop !== 'active',
})<StageArrowProps>(({ color = '#E0E0E0', textColor = '#333', active = false }) => ({
  position: 'relative',
  padding: `${rem(18)} ${rem(40)}`,
  backgroundColor: color,
  minWidth: rem(220),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 24px 50%)',
  opacity: active ? 1 : 0.85,
  transition: 'all 0.3s ease',
  borderRadius: rem(4),
  '&:first-of-type': {
    clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)',
    borderRadius: `${rem(8)} 0 0 ${rem(8)}`,
  },
  '&:last-of-type': {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 24px 50%)',
    borderRadius: `0 ${rem(8)} ${rem(8)} 0`,
  },
  '&:hover': {
    opacity: 1,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px ${floowColors.shadow.xl}',
  },
  '& > span': {
    color: textColor,
  },
}));

export const StageText = styled('span')(() => ({
  fontSize: rem(14),
  fontWeight: Bold._600,
  position: 'relative',
  zIndex: 1,
}));

// Job Details Styles
export const DetailsSectionTitle = styled('h3')(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  margin: 0,
  marginBottom: theme.spacing(3),
}));

export const DetailsContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
}));

export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${rem(280)} 1fr`,
  gap: theme.spacing(4),
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  '@media (max-width: 960px)': {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
  },
}));

export const DetailLabel = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
}));

export const FieldIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  opacity: 0.7,
  '& svg': {
    fontSize: rem(18),
  },
}));

export const DetailValue = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  wordBreak: 'break-word',
}));

// Tabs Styles
export const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: rem(16),
  marginBottom: rem(32),
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  paddingBottom: 0,
  flexWrap: 'wrap',
  margin: `0 -${theme.spacing(2.5)} ${rem(32)} -${theme.spacing(2.5)}`,
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
}));

interface TabButtonProps {
  active?: boolean;
}

export const TabButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<TabButtonProps>(({ active = false }) => ({
  background: 'none',
  border: 'none',
  padding: `${rem(12)} ${rem(4)}`,
  fontSize: rem(15),
  fontWeight: active ? Bold._700 : Bold._500,
  color: active ? floowColors.tab.active : floowColors.tab.inactive,
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-1px',
    left: 0,
    right: 0,
    height: rem(2),
    backgroundColor: active ? floowColors.tab.active : 'transparent',
    transition: 'background-color 0.2s ease',
  },
  '&:hover': {
    color: active ? floowColors.tab.active : floowColors.grey[700],
  },
}));

export const TabContent = styled(Box)(() => ({
  paddingTop: rem(8),
}));

export const FieldTypeLabel = styled('span')(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.text.secondary,
  marginLeft: rem(6),
  fontStyle: 'italic',
}));

export const FieldsGroupTitle = styled('h4')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: 0,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const RequiredIndicator = styled('span')(() => ({
  color: floowColors.red.main,
  fontSize: rem(16),
  fontWeight: Bold._700,
  marginRight: rem(4),
}));

export const EmptyFieldText = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
  opacity: 0.7,
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '&:last-child': {
    marginBottom: 0,
  },
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.primary,
  fontWeight: theme.typography.fontWeightRegular,
}));

export const BreadcrumbContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: `${rem(14)} !important`,
  fontWeight: `${Bold._500} !important`,
  lineHeight: '1.5',
  margin: '0 !important',
}));

export const BreadcrumbLink = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textDecoration: 'underline',
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 0.8,
  },
}));

export const BreadcrumbSeparator = styled('span')(({ theme }) => ({
  color: theme.palette.text.secondary,
  userSelect: 'none',
  margin: `0 ${rem(2)}`,
}));

export const BreadcrumbCurrent = styled('span')(({ theme}) => ({
  color: theme.palette.text.primary,
}));

// New Job Details Layout Styles
export const JobDetailsLayout = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: theme.spacing(3),
  '@media (max-width: 1024px)': {
    gridTemplateColumns: '1fr',
  },
}));

export const WorkflowSidebar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
}));

export const WorkflowSidebarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const WorkflowSidebarTitle = styled('h3')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const WorkflowStepsList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

interface WorkflowStepItemProps {
  isActive?: boolean;
  isCompleted?: boolean;
  isExpanded?: boolean;
  isDelayed?: boolean;
}

export const WorkflowStepItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCompleted' && prop !== 'isExpanded' && prop !== 'isDelayed',
})<WorkflowStepItemProps>(({ theme, isActive, isCompleted, isDelayed }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  backgroundColor: isActive ? theme.palette.colors.grey_50 : 'transparent',
  '&:last-child': {
    borderBottom: 'none',
  },
  '& .step-header': {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.colors.grey_50,
    },
  },
  '& .step-indicator': {
    width: rem(24),
    height: rem(24),
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(1.5),
    backgroundColor: isCompleted
      ? '#E8F5E9'
      : isDelayed
        ? '#FFEBEE'
        : isActive
          ? '#FFF8E1'
          : theme.palette.colors.grey_200,
    color: isCompleted
      ? '#4CAF50'
      : isDelayed
        ? '#F44336'
        : isActive
          ? '#FFC107'
          : theme.palette.text.secondary,
    fontSize: rem(12),
    fontWeight: Bold._600,
  },
  '& .step-content': {
    flex: 1,
    minWidth: 0,
  },
  '& .step-name': {
    fontSize: rem(13),
    fontWeight: theme.typography.fontWeightMedium,
    color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
    marginBottom: rem(2),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .step-meta': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    fontSize: rem(11),
    color: theme.palette.text.secondary,
  },
  '& .step-expand': {
    marginLeft: 'auto',
    color: theme.palette.text.secondary,
    transition: 'transform 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const WorkflowStepDetails = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 6.5),
}));

export const StepDetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 0),
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  '& .label': {
    fontWeight: theme.typography.fontWeightMedium,
  },
  '& .value': {
    color: theme.palette.text.primary,
  },
}));

export const StepActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export const EventNoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.grey_50,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}));

export const EventNoteHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const EventNoteTitle = styled('span')(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
}));

export const EventNoteEditButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.primary.main,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 0.7,
  },
}));

export const EventNoteContent = styled('p')(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  margin: 0,
  lineHeight: 1.5,
}));

// Main Content Panel
export const MainContentPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

// Collapsible Section
interface CollapsibleSectionProps {
  isOpen?: boolean;
}

export const CollapsibleSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
}));

export const CollapsibleSectionHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<CollapsibleSectionProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  cursor: 'pointer',
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_50,
  },
}));

export const CollapsibleSectionTitle = styled('h3')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  margin: 0,
}));

export const CollapsibleSectionActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const CollapsibleSectionContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Comment Dialog Styles
export const CommentDialog = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: rem(360),
  maxHeight: rem(400),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1000,
}));

export const CommentDialogHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const CommentDialogTitle = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
}));

export const CommentDialogActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const CommentsList = styled(Box)(() => ({
  flex: 1,
  overflowY: 'auto',
  maxHeight: rem(280),
}));

export const CommentItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const CommentHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

export const CommentAuthorAvatar = styled(Box)<{ bgColor?: string }>(({ theme, bgColor }) => ({
  width: rem(28),
  height: rem(28),
  borderRadius: '50%',
  backgroundColor: bgColor || theme.palette.primary.main,
  color: theme.palette.colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightBold,
}));

export const CommentAuthorName = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
}));

export const CommentMention = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: '#D4A017',
}));

export const CommentTime = styled('span')(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  marginLeft: 'auto',
}));

export const CommentContent = styled('p')(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.primary,
  margin: 0,
  lineHeight: 1.5,
  paddingLeft: rem(36),
}));

export const CommentInputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const CommentInput = styled('input')(({ theme }) => ({
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: rem(13),
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  '&::placeholder': {
    color: theme.palette.text.secondary,
  },
}));

export const CommentSendButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: theme.spacing(0.5),
  cursor: 'pointer',
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_100,
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

// Detail Field Styles for new layout
export const FieldGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(3),
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
}));

export const FieldColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(16),
}));

export const FieldItem = styled(Box)(({ theme }) => ({
  '& .field-label': {
    fontSize: rem(13),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.secondary,
    marginBottom: rem(4),
  },
  '& .field-value': {
    fontSize: rem(14),
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.colors.grey_50,
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.spacing(0.5),
    minHeight: rem(36),
    display: 'flex',
    alignItems: 'center',
  },
}));

// Header with back navigation
export const JobHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

export const JobHeaderLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const BackButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: theme.spacing(0.5),
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'background-color 0.2s ease, color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_100,
    color: theme.palette.text.primary,
  },
}));

export const JobHeaderInfo = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const JobHeaderTitle = styled('h1')(({ theme }) => ({
  fontSize: rem(20),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  margin: 0,
}));

export const JobHeaderMeta = styled('span')(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
}));

export const JobHeaderRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

export const AssignedToSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  '& .label': {
    fontSize: rem(13),
    color: theme.palette.text.secondary,
  },
}));
