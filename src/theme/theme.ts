import { createTheme } from '@mui/material/styles';

// Design tokens extracted from Figma - Floow Design System
const colors = {
  primary: {
    main: '#000000',
    light: '#333333',
    dark: '#0A0A0A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#171717',
    light: '#262626',
    dark: '#121212',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#000000',
  },
  text: {
    primary: '#262626',
    secondary: '#A1A1A1',
    disabled: '#D4D4D4',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A1A1A1',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  error: {
    main: '#FB2C36',
    light: 'rgba(251, 44, 54, 0.15)',
    dark: '#FB2C36',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFA500',
    light: 'rgba(255, 165, 0, 0.15)',
    dark: '#FF8C00',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#2196F3',
    light: 'rgba(33, 150, 243, 0.15)',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#00A63E',
    light: 'rgba(0, 166, 62, 0.15)',
    dark: '#00A63E',
    contrastText: '#FFFFFF',
  },
  divider: '#F5F5F5',
};

// Typography system - Manrope from Figma (rem based, 16px = 1rem)
const typography = {
  fontFamily: [
    'Manrope',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  // 3XL - 30px = 1.875rem
  h1: {
    fontSize: '1.875rem',
    lineHeight: '2.5625rem',
    fontWeight: 700,
    letterSpacing: '0.005em',
  },
  // 2XL - 24px = 1.5rem
  h2: {
    fontSize: '1.5rem',
    lineHeight: '2.0625rem',
    fontWeight: 700,
    letterSpacing: '0.005em',
  },
  // XL - 20px = 1.25rem
  h3: {
    fontSize: '1.25rem',
    lineHeight: '1.6875rem',
    fontWeight: 700,
    letterSpacing: '0.005em',
  },
  // Large - 18px = 1.125rem
  h4: {
    fontSize: '1.125rem',
    lineHeight: '1.5625rem',
    fontWeight: 700,
    letterSpacing: '0.005em',
  },
  // Base - 16px = 1rem
  h5: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 700,
    letterSpacing: '0.005em',
  },
  h6: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.005em',
  },
  // Body text
  body1: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 500,
    letterSpacing: '0.005em',
  },
  body2: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 400,
    letterSpacing: '0.005em',
  },
  // Small - 14px = 0.875rem
  caption: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0.005em',
  },
  button: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    letterSpacing: '0.005em',
  },
};

// Spacing system (MUI uses 8px base by default)
const spacing = 8;

// Create the theme
const theme = createTheme({
  palette: colors,
  typography,
  spacing,
  shape: {
    borderRadius: 8, // From your button CSS
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // 8px
          padding: '0.75rem 1.5rem', // 12px 24px
          fontSize: '1rem', // 16px
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          letterSpacing: '0.005em',
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
          borderWidth: '0.0625rem', // 1px
          color: '#A1A1A1',
          '&:hover': {
            borderColor: '#D4D4D4',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
        sizeLarge: {
          padding: '0.75rem 1.5rem', // 12px 24px
          height: '3rem', // 48px
          borderRadius: '0.375rem', // 6px
        },
        sizeMedium: {
          padding: '0.75rem 1.5rem', // 12px 24px
          height: '2.75rem', // 44px
          borderRadius: '0.375rem', // 6px
        },
        sizeSmall: {
          padding: '0.5rem 1rem', // 8px 16px
          height: '2.25rem', // 36px
          borderRadius: '0.25rem', // 4px
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
            borderRadius: '0.375rem', // 6px
            backgroundColor: '#FAFAFA',
            fontSize: '1rem', // 16px
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem', // 16px
          background: 'rgba(255, 255, 255, 0.02)',
          border: '0.1875rem solid rgba(255, 255, 255, 0.25)', // 3px
          boxShadow: '0 1rem 1.5rem rgba(0, 0, 0, 0.5)', // 0px 16px 24px
          backdropFilter: 'blur(1.25rem)', // blur(20px)
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem', // 8px
        },
        rounded: {
          borderRadius: '0.75rem', // 12px
        },
        elevation1: {
          boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.1)', // 0px 2px 8px
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '2.5rem', // 40px
          fontSize: '1rem', // 16px
          fontWeight: 600,
          letterSpacing: '0.005em',
        },
        outlined: {
          borderWidth: '0.125rem', // 2px
          borderColor: '#E5E5E5',
          backgroundColor: '#FAFAFA',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '0.0625rem solid #F5F5F5', // 1px
          fontSize: '1rem', // 16px
          fontWeight: 500,
          letterSpacing: '0.005em',
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
  },
});

export default theme;
