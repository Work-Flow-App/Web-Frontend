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
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  '&.cancel': {
    color: theme.palette.text.secondary,
  },
  '&.delete': {
    color: floowColors.red.main,
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

// Attachment & Comment Section Styles
export const AttachmentList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const AttachmentItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.colors.grey_100}`,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.colors.grey_50,
  },
}));

export const AttachmentFileName = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  '& .name': {
    fontSize: rem(12),
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .date': {
    fontSize: rem(10),
    color: theme.palette.text.secondary,
  },
}));

export const AttachmentActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));

export const UploadDropzone = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  cursor: 'pointer',
  border: `1px dashed ${theme.palette.colors.grey_300}`,
  borderRadius: theme.spacing(0.5),
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.colors.grey_50,
  },
}));

export const AddMoreButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  cursor: 'pointer',
  border: `1px dashed ${theme.palette.colors.grey_300}`,
  borderRadius: theme.spacing(0.5),
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  transition: 'border-color 0.2s ease, color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

export const CommentList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

export const CommentItemBox = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  paddingBottom: theme.spacing(1),
}));

export const CommentContentRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
}));

export const CommentActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginLeft: theme.spacing(1),
}));

export const CommentTimestamp = styled(Box)(({ theme }) => ({
  fontSize: rem(10),
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

export const ButtonActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  justifyContent: 'flex-end',
}));

export const NewCommentBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const StyledTextField = styled('textarea')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  fontSize: rem(12),
  fontFamily: 'inherit',
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: theme.spacing(0.5),
  resize: 'vertical',
  minHeight: '60px',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  '&:focus': {
    borderColor: theme.palette.primary.main,
  },
  '&::placeholder': {
    color: theme.palette.text.secondary,
  },
}));

// Additional Information Section Styles
export const AdditionalInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const FormLabel = styled('label')(({ theme }) => ({
  display: 'block',
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export const DescriptionTextArea = styled('textarea')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1.5),
  fontSize: rem(14),
  fontFamily: 'inherit',
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: theme.spacing(0.5),
  backgroundColor: theme.palette.colors.grey_50,
  resize: 'vertical',
  minHeight: rem(120),
  outline: 'none',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  '&:hover': {
    borderColor: theme.palette.colors.grey_400,
  },
  '&:focus': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.colors.white,
  },
  '&::placeholder': {
    color: theme.palette.text.secondary,
  },
}));

export const UploadArea = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging',
})<{ isDragging?: boolean }>(({ theme, isDragging }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  cursor: 'pointer',
  border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.colors.grey_300}`,
  borderRadius: theme.spacing(1),
  backgroundColor: isDragging ? theme.palette.primary.light + '10' : 'transparent',
  transition: 'border-color 0.2s ease, background-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.colors.grey_50,
  },
}));

export const UploadText = styled(Box)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

export const UploadHighlight = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: theme.typography.fontWeightMedium,
}));

export const UploadSubtext = styled(Box)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

// Documents Tab Styles
export const DocumentsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(2),
}));

export const DocumentCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 12px ${floowColors.shadow.md}`,
  },
}));

export const DocumentCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

export const DocumentIcon = styled(Box)(({ theme }) => ({
  width: rem(40),
  height: rem(40),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.colors.grey_100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const DocumentInfo = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
}));

export const DocumentName = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginBottom: rem(2),
}));

export const DocumentMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
}));

export const DocumentStepBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: `${rem(4)} ${rem(8)}`,
  borderRadius: rem(4),
  backgroundColor: theme.palette.colors.grey_100,
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));

export const DocumentCardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1.5),
  paddingTop: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.colors.grey_100}`,
}));

export const DocumentsEmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  textAlign: 'center',
}));

export const DocumentsEmptyIcon = styled(Box)(({ theme }) => ({
  width: rem(64),
  height: rem(64),
  borderRadius: '50%',
  backgroundColor: theme.palette.colors.grey_100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export const DocumentsEmptyText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export const DocumentsEmptySubtext = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
}));

// ============================================
// Gantt Chart / Activity Log Styles
// ============================================

export const GanttHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const GanttTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& span': {
    fontSize: rem(18),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
  },
}));

export const GanttStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flexWrap: 'wrap',
}));

