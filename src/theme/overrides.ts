import { rem, em } from '../components/UI/Typography/utility';

export default {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        scrollbarColor: '#A1A1A1 #F5F5F5',
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          width: rem(8),
          height: rem(8),
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: rem(8),
          backgroundColor: '#A1A1A1',
          minHeight: rem(24),
        },
        '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
          backgroundColor: '#F5F5F5',
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
        backgroundColor: '#000000',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#333333',
        },
      },
      outlined: {
        borderColor: '#E5E5E5',
        borderWidth: rem(1),
        color: '#A1A1A1',
        '&:hover': {
          borderColor: '#D4D4D4',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
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
          backgroundColor: '#FAFAFA',
          fontSize: rem(16),
          fontWeight: 500,
          '& fieldset': {
            borderColor: '#F5F5F5',
          },
          '&:hover fieldset': {
            borderColor: '#E5E5E5',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#000000',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: '#A1A1A1',
          opacity: 1,
        },
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      asterisk: {
        color: '#FB2C36',
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
        background: 'rgba(255, 255, 255, 0.02)',
        border: `${rem(3)} solid rgba(255, 255, 255, 0.25)`,
        boxShadow: `0 ${rem(16)} ${rem(24)} rgba(0, 0, 0, 0.5)`,
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
        boxShadow: `0 ${rem(2)} ${rem(8)} rgba(0, 0, 0, 0.1)`,
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
        borderColor: '#E5E5E5',
        backgroundColor: '#FAFAFA',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: `${rem(1)} solid #F5F5F5`,
        fontSize: rem(16),
        fontWeight: 500,
        letterSpacing: em(0.08),
      },
      head: {
        backgroundColor: '#FAFAFA',
        fontWeight: 700,
        color: '#262626',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: '#F5F5F5',
      },
    },
  },
};
