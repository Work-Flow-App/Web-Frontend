import { styled } from '@mui/material/styles';
import { Autocomplete, Popper, Box } from '@mui/material';
import { rem } from '../../Typography/utility';
import type { DropdownSize } from './Dropdown.types';

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
      background: '#FAFAFA',
      border: `${rem(1)} solid #F5F5F5`,
      borderRadius: rem(6),
      fontSize: rem(14),
      fontWeight: 400,
      transition: 'all 0.2s ease-in-out',

      '&:hover': {
        background: '#F5F5F5',
        borderColor: palette.primary?.light || '#90CAF9',
      },

      '&.Mui-focused': {
        background: '#FFFFFF',
        borderColor: palette.primary?.main || '#1976d2',
        boxShadow: `0 0 0 ${rem(2)} ${palette.primary?.main || '#1976d2'}20`,
      },

      '&.Mui-disabled': {
        background: '#E0E0E0',
        borderColor: '#E0E0E0',
        color: palette.text?.disabled || '#9E9E9E',
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
        color: palette.text?.primary || '#000',

        '&::placeholder': {
          color: '#9E9E9E',
          opacity: 1,
        },
      },
    },

    '&.hasError .MuiInputBase-root': {
      borderColor: palette.error?.main || '#d32f2f',
    },

    '&.withRequiredBorder .MuiInputBase-root': {
      borderColor: palette.warning?.main || '#FFA726',
    },

    '&.hasValue .MuiInputBase-root': {
      background: '#FFFFFF',
    },

    // Icon styles
    '& .MuiAutocomplete-endAdornment': {
      right: rem(10),

      '& .MuiAutocomplete-popupIndicator': {
        color: palette.text?.secondary || '#666',
        padding: rem(4),
      },

      '& .MuiAutocomplete-clearIndicator': {
        color: palette.text?.secondary || '#666',
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
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      border: `${rem(1)} solid #F5F5F5`,
    },

    '& .MuiAutocomplete-listbox': {
      maxHeight: rem(200),
      padding: rem(4),
      overflowY: 'auto',

      '&::-webkit-scrollbar': {
        width: rem(6),
      },

      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: rem(10),
      },

      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: rem(10),

        '&:hover': {
          background: '#555',
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
        background: `${palette.primary?.main || '#1976d2'}10`,
      },

      '&[aria-selected="true"]': {
        background: `${palette.primary?.main || '#1976d2'}20`,
        fontWeight: 500,

        '&:hover': {
          background: `${palette.primary?.main || '#1976d2'}30`,
        },
      },

      '&.Mui-disabled': {
        color: palette.text?.disabled || '#9E9E9E',
        opacity: 0.5,
      },
    },

    '& .MuiAutocomplete-noOptions': {
      padding: `${rem(12)} ${rem(20)}`,
      fontSize: rem(14),
      color: palette.text?.secondary || '#666',
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
  color: theme.palette.text?.secondary || '#666',
  textAlign: 'center',
}));

export const AddNewButtonWrapper = styled(Box)(({ theme }) => ({
  padding: `${rem(10)} ${rem(20)}`,
  fontSize: rem(14),
  fontWeight: 500,
  color: theme.palette.primary?.main || '#1976d2',
  cursor: 'pointer',
  textAlign: 'center',
  borderTop: `${rem(1)} solid #F5F5F5`,
  marginTop: rem(4),
  transition: 'all 0.15s ease-in-out',

  '&:hover': {
    background: `${theme.palette.primary?.main || '#1976d2'}10`,
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
