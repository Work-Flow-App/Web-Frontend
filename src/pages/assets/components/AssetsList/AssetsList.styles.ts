import { Box, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';
import { Inventory, CheckCircle, Autorenew, AccountBalanceWallet } from '@mui/icons-material';

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