export const GanttStatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .label': {
    fontSize: rem(12),
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  '& .value': {
    fontSize: rem(14),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    '&.completed': {
      color: '#10B981',
    },
    '&.in-progress': {
      color: '#3B82F6',
    },
  },
}));

export const GanttProgressBar = styled(Box)(({ theme }) => ({
  width: rem(100),
  height: rem(8),
  backgroundColor: theme.palette.colors.grey_200,
  borderRadius: rem(4),
  overflow: 'hidden',
}));

export const GanttProgressFill = styled(Box)(() => ({
  height: '100%',
  background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
  borderRadius: rem(4),
  transition: 'width 0.3s ease',
}));

export const GanttContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
}));

export const GanttDateHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  backgroundColor: floowColors.grey[50],
  borderBottom: `2px solid ${theme.palette.colors.grey_200}`,
  '@media (max-width: 768px)': {
    gridTemplateColumns: '180px 1fr',
  },
}));

export const GanttTaskColumn = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderRight: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
}));

export const GanttTimelineColumn = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1.5, 2),
  minHeight: rem(40),
  display: 'flex',
  alignItems: 'center',
}));

export const GanttDateMarker = styled(Box)(({ theme }) => ({
  position: 'absolute',
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
}));

export const GanttBody = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

interface GanttRowProps {
  isEven?: boolean;
}

export const GanttRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isEven',
})<GanttRowProps>(({ theme, isEven }) => ({
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  backgroundColor: isEven ? theme.palette.colors.grey_50 : theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: floowColors.blue[50],
  },
  '&:last-child': {
    borderBottom: 'none',
  },
  '@media (max-width: 768px)': {
    gridTemplateColumns: '180px 1fr',
  },
}));

export const GanttTaskInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 0),
}));

export const GanttTaskIndex = styled(Box)(() => ({
  width: rem(28),
  height: rem(28),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(12),
  fontWeight: Bold._700,
  flexShrink: 0,
}));

export const GanttTaskDetails = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(4),
}));

export const GanttTaskName = styled(Box)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const GanttTaskMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

export const GanttStatusBadge = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(4),
  padding: `${rem(2)} ${rem(8)}`,
  borderRadius: rem(12),
  fontSize: rem(10),
  fontWeight: Bold._600,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  '& span': {
    whiteSpace: 'nowrap',
  },
}));

export const GanttActivityIndicators = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const GanttActivityBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: rem(2),
  padding: `${rem(2)} ${rem(6)}`,
  borderRadius: rem(8),
  backgroundColor: theme.palette.colors.grey_100,
  fontSize: rem(10),
  color: theme.palette.text.secondary,
  cursor: 'default',
  '& span': {
    fontWeight: Bold._600,
  },
}));

export const GanttTimelineGrid = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
}));

export const GanttGridLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '1px',
  backgroundColor: theme.palette.colors.grey_100,
}));

interface GanttBarProps {
  isCompleted?: boolean;
}

export const GanttBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCompleted',
})<GanttBarProps>(({ isCompleted }) => ({
  position: 'absolute',
  height: rem(32),
  borderRadius: rem(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${rem(8)}`,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  minWidth: rem(60),
  ...(isCompleted && {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)',
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 10,
  },
}));

export const GanttBarContent = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: rem(8),
}));

export const GanttBarWorkers = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(2),
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: rem(11),
  fontWeight: Bold._600,
}));

export const GanttBarDuration = styled(Box)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  color: 'rgba(255, 255, 255, 0.95)',
  whiteSpace: 'nowrap',
}));

export const GanttLegend = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const GanttLegendTitle = styled(Box)(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const GanttLegendItems = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

export const GanttLegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: 'capitalize',
}));

export const GanttLegendColor = styled(Box)(() => ({
  width: rem(12),
  height: rem(12),
  borderRadius: rem(3),
  flexShrink: 0,
}));

// ============================================
// Activity Timeline Styles (Expandable Section)
// ============================================

export const ActivityTimelineContainer = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.grey[50],
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  padding: theme.spacing(2, 2, 2, 3),
}));

export const ActivityTimelineHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px dashed ${theme.palette.colors.grey_300}`,
  '& span': {
    fontSize: rem(13),
    fontWeight: theme.typography.fontWeightSemiBold,
    color: theme.palette.text.secondary,
  },
}));

export const ActivityTimelineList = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export const ActivityTimelineItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  position: 'relative',
}));

interface ActivityTimelineConnectorProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export const ActivityTimelineConnector = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFirst' && prop !== 'isLast',
})<ActivityTimelineConnectorProps>(({ theme, isFirst, isLast }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: isFirst ? '50%' : 0,
    bottom: isLast ? '50%' : 0,
    left: '50%',
    width: '2px',
    backgroundColor: theme.palette.colors.grey_300,
    transform: 'translateX(-50%)',
  },
}));

export const ActivityTimelineDot = styled(Box)(() => ({
  width: rem(32),
  height: rem(32),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.white,
  flexShrink: 0,
  position: 'relative',
  zIndex: 1,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const ActivityTimelineContent = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingBottom: theme.spacing(2),
  minWidth: 0,
}));

export const ActivityTimelineRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(0.5),
  flexWrap: 'wrap',
}));


export const ActivityTimelineTime = styled(Box)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

export const ActivityTimelineMessage = styled(Box)(({ theme }) => ({
  fontSize: rem(13),
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  padding: theme.spacing(1, 1.5),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  marginTop: theme.spacing(0.5),
  wordBreak: 'break-word',
}));

export const ActivityTimelineActor = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.75),
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  '& span': {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

// ============================================
// Gantt Activity Row Styles (for individual activities)
// ============================================

export const ActivityMarker = styled(Box)(() => ({
  position: 'absolute',
  width: rem(24),
  height: rem(24),
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.white,
  transform: 'translateX(-50%)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  border: `2px solid ${floowColors.white}`,
  top: '50%',
  marginTop: rem(-12),
  '&:hover': {
    transform: 'translateX(-50%) scale(1.2)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    zIndex: 100,
  },
}));

interface GanttActivityRowProps {
  isEven?: boolean;
}

export const GanttActivityRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isEven',
})<GanttActivityRowProps>(({ theme, isEven }) => ({
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  backgroundColor: isEven ? floowColors.grey[50] : floowColors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  minHeight: rem(48),
  '&:hover': {
    backgroundColor: floowColors.blue[50],
  },
  '@media (max-width: 768px)': {
    gridTemplateColumns: '180px 1fr',
  },
}));

export const GanttActivityTaskColumn = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  paddingLeft: theme.spacing(6),
  borderRight: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
}));

export const ActivityRowInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
}));

export const ActivityRowIcon = styled(Box)(() => ({
  width: rem(28),
  height: rem(28),
  borderRadius: rem(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const ActivityRowDetails = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(2),
}));

export const ActivityRowType = styled(Box)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
}));

export const ActivityRowMessage = styled(Box)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '180px',
}));

export const ActivityBar = styled(Box)(() => ({
  position: 'absolute',
  height: rem(28),
  minWidth: rem(80),
  borderRadius: rem(14),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `0 ${rem(12)}`,
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
  top: '50%',
  transform: 'translateY(-50%)',
  '&:hover': {
    transform: 'translateY(-50%) scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 10,
  },
}));

export const ActivityBarContent = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(6),
  color: floowColors.white,
  fontSize: rem(11),
  fontWeight: Bold._600,
  whiteSpace: 'nowrap',
}));

// ============================================
// Industry Standard Gantt Chart Styles
// ============================================

export const GanttChartHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: floowColors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const GanttChartTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& span': {
    fontSize: rem(18),
    fontWeight: Bold._700,
    color: '#1E3A5F',
  },
}));

export const GanttChartStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

export const GanttChartStatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: floowColors.grey[50],
  borderRadius: theme.spacing(0.5),
  minWidth: rem(70),
  '& .value': {
    fontSize: rem(16),
    fontWeight: Bold._700,
    color: '#1E3A5F',
  },
  '& .label': {
    fontSize: rem(10),
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
}));

export const GanttChartWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: floowColors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  overflow: 'hidden',
}));

export const GanttChartGrid = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  borderBottom: `2px solid ${floowColors.grey[300]}`,
}));

export const GanttChartTaskHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: floowColors.grey[100],
  fontSize: rem(12),
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  borderRight: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const GanttChartTimelineHeader = styled(Box)(() => ({
  display: 'flex',
  backgroundColor: floowColors.grey[100],
}));

interface GanttChartDateCellProps {
  isToday?: boolean;
  isWeekend?: boolean;
}

