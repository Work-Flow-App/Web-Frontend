import { styled, Box, Typography } from '@mui/material';
import { rem, Bold } from '../../components/UI/Typography/utility';

// Main page container
export const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#F5F5F7',
}));

// Header Section
export const Header = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(2.5),
  borderBottom: 'none',
}));

export const HeaderTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const BackButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.spacing(0.5),
  border: '1px solid #E0E0E0',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: rem(14),
  fontWeight: Bold._500,
  color: theme.palette.text.primary,
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '#F5F5F5',
  },
}));

export const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const ActionButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.spacing(0.5),
  border: '1px solid #E0E0E0',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: rem(14),
  fontWeight: Bold._500,
  color: theme.palette.text.primary,
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '#F5F5F5',
  },
}));

export const ResolveButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 2),
  borderRadius: theme.spacing(0.5),
  border: 'none',
  backgroundColor: '#7C3AED',
  color: '#FFFFFF',
  cursor: 'pointer',
  fontSize: rem(14),
  fontWeight: Bold._600,
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '#6D28D9',
  },
}));

export const DeleteButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.75),
  borderRadius: theme.spacing(0.5),
  border: '1px solid #E0E0E0',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  color: '#EF4444',
  transition: 'all 0.2s',

  '&:hover': {
    backgroundColor: '#FEE2E2',
  },
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

export const JobTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(24),
  fontWeight: Bold._700,
  color: '#1F2937',
  marginBottom: theme.spacing(0.5),
}));

export const JobDescription = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: '#6B7280',
  fontWeight: Bold._400,
}));

// Metadata Row with Dropdowns
export const MetadataRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(2.5),
  flexWrap: 'wrap',
  alignItems: 'flex-start',
}));

export const MetadataDropdown = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const MetadataLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  color: '#6B7280',
  textTransform: 'capitalize',
  letterSpacing: '0.025em',
}));

export const DropdownButton = styled(Box)<{ status?: string }>(({ theme, status }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  border: '1px solid #E5E7EB',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: rem(13),
  fontWeight: Bold._500,
  color: '#374151',
  transition: 'all 0.2s',
  minWidth: '120px',

  '&:hover': {
    backgroundColor: '#F9FAFB',
    borderColor: '#D1D5DB',
  },
}));

export const StatusDot = styled(Box)<{ status?: string }>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'IN_PROGRESS':
        return '#FFA500';
      case 'COMPLETED':
        return '#10B981';
      case 'PENDING':
        return '#F59E0B';
      case 'CANCELLED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: getStatusColor(),
  };
});

export const PriorityDot = styled(Box)<{ priority?: string }>(({ theme, priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: getPriorityColor(),
  };
});

export const FollowersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
}));

// Company Section
export const CompanySection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2.5),
  flexWrap: 'wrap',
}));

export const CompanyAvatar = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: '#F3E8FF',
  color: '#7C3AED',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: rem(14),
  fontWeight: Bold._600,
}));

export const CompanyName = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._600,
  color: '#1F2937',
}));

export const StatusBadge = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: '#EF4444',
}));

export const TagBadge = styled(Box)<{ primary?: boolean }>(({ theme, primary }) => ({
  padding: theme.spacing(0.375, 1),
  borderRadius: theme.spacing(3),
  backgroundColor: primary ? '#FCE7F3' : '#DBEAFE',
  color: primary ? '#BE185D' : '#1E40AF',
  fontSize: rem(12),
  fontWeight: Bold._500,
  whiteSpace: 'nowrap',
}));

export const MoreBadge = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.375, 1),
  borderRadius: theme.spacing(3),
  backgroundColor: '#F3F4F6',
  color: '#6B7280',
  fontSize: rem(12),
  fontWeight: Bold._500,
}));

// Stages Section
export const StagesSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StagesLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: '#374151',
  marginBottom: theme.spacing(1),
}));

export const StagesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  overflowX: 'auto',
  paddingBottom: theme.spacing(0.5),
}));

export const StageItem = styled(Box)<{ active?: boolean; color?: string }>(({ theme, active, color }) => ({
  flex: 1,
  minWidth: '150px',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  backgroundColor: color || '#E5E7EB',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  border: active ? '2px solid #7C3AED' : '2px solid transparent',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
}));

export const StageLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: Bold._600,
  color: '#374151',
}));

// Tabs Container
export const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderTop: '1px solid #E5E7EB',
  paddingTop: theme.spacing(1),
}));

// Content Section
export const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
  backgroundColor: '#F5F5F7',
}));

export const CustomFieldsSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  border: '1px solid #E5E7EB',
}));

export const TabContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(3),
  border: '1px solid #E5E7EB',
}));

// Sub Tabs for Custom Fields
export const SubTabsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
  borderBottom: '1px solid #E5E7EB',
  paddingBottom: theme.spacing(0.5),
  overflowX: 'auto',
}));

export const SubTab = styled(Box)<{ active?: boolean }>(({ theme, active }) => ({
  padding: theme.spacing(1, 2),
  fontSize: rem(13),
  fontWeight: Bold._500,
  color: active ? '#7C3AED' : '#6B7280',
  cursor: 'pointer',
  borderBottom: active ? '2px solid #7C3AED' : '2px solid transparent',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',

  '&:hover': {
    color: '#7C3AED',
  },
}));

// Fields Section
export const FieldsSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const FieldsSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: Bold._600,
  color: '#374151',
  marginBottom: theme.spacing(2),
}));

export const FieldsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(2),

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const FieldItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: rem(11),
  fontWeight: Bold._600,
  color: '#9CA3AF',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

export const FieldValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: '#1F2937',
  fontWeight: Bold._500,
  wordBreak: 'break-word',
}));

// Section Title
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: Bold._600,
  marginBottom: theme.spacing(2),
  fontSize: rem(16),
  color: '#1F2937',
}));

export const SectionDivider = styled(Box)(({ theme }) => ({
  height: 1,
  backgroundColor: '#E5E7EB',
  margin: theme.spacing(3, 0),
}));

// Empty State
export const EmptyState = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: '#9CA3AF',
  textAlign: 'center',
  padding: theme.spacing(4),
  fontStyle: 'italic',
}));

// Metadata Item and Value (for backward compatibility)
export const MetadataItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));

export const MetadataValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: '#1F2937',
  fontWeight: Bold._500,
}));

// Legacy exports for backward compatibility
export const DetailsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: theme.spacing(3),
  width: '100%',

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));

export const DetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
  border: '1px solid #E5E7EB',
  height: '100%',
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
  color: '#6B7280',
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: '#1F2937',
  fontWeight: Bold._400,
}));
