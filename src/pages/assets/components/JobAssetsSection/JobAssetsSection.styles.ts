import { Box, Chip, Typography, styled } from '@mui/material';
import { Inventory2Outlined } from '@mui/icons-material';
import { rem } from '../../../../components/UI/Typography/utility';

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
