import { styled } from '@mui/material/styles';
import { Tooltip as MuiTooltip } from '@mui/material';
import { rem } from '../Typography/utility';

export const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: theme.palette.colors.grey_900,
    color: theme.palette.colors.white,
    fontSize: rem(12),
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: rem(6),
    maxWidth: rem(300),
    boxShadow: theme.palette.boxShadow.dropDownListShadow,
  },
  '& .MuiTooltip-arrow': {
    color: theme.palette.colors.grey_900,
  },
}));
