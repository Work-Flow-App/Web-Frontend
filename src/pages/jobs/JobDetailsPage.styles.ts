import { styled, Box, Typography } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 2, 2),
}));

export const DetailsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
  },
}));

export const DetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
  border: `1px solid #E5E5E5`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  height: '100%',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: Bold._600,
  marginBottom: theme.spacing(2),
  fontSize: rem(16),
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

export const SubSectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: Bold._600,
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

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));

export const ColumnBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

// Section 1: Job Overview Card Styles
export const JobOverviewCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
  border: `1px solid #E5E5E5`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}));

export const JobTitle = styled('h1')(({ theme }) => ({
  fontSize: rem(28),
  fontWeight: Bold._700,
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
  borderTop: `1px solid #E5E5E5`,
}));

export const MetadataColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
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
        return {
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
        };
      case 'PENDING':
        return {
          backgroundColor: '#FFE0B2',
          color: '#E65100',
        };
      case 'IN_PROGRESS':
        return {
          backgroundColor: '#E1F5FE',
          color: '#0277BD',
        };
      case 'COMPLETED':
        return {
          backgroundColor: '#E3F2FD',
          color: '#1565C0',
        };
      case 'CANCELLED':
        return {
          backgroundColor: '#FFEBEE',
          color: '#C62828',
        };
      default:
        return {
          backgroundColor: '#F5F5F5',
          color: '#616161',
        };
    }
  };

  const styles = getStatusStyles();

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: styles.backgroundColor,
    color: styles.color,
    fontSize: rem(13),
    fontWeight: Bold._600,
    whiteSpace: 'nowrap',
  };
});

export const StatusIcon = styled('span')(() => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'currentColor',
  display: 'inline-block',
}));

export const MetadataLabel = styled('span')(({ theme }) => ({
  fontSize: rem(12),
  fontWeight: Bold._500,
  color: theme.palette.text.secondary,
  textTransform: 'capitalize',
}));

export const MetadataValue = styled('div')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._600,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const PriorityIndicator = styled('span')(() => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#4CAF50',
  display: 'inline-block',
}));

export const Avatar = styled('div')(({ theme }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(11),
  fontWeight: Bold._700,
}));

export const TagsContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginLeft: 'auto',
}));

interface TagProps {
  color?: string;
}

export const Tag = styled('span')<TagProps>(({ color = '#9E9E9E' }) => ({
  padding: '6px 12px',
  borderRadius: '16px',
  backgroundColor: color,
  color: '#fff',
  fontSize: rem(12),
  fontWeight: Bold._600,
  whiteSpace: 'nowrap',
}));

// Section 2: Workflow Stages Styles
export const WorkflowCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
  border: `1px solid #E5E5E5`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}));

export const WorkflowTitle = styled('h2')(({ theme }) => ({
  fontSize: rem(16),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  margin: `0 -${theme.spacing(2.5)}`,
  marginBottom: theme.spacing(1.5),
  paddingBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  borderBottom: '1px solid #E5E5E5',
}));

export const StagesContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
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
  padding: '18px 40px',
  backgroundColor: color,
  minWidth: '220px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 24px 50%)',
  opacity: active ? 1 : 0.85,
  transition: 'all 0.3s ease',
  borderRadius: '4px',

  '&:first-of-type': {
    clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%)',
    borderRadius: '8px 0 0 8px',
  },

  '&:last-of-type': {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 24px 50%)',
    borderRadius: '0 8px 8px 0',
  },

  '&:hover': {
    opacity: 1,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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

// Section 3: Job Details Styles
export const DetailsSectionTitle = styled('h3')(({ theme }) => ({
  fontSize: rem(18),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  margin: 0,
  marginBottom: theme.spacing(3),
}));

export const DetailsContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
}));

export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  gap: theme.spacing(4),
  padding: theme.spacing(2, 0),
  borderBottom: '1px solid #F5F5F5',

  '&:last-child': {
    borderBottom: 'none',
  },

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(1),
  },
}));

export const DetailLabel = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._500,
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const FieldIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  opacity: 0.7,

  '& svg': {
    fontSize: '18px',
  },
}));

export const DetailValue = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._400,
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  wordBreak: 'break-word',
}));

// Tabs Styles
export const TabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  marginBottom: '32px',
  borderBottom: '1px solid #E5E5E5',
  paddingBottom: '0',
  flexWrap: 'wrap',
  margin: `0 -${theme.spacing(2.5)} 32px -${theme.spacing(2.5)}`,
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
  padding: '12px 4px',
  fontSize: rem(15),
  fontWeight: active ? Bold._700 : Bold._500,
  color: active ? '#6366F1' : '#71717A',
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
    height: '2px',
    backgroundColor: active ? '#6366F1' : 'transparent',
    transition: 'background-color 0.2s ease',
  },

  '&:hover': {
    color: active ? '#6366F1' : '#3F3F46',
  },
}));

export const TabContent = styled(Box)(() => ({
  paddingTop: '8px',
}));

export const FieldTypeLabel = styled('span')(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._400,
  color: theme.palette.text.secondary,
  marginLeft: '6px',
  fontStyle: 'italic',
}));

export const FieldsGroupTitle = styled('h4')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._700,
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: 0,
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: '1px solid #F5F5F5',
}));

export const RequiredIndicator = styled('span')(() => ({
  color: '#EF4444',
  fontSize: rem(16),
  fontWeight: Bold._700,
  marginRight: '4px',
}));

export const EmptyFieldText = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._400,
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
  fontWeight: Bold._600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.primary,
  fontWeight: Bold._400,
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
  margin: '0 2px',
}));

export const BreadcrumbCurrent = styled('span')(({ theme }) => ({
  color: theme.palette.text.primary,
}));
