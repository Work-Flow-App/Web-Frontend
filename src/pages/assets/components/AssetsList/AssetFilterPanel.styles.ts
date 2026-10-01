import { styled } from '@mui/material/styles';
import { Box, Popover, Typography, Chip } from '@mui/material';
import { TuneRounded } from '@mui/icons-material';
import { rem } from '../../../../components/UI/Typography/utility';

// ─── Filter Panel ────────────────────────────────────────────────────────────

export const FilterPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: rem(4),
    boxShadow: theme.shadows[4],
    borderRadius: rem(8),
    [theme.breakpoints.down('sm')]: {
      width: `calc(100vw - ${rem(32)})`,
      maxWidth: rem(320),
    },
  },
}));

export const PanelContainer = styled(Box)(({ theme }) => ({
  width: rem(300),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const PanelHeader = styled(Box)({
  padding: `${rem(16)} ${rem(20)} ${rem(12)}`,
});

export const PanelTitle = styled(Typography)({
  fontWeight: 600,
}) as typeof Typography;

export const PanelBody = styled(Box)({
  padding: `${rem(16)} ${rem(20)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: rem(20),
});

export const PanelFooter = styled(Box)({
  padding: `${rem(12)} ${rem(20)}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: rem(8),
});

export const FilterRowWrapper = styled(Box)({
  width: '100%',
});

export const FilterLabel = styled(Typography)({
  display: 'block',
  fontWeight: 500,
  letterSpacing: rem(0.32),
  textTransform: 'uppercase',
  fontSize: rem(11),
  marginBottom: rem(6),
}) as typeof Typography;

// ─── Header Controls ─────────────────────────────────────────────────────────

export const HeaderControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: rem(8),
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    justifyContent: 'space-between',
  },
}));

export const FilterButtonWrapper = styled(Box)({
  position: 'relative',
  display: 'inline-flex',
});

export const FilterCountBadge = styled(Box)({
  position: 'absolute',
  top: rem(-8),
  right: rem(-8),
  zIndex: 1,
  pointerEvents: 'none',
});

export const FilterTuneIcon = styled(TuneRounded)({
  fontSize: rem(18),
});

// ─── Active Filter Chips Row ──────────────────────────────────────────────────

export const ChipsRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: rem(6),
  marginBottom: rem(16),
  alignItems: 'center',
});

export const FilterChip = styled(Chip)({
  borderRadius: rem(6),
  fontSize: rem(12),
});

export const ClearAllChip = styled(Chip)({
  borderRadius: rem(6),
  fontSize: rem(12),
  cursor: 'pointer',
});
