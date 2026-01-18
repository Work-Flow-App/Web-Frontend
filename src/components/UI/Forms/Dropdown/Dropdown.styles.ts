import { styled } from '@mui/material/styles';
import { Autocomplete, Popper, Box } from '@mui/material';
import { rem } from '../../Typography/utility';
import type { DropdownSize } from './Dropdown.types';
import { floowColors } from '../../../../theme/colors';

interface StyledDropdownProps {
  dropdownSize?: DropdownSize;
  fullWidth?: boolean;
}

export const AutocompleteWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(8),
  position: 'relative',
  width: '100%',
});

export const AutocompleteInnerWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: rem(4),
  position: 'relative',
  width: '100%',
});

export const MuiAutocomplete = styled(Autocomplete)<StyledDropdownProps>(({ theme, dropdownSize, fullWidth }) => {
  const { palette } = theme;

  const getSizeStyles = () => {
    // fullWidth takes priority over dropdownSize
    if (fullWidth) {
      return {
        width: '100%',
      };
    }

    switch (dropdownSize) {
      case 'small':
        return {
          width: rem(426),
          minWidth: rem(426),
        };
      case 'full':
        return {
          width: rem(922),
          minWidth: rem(922),
        };
      case 'medium':
      default:
        return {
          width: 'auto',
          minWidth: rem(200),
        };
    }
  };

  return {
    ...getSizeStyles(),

    '& .MuiInputBase-root': {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${rem(10)} ${rem(20)}`,
      gap: rem(4),
      minHeight: rem(44),
      background: floowColors.form.input.bg,
      border: `${rem(1)} solid ${floowColors.form.input.border}`,
      borderRadius: rem(6),
      fontSize: rem(14),
      fontWeight: 400,
      transition: 'all 0.2s ease-in-out',

      '&:hover': {
        background: floowColors.grey[100],
        borderColor: palette.primary?.light || floowColors.form.input.borderHover,
      },

      '&.Mui-focused': {
        background: floowColors.white,
        borderColor: palette.primary?.main || floowColors.form.input.borderFocus,
        boxShadow: `0 0 0 ${rem(2)} ${palette.primary?.main || floowColors.form.input.borderFocus}20`,
      },

      '&.Mui-disabled': {
        background: floowColors.form.input.bgDisabled,
        borderColor: floowColors.form.input.borderDisabled,
        color: palette.text?.disabled || floowColors.form.input.textDisabled,
        cursor: 'not-allowed',
      },

      // Remove default outline
      '&::before, &::after': {
        display: 'none',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },

      '& input': {
        padding: '0 !important',
        fontSize: rem(14),
        fontWeight: 400,
        color: palette.text?.primary || floowColors.black,

        '&::placeholder': {
          color: floowColors.form.input.textDisabled,
          opacity: 1,
        },
      },
    },

    '&.hasError .MuiInputBase-root': {
      borderColor: palette.error?.main || floowColors.error.main,
    },

    '&.withRequiredBorder .MuiInputBase-root': {
      borderColor: palette.warning?.main || floowColors.warning.main,
    },

    '&.hasValue .MuiInputBase-root': {
      background: floowColors.white,
    },

    // Icon styles
    '& .MuiAutocomplete-endAdornment': {
      right: rem(10),

      '& .MuiAutocomplete-popupIndicator': {
        color: palette.text?.secondary || floowColors.grey[600],
        padding: rem(4),
      },

      '& .MuiAutocomplete-clearIndicator': {
        color: palette.text?.secondary || floowColors.grey[600],
        padding: rem(4),
      },
    },

    '&.hideOptionWrapper .MuiAutocomplete-popper': {
      display: 'none',
    },
  };
});

export const CustomPopper = styled(Popper)(({ theme }) => {
  const { palette } = theme;

  return {
    '& .MuiAutocomplete-paper': {
      marginTop: rem(4),
      borderRadius: rem(6),
      boxShadow: `0px 4px 20px ${floowColors.shadow.xl}`,
      border: `${rem(1)} solid ${floowColors.grey[100]}`,
    },

    '& .MuiAutocomplete-listbox': {
      maxHeight: rem(200),
      padding: rem(4),
      overflowY: 'auto',

      '&::-webkit-scrollbar': {
        width: rem(6),
      },

      '&::-webkit-scrollbar-track': {
        background: floowColors.scrollbar.track,
        borderRadius: rem(10),
      },

      '&::-webkit-scrollbar-thumb': {
        background: floowColors.grey[500],
        borderRadius: rem(10),

        '&:hover': {
          background: floowColors.grey[600],
        },
      },
    },

    '& .MuiAutocomplete-option': {
      padding: `${rem(10)} ${rem(20)}`,
      fontSize: rem(14),
      fontWeight: 400,
      transition: 'all 0.15s ease-in-out',
      borderRadius: rem(4),
      margin: `${rem(2)} 0`,

      '&:hover': {
        background: `${palette.primary?.main || floowColors.blue.dark}10`,
      },

      '&[aria-selected="true"]': {
        background: `${palette.primary?.main || floowColors.blue.dark}20`,
        fontWeight: 500,

        '&:hover': {
          background: `${palette.primary?.main || floowColors.blue.dark}30`,
        },
      },

      '&.Mui-disabled': {
        color: palette.text?.disabled || floowColors.form.input.textDisabled,
        opacity: 0.5,
      },
    },

    '& .MuiAutocomplete-noOptions': {
      padding: `${rem(12)} ${rem(20)}`,
      fontSize: rem(14),
      color: palette.text?.secondary || floowColors.grey[600],
    },
  };
});

export const MuiListItemContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const NoDataText = styled(Box)(({ theme }) => ({
  padding: `${rem(12)} ${rem(20)}`,
  fontSize: rem(14),
  color: theme.palette.text?.secondary || floowColors.grey[600],
  textAlign: 'center',
}));

export const AddNewButtonWrapper = styled(Box)(({ theme }) => ({
  padding: `${rem(10)} ${rem(20)}`,
  fontSize: rem(14),
  fontWeight: 500,
  color: theme.palette.primary?.main || floowColors.blue.dark,
  cursor: 'pointer',
  textAlign: 'center',
  borderTop: `${rem(1)} solid ${floowColors.grey[100]}`,
  marginTop: rem(4),
  transition: 'all 0.15s ease-in-out',

  '&:hover': {
    background: `${theme.palette.primary?.main || floowColors.blue.dark}10`,
  },
}));

export const AutoCompleteValue = styled(Box)<{ size?: number }>(({ size = 40 }) => ({
  width: rem(size),
  minWidth: rem(size),
}));

export const CheckBoxWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginLeft: rem(8),
});
