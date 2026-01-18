import { rem, em } from '../components/UI/Typography/utility';
import { floowColors } from './colors';

export default {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarColor: `${floowColors.scrollbar.thumb} ${floowColors.scrollbar.track}`,
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          width: rem(8),
          height: rem(8),
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: rem(8),
          backgroundColor: floowColors.scrollbar.thumb,
          minHeight: rem(24),
        },
        '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
          backgroundColor: floowColors.scrollbar.track,
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: rem(8),
        padding: `${rem(12)} ${rem(24)}`,
        fontSize: rem(16),
        fontWeight: 600,
        textTransform: 'none' as const,
        boxShadow: 'none',
        letterSpacing: em(0.08),
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        backgroundColor: floowColors.black,
        color: floowColors.white,
        '&:hover': {
          backgroundColor: floowColors.grey[800],
        },
      },
      outlined: {
        borderColor: floowColors.grey[200],
        borderWidth: rem(1),
        color: floowColors.grey[400],
        '&:hover': {
          borderColor: floowColors.grey[300],
          backgroundColor: floowColors.blackAlpha[2],
        },
      },
      sizeLarge: {
        padding: `${rem(12)} ${rem(24)}`,
        height: rem(48),
        borderRadius: rem(6),
      },
      sizeMedium: {
        padding: `${rem(12)} ${rem(24)}`,
        height: rem(44),
        borderRadius: rem(6),
      },
      sizeSmall: {
        padding: `${rem(8)} ${rem(16)}`,
        height: rem(36),
        borderRadius: rem(4),
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: rem(6),
          backgroundColor: floowColors.grey[50],
          fontSize: rem(16),
          fontWeight: 500,
          '& fieldset': {
            borderColor: floowColors.grey[100],
          },
          '&:hover fieldset': {
            borderColor: floowColors.grey[200],
          },
          '&.Mui-focused fieldset': {
            borderColor: floowColors.black,
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: floowColors.grey[400],
          opacity: 1,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      asterisk: {
        color: floowColors.error.main,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        '&:-webkit-autofill': {
          transitionDelay: '9999s',
          transitionProperty: 'background-color, color',
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginLeft: 0,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: rem(16),
        background: floowColors.whiteAlpha[2],
        border: `${rem(3)} solid ${floowColors.whiteAlpha[25]}`,
        boxShadow: `0 ${rem(16)} ${rem(24)} ${floowColors.shadow.xxxl}`,
        backdropFilter: `blur(${rem(20)})`,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: rem(8),
      },
      rounded: {
        borderRadius: rem(12),
      },
      elevation1: {
        boxShadow: `0 ${rem(2)} ${rem(8)} ${floowColors.shadow.xl}`,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: rem(40),
        fontSize: rem(16),
        fontWeight: 600,
        letterSpacing: em(0.08),
      },
      outlined: {
        borderWidth: rem(2),
        borderColor: floowColors.grey[200],
        backgroundColor: floowColors.grey[50],
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `${rem(1)} solid ${floowColors.grey[100]}`,
        fontSize: rem(16),
        fontWeight: 500,
        letterSpacing: em(0.08),
      },
      head: {
        backgroundColor: floowColors.grey[50],
        fontWeight: 700,
        color: floowColors.grey[800],
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: floowColors.grey[100],
      },
    },
  },
};
