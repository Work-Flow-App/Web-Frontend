import { Chip, styled, Box, Button, Popover, List, ListItemButton, IconButton } from '@mui/material';
import { floowColors } from '../../../../theme/colors';
import { rem } from '../../../../components/UI/Typography/utility';

export const StatusChip = styled(Chip)(() => ({
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  letterSpacing: '0.5px',
}));

export const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

export const CustomFilterButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  width: rem(220),
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: `0 ${rem(12)}`,
  height: rem(36),
  background: floowColors.form.input.bg,
  border: `${rem(1)} solid ${floowColors.form.input.border}`,
  borderRadius: rem(8),
  fontSize: rem(13),
  fontWeight: 400,
  color: theme.palette.text.primary || floowColors.black,
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
  boxShadow: 'none',

  '&:hover': {
    background: floowColors.grey[100],
    borderColor: theme.palette.primary?.light || floowColors.form.input.borderHover,
    boxShadow: 'none',
  },

  '& .MuiButton-endIcon': {
    display: 'none',
  }
}));

export const FilterButtonText = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'left',
  marginRight: rem(8),
});

export const FilterIconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 'auto',
}));

export const ClearIconButton = styled(IconButton)(({ theme }) => ({
  padding: rem(4),
  color: theme.palette.text.secondary || floowColors.grey[600],
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
  }
}));

export const ArrowIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: rem(4),
  color: theme.palette.text.secondary || floowColors.grey[600],
}));

export const FilterPopover = styled(Popover)(() => ({
  marginTop: 8,
}));

export const FilterList = styled(List)(() => ({
  width: 250,
  padding: 0,
}));

export const CategoryListItem = styled(ListItemButton)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontWeight: 600,
}));

export const SubListItem = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    }
  }
}));