export const GanttChartDateCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isToday' && prop !== 'isWeekend',
})<GanttChartDateCellProps>(({ theme, isToday, isWeekend }) => ({
  flex: 1,
  minWidth: rem(40),
  padding: theme.spacing(0.5),
  textAlign: 'center',
  borderRight: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: isToday ? '#EEF2FF' : isWeekend ? floowColors.grey[50] : 'transparent',
  '& .day': {
    display: 'block',
    fontSize: rem(14),
    fontWeight: isToday ? Bold._700 : Bold._500,
    color: isToday ? '#4F46E5' : theme.palette.text.primary,
  },
  '& .month': {
    display: 'block',
    fontSize: rem(9),
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
}));

export const GanttChartBody = styled(Box)(() => ({
  maxHeight: '500px',
  overflowY: 'auto',
}));

interface GanttChartRowProps {
  isMainTask?: boolean;
  isSubTask?: boolean;
}

export const GanttChartRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMainTask' && prop !== 'isSubTask',
})<GanttChartRowProps>(({ theme, isMainTask, isSubTask }) => ({
  display: 'grid',
  gridTemplateColumns: '250px 1fr',
  borderBottom: `1px solid ${theme.palette.colors.grey_100}`,
  backgroundColor: isMainTask ? floowColors.white : floowColors.grey[50],
  minHeight: isMainTask ? rem(44) : rem(36),
  '&:hover': {
    backgroundColor: isMainTask ? floowColors.blue[50] : '#F8FAFC',
  },
}));

export const GanttChartTaskCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  borderRight: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
}));

export const GanttChartTaskName = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  width: '100%',
  '& .name': {
    fontSize: rem(13),
    fontWeight: Bold._600,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  '& .count': {
    fontSize: rem(11),
    color: theme.palette.text.secondary,
    flexShrink: 0,
  },
}));

export const GanttChartTaskIcon = styled(Box)(() => ({
  width: rem(22),
  height: rem(22),
  borderRadius: rem(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}));

export const GanttChartSubTaskName = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(3),
  width: '100%',
  '& .type': {
    fontSize: rem(11),
    fontWeight: Bold._600,
    flexShrink: 0,
    minWidth: rem(70),
  },
  '& .message': {
    fontSize: rem(11),
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
}));

export const GanttChartActivityIcon = styled(Box)(() => ({
  width: rem(18),
  height: rem(18),
  borderRadius: rem(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: floowColors.white,
  flexShrink: 0,
}));

export const GanttChartTimelineCell = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
}));

export const GanttChartGridColumns = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  pointerEvents: 'none',
}));

interface GanttChartGridColumnProps {
  isWeekend?: boolean;
}

export const GanttChartGridColumn = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isWeekend',
})<GanttChartGridColumnProps>(({ theme, isWeekend }) => ({
  flex: 1,
  borderRight: `1px solid ${theme.palette.colors.grey_100}`,
  backgroundColor: isWeekend ? 'rgba(0,0,0,0.02)' : 'transparent',
}));

export const GanttChartTodayLine = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: rem(2),
  backgroundColor: '#EF4444',
  zIndex: 5,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '6px solid #EF4444',
  },
}));

interface GanttChartBarProps {
  isCompleted?: boolean;
}

