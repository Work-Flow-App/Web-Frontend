import { styled, Box, Typography } from '@mui/material';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

export const ManualOptionWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  paddingTop: 2,
  paddingBottom: 2,
});

export const ManualOptionTextBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const ManualOptionIcon = styled(EditLocationAltIcon)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
  flexShrink: 0,
}));

export const ManualOptionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  lineHeight: 1.3,
}));

export const ManualOptionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
}));

export const RegularOptionText = styled(Typography)({
  // base body2 styles applied via variant prop in tsx
});