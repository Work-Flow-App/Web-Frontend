import { Box, Chip, Typography, styled } from '@mui/material';
import { Inventory2Outlined, Inventory, CheckCircle, Autorenew, AccountBalanceWallet } from '@mui/icons-material';
import { rem } from '../../../../components/UI/Typography/utility';

export const StatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

export const StatCard = styled(Box)(({ theme }) => ({
  padding: `${rem(12)} ${rem(16)}`,
  backgroundColor: theme.palette.colors.white,
  borderRadius: rem(8),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  boxShadow: `0 ${rem(1)} ${rem(3)} rgba(0, 0, 0, 0.05)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: rem(4),
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: `translateY(-${rem(2)})`,
    boxShadow: `0 ${rem(4)} ${rem(12)} rgba(0, 0, 0, 0.05)`,
  },
}));

export const StatHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));

export const StatLabel = styled('span')(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: rem(0.5),
}));

export const StatValue = styled('div')(({ theme }) => ({
  fontSize: '1.12rem',
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(0.5),
}));

export const StatIconContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ theme, bgColor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: rem(40),
  height: rem(40),
  borderRadius: '50%',
  backgroundColor: bgColor || theme.palette.colors.grey_100,
  color: theme.palette.primary.main,
}));

export const TotalAssetsIcon = styled(Inventory)(() => ({
  color: '#2196F3',
}));

export const AvailableAssetsIcon = styled(CheckCircle)(() => ({
  color: '#4CAF50',
}));

export const InUseAssetsIcon = styled(Autorenew)(() => ({
  color: '#FF9800',
}));

export const CostAssetsIcon = styled(AccountBalanceWallet)(() => ({
  color: '#9C27B0',
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: rem(13),
  fontWeight: theme.typography.fontWeightBold,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.text.secondary,
}));

export const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
  gap: theme.spacing(1),
}));

export const EmptyStateIcon = styled(Inventory2Outlined)(({ theme }) => ({
  fontSize: rem(36),
  color: theme.palette.text.disabled,
  opacity: 0.5,
}));

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.secondary,
}));

export const EmptyStateHint = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.disabled,
}));

export const AssetCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

export const AssetIconBox = styled(Box)(({ theme }) => ({
  width: rem(36),
  height: rem(36),
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.colors.grey_200}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
  flexShrink: 0,
  marginTop: rem(1),
}));

export const AssetIconSmall = styled(Inventory2Outlined)(() => ({
  fontSize: rem(18),
}));

export const AssetContent = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(3),
}));

export const AssetName = styled(Typography)(({ theme }) => ({
  fontSize: rem(14),
  fontWeight: theme.typography.fontWeightSemiBold,
  color: theme.palette.text.primary,
  lineHeight: 1.4,
}));

export const AssetMeta = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
}));

export const AssetNotes = styled(Typography)(({ theme }) => ({
  fontSize: rem(12),
  color: theme.palette.text.disabled,
  lineHeight: 1.4,
  fontStyle: 'italic',
}));

export const CardRight = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  flexShrink: 0,
}));

export const StatusChip = styled(Chip)(({ theme }) => ({
  height: rem(24),
  fontSize: rem(11),
  fontWeight: theme.typography.fontWeightSemiBold,
  letterSpacing: '0.3px',
}));