export const GanttChartBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCompleted',
})<GanttChartBarProps>(({ isCompleted }) => ({
  position: 'absolute',
  height: rem(24),
  borderRadius: rem(4),
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${rem(8)}`,
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  zIndex: 2,
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  overflow: 'hidden',
  ...(isCompleted && {
    backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 8px)',
  }),
  '&:hover': {
    transform: 'scaleY(1.1)',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
    zIndex: 10,
  },
}));

export const GanttChartBarLabel = styled(Box)(() => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  color: floowColors.white,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
}));

export const GanttChartActivityBar = styled(Box)(() => ({
  position: 'absolute',
  height: rem(20),
  borderRadius: rem(10),
  display: 'flex',
  alignItems: 'center',
  gap: rem(4),
  padding: `0 ${rem(8)}`,
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  zIndex: 2,
  color: floowColors.white,
  fontSize: rem(10),
  fontWeight: Bold._600,
  whiteSpace: 'nowrap',
  transition: 'transform 0.15s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 10,
  },
}));

export const GanttChartLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5, 2),
  backgroundColor: floowColors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
}));

export const GanttChartLegendSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  '& .title': {
    fontSize: rem(11),
    fontWeight: Bold._600,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
}));

export const GanttChartLegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: rem(11),
  color: theme.palette.text.secondary,
}));

export const GanttChartLegendDot = styled(Box)(() => ({
  width: rem(10),
  height: rem(10),
  borderRadius: rem(2),
}));

export const GanttChartTodayIndicator = styled(Box)(() => ({
  width: rem(10),
  height: rem(10),
  backgroundColor: '#EF4444',
  borderRadius: rem(2),
}));

// Step Name Edit Styles
export const StepTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontWeight: theme.typography.fontWeightSemiBold,
  fontSize: rem(14),
  color: theme.palette.text.primary,
  marginBottom: rem(2),
}));

export const StepTitleText = styled('span')(() => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export const StepTitleEditButton = styled('button')(({ theme }) => ({
  background: 'none',
  border: 'none',
  padding: theme.spacing(0.25),
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0.5,
  transition: 'opacity 0.2s ease',
  color: theme.palette.text.secondary,
  borderRadius: '50%',
  '&:hover': {
    opacity: 1,
    backgroundColor: theme.palette.colors.grey_100,
  },
}));

export const StepTitleEditContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flex: 1,
}));

export const StepTitleIndex = styled('span')(() => ({
  flexShrink: 0,
}));

// ============================================
// Step Activity Tab Styles
// ============================================

export const StepChipsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
}));

interface StepChipProps {
  active?: boolean;
}

export const StepChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StepChipProps>(({ theme, active = false }) => ({
  padding: `${theme.spacing(0.75)} ${theme.spacing(2)}`,
  borderRadius: rem(20),
  cursor: 'pointer',
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightMedium,
  border: `1px solid ${active ? theme.palette.primary.main : theme.palette.colors.grey_200}`,
  backgroundColor: active ? theme.palette.primary.main : theme.palette.colors.white,
  color: active ? theme.palette.colors.white : theme.palette.text.primary,
  transition: 'all 0.15s ease',
  userSelect: 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.colors.grey_100,
  },
}));

export const ActivityChatContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  backgroundColor: floowColors.grey[50],
  minHeight: rem(500),
}));

export const ActivityChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.colors.white,
  borderBottom: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ActivityChatHeaderTitle = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
}));

export const ActivityFeed = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  minHeight: rem(350),
  maxHeight: rem(450),
}));

export const ActivityFeedEmpty = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  gap: theme.spacing(1),
  padding: theme.spacing(6, 0),
  color: theme.palette.text.secondary,
  fontSize: rem(14),
}));

export const ActivityMessageRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  alignItems: 'flex-start',
}));

export const ActivityAvatar = styled(Box)(({ theme }) => ({
  width: rem(34),
  height: rem(34),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightBold,
  flexShrink: 0,
}));

export const ActivityMessageContent = styled(Box)(() => ({
  flex: 1,
  maxWidth: 'calc(100% - 46px)',
}));

export const ActivityTypeBadge = styled(Box)(() => ({
  display: 'inline-block',
  padding: `${rem(2)} ${rem(8)}`,
  borderRadius: rem(4),
  fontSize: rem(10),
  fontWeight: Bold._700,
  letterSpacing: '0.5px',
  marginBottom: rem(4),
  textTransform: 'uppercase' as const,
}));

export const ActivityBubble = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: `0 ${rem(8)} ${rem(8)} ${rem(8)}`,
  padding: theme.spacing(1, 1.5),
  fontSize: rem(13),
  color: theme.palette.text.primary,
  lineHeight: 1.6,
  wordBreak: 'break-word',
}));

export const ActivityBubbleHtml = styled(Box)(() => ({
  '& p': { margin: 0 },
  '& ul, & ol': { margin: `${rem(4)} 0`, paddingLeft: rem(20) },
  '& strong': { fontWeight: Bold._700 },
  '& em': { fontStyle: 'italic' },
  '& u': { textDecoration: 'underline' },
}));

export const ActivityAttachmentRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const ActivityAttachmentName = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: rem(13),
}));

export const ActivityTimestamp = styled(Box)(({ theme }) => ({
  fontSize: rem(11),
  color: theme.palette.text.secondary,
  marginTop: rem(4),
  paddingLeft: rem(2),
}));

export const ActivityInputBar = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.colors.grey_200}`,
  backgroundColor: theme.palette.colors.white,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexWrap: 'wrap',
}));
