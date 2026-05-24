import { Box, styled } from '@mui/material';

export const ModalTableHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  padding: `${theme.spacing(1)} ${theme.spacing(1)}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.action.selected,
}));

interface ModalTableRowProps {
  isEven?: boolean;
}

export const ModalTableRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isEven',
})<ModalTableRowProps>(({ theme, isEven }) => ({
  display: 'grid',
  gap: theme.spacing(1),
  padding: `${theme.spacing(0.75)} ${theme.spacing(1)}`,
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: isEven ? theme.palette.action.hover : 'transparent',
}));
