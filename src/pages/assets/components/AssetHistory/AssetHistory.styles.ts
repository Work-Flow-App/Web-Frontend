import { Box, Typography, styled } from '@mui/material';
import { rem, Bold } from '../../../../components/UI/Typography/utility';

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 2, 2),
}));

export const DetailsGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  width: '100%',
}));

export const DetailsSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}));

export const AssetOverviewCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.colors.white,
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
}));

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export const AssetTitle = styled('h1')(({ theme }) => ({
  fontSize: rem(28),
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  margin: 0,
}));

export const AssetDescription = styled('p')(({ theme }) => ({
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

interface StatusBadgeProps {
  statusType?: string;
}

export const StatusBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'statusType',
})<StatusBadgeProps>(({ statusType = 'available' }) => {
  const getStatusStyles = () => {
    switch (statusType) {
      case 'available':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case 'in-use':
        return { backgroundColor: '#E1F5FE', color: '#0277BD' };
      case 'archived':
        return { backgroundColor: '#FFEBEE', color: '#C62828' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#616161' };
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

export const TagsContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: rem(8),
  marginLeft: 'auto',
}));

interface TagProps {
  color?: string;
}

export const Tag = styled('span')<TagProps>(({ color = '#9E9E9E' }) => ({
  padding: `${rem(6)} ${rem(12)}`,
  borderRadius: rem(16),
  backgroundColor: color,
  color: '#fff',
  fontSize: rem(12),
  fontWeight: Bold._600,
  whiteSpace: 'nowrap',
}));

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
    height: rem(2),
    backgroundColor: active ? '#6366F1' : 'transparent',
    transition: 'background-color 0.2s ease',
  },
  '&:hover': {
    color: active ? '#6366F1' : '#3F3F46',
  },
}));

export const TabContent = styled(Box)(() => ({
  paddingTop: rem(8),
}));

export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: `${rem(200)} 1fr`,
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
}));

export const DetailValue = styled('span')(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.text.primary,
  lineHeight: 1.5,
  wordBreak: 'break-word',
}));

export const LoaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '400px',
}));

export const NotFoundText = styled(Typography)(() => ({
  fontSize: rem(18),
  fontWeight: Bold._500,
}));

export const EmptyStateContainer = styled(Box)(() => ({
  textAlign: 'center',
  paddingTop: rem(32),
  paddingBottom: rem(32),
}));

export const EmptyStateTitle = styled(Typography)(() => ({
  fontSize: rem(18),
  fontWeight: Bold._500,
}));

export const EmptyStateSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));
