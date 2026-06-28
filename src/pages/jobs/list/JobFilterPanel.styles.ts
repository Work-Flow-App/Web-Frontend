import { styled } from '@mui/material/styles';
import {
  Box,
  Popover,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { TuneRounded } from '@mui/icons-material';
import { rem } from '../../../components/Typography/utility';

// ─── Filter panel ────────────────────────────────────────────────────────────

export const FilterPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPaper-root': {
    marginTop: rem(4),
    boxShadow: theme.shadows[4],
    borderRadius: rem(8),
  },
}));

export const PanelContainer = styled(Box)({
  width: rem(300),
});

export const PanelHeader = styled(Box)({
  padding: `${rem(16)} ${rem(20)} ${rem(12)}`,
});

export const PanelTitle = styled(Typography)({
  fontWeight: 600,
}) as typeof Typography;

export const PanelBody = styled(Box)({
  padding: `${rem(16)} ${rem(20)}`,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: rem(20),
});

export const ViewToggleGroup = styled(ToggleButtonGroup)({
  '& .MuiToggleButton-root': {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: rem(13),
    flex: 1,
  },
});

export const FilterSection = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$disabled',
})<{ $disabled: boolean }>(({ $disabled }) => ({
  display: 'flex',
  flexDirection: 'column' as const,
  gap: rem(16),
  opacity: $disabled ? 0.4 : 1,
  pointerEvents: $disabled ? 'none' : 'auto',
  transition: 'opacity 0.15s ease',
}));

export const PanelFooter = styled(Box)({
  padding: `${rem(12)} ${rem(20)}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: rem(8),
});


export const FilterRowWrapper = styled(Box)({});

export const FilterLabel = styled(Typography)({
  display: 'block',
  fontWeight: 500,
  letterSpacing: rem(0.32),
  textTransform: 'uppercase' as const,
  fontSize: rem(11),
  marginBottom: rem(6),
}) as typeof Typography;

// ─── JobsList header controls ─────────────────────────────────────────────────

export const HeaderControls = styled(Box)({
  display: 'flex',
  gap: rem(8),
  alignItems: 'center',
});

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

// ─── Active filter chips row ──────────────────────────────────────────────────

export const ChipsRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: rem(6),
  marginBottom: rem(16),
  alignItems: 'center',
});
