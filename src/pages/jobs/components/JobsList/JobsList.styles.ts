import { Chip, styled } from '@mui/material';
import { rem } from '../../../../components/UI/Typography/utility';

export const StatusChip = styled(Chip)(() => ({
  fontWeight: 600,
  fontSize: rem(12),
  height: rem(24),
  letterSpacing: rem(0.5),
}));

export const FilterChip = styled(Chip)({
  borderRadius: rem(6),
  fontSize: rem(12),
});

export const ClearAllChip = styled(Chip)({
  borderRadius: rem(6),
  fontSize: rem(12),
  cursor: 'pointer',
});
