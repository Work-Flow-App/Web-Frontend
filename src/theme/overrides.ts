import type { Theme } from '@mui/material/styles';
import { rem, em } from '../components/UI/Typography/utility';
import { floowColors } from './colors';

// Scrollbar colors per mode
const SCROLLBAR_THUMB_DARK = '#4a4a4a';
const SCROLLBAR_TRACK_DARK = '#1e1e1e';

export default {
  MuiCssBaseline: {
    styleOverrides: {
      body: ({ theme }: { theme: Theme }) => ({
        scrollbarColor: theme.palette.mode === 'dark'
          ? `${SCROLLBAR_THUMB_DARK} ${SCROLLBAR_TRACK_DARK}`
          : `${floowColors.scrollbar.thumb} ${floowColors.scrollbar.track}`,
        '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
          width: rem(8),
          height: rem(8),
        },
        '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
          borderRadius: rem(8),
          backgroundColor: theme.palette.mode === 'dark'
            ? SCROLLBAR_THUMB_DARK
            : floowColors.scrollbar.thumb,
          minHeight: rem(24),
        },
        '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.mode === 'dark'
            ? SCROLLBAR_TRACK_DARK
            : floowColors.scrollbar.track,
        },
      }),
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
      // Theme-aware contained fallback — our custom StyledButton overrides this,
      // but raw MUI <Button variant="contained"> picks this up.
      contained: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.buttonColors.primary,
        color: floowColors.white,
        '&:hover': {
          backgroundColor: theme.palette.buttonColors.primaryHover,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.mode === 'dark'
            ? floowColors.grey[800]
            : floowColors.grey[200],
          color: theme.palette.mode === 'dark'
            ? floowColors.grey[600]
            : floowColors.grey[400],
        },
      }),
      // Theme-aware outlined fallback
      outlined: ({ theme }: { theme: Theme }) => ({
        borderColor: theme.palette.mode === 'dark'
          ? floowColors.grey[700]
          : floowColors.grey[200],
        borderWidth: rem(1),
        color: theme.palette.mode === 'dark'
          ? floowColors.grey[300]
          : floowColors.grey[600],
        '&:hover': {
          borderColor: theme.palette.mode === 'dark'
            ? floowColors.grey[500]
            : floowColors.grey[300],
          backgroundColor: theme.palette.mode === 'dark'
            ? floowColors.whiteAlpha[5]
            : floowColors.blackAlpha[2],
        },
        '&.Mui-disabled': {
          borderColor: theme.palette.mode === 'dark'
            ? floowColors.grey[700]
            : floowColors.grey[200],
          color: theme.palette.mode === 'dark'
            ? floowColors.grey[700]
            : floowColors.grey[300],
        },
      }),
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
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiOutlinedInput-root': {
          borderRadius: rem(6),
          backgroundColor: theme.palette.mode === 'dark'
            ? floowColors.grey[900]
            : floowColors.grey[50],
          fontSize: rem(16),
          fontWeight: 500,
          '& fieldset': {
            borderColor: theme.palette.mode === 'dark'
              ? floowColors.grey[700]
              : floowColors.grey[100],
          },
          '&:hover fieldset': {
            borderColor: theme.palette.mode === 'dark'
              ? floowColors.grey[500]
              : floowColors.grey[200],
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.buttonColors.primary,
          },
          '& .MuiOutlinedInput-input': {
            color: theme.palette.mode === 'dark'
              ? floowColors.grey[100]
              : floowColors.text.primary,
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: theme.palette.mode === 'dark'
            ? floowColors.grey[600]
            : floowColors.grey[400],
          opacity: 1,
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.mode === 'dark'
            ? floowColors.grey[400]
            : floowColors.text.secondary,
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: theme.palette.buttonColors.primary,
        },
      }),
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
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: rem(16),
        background: theme.palette.mode === 'dark'
          ? floowColors.dark.tertiary
          : floowColors.whiteAlpha[2],
        border: theme.palette.mode === 'dark'
          ? `${rem(1)} solid ${floowColors.grey[800]}`
          : `${rem(3)} solid ${floowColors.whiteAlpha[25]}`,
        boxShadow: theme.palette.mode === 'dark'
          ? `0 ${rem(16)} ${rem(24)} rgba(0,0,0,0.4)`
          : `0 ${rem(16)} ${rem(24)} ${floowColors.shadow.xxxl}`,
        backdropFilter: `blur(${rem(20)})`,
      }),
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: rem(8),
        backgroundColor: theme.palette.background.paper,
      }),
      rounded: {
        borderRadius: rem(12),
      },
      elevation1: ({ theme }: { theme: Theme }) => ({
        boxShadow: theme.palette.mode === 'dark'
          ? `0 ${rem(2)} ${rem(8)} rgba(0,0,0,0.4)`
          : `0 ${rem(2)} ${rem(8)} ${floowColors.shadow.xl}`,
      }),
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
      outlined: ({ theme }: { theme: Theme }) => ({
        borderWidth: rem(2),
        borderColor: theme.palette.mode === 'dark'
          ? floowColors.grey[700]
          : floowColors.grey[200],
        backgroundColor: theme.palette.mode === 'dark'
          ? floowColors.grey[900]
          : floowColors.grey[50],
        color: theme.palette.mode === 'dark'
          ? floowColors.grey[200]
          : 'inherit',
      }),
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderBottom: theme.palette.mode === 'dark'
          ? `${rem(1)} solid ${floowColors.grey[800]}`
          : `${rem(1)} solid ${floowColors.grey[100]}`,
        fontSize: rem(16),
        fontWeight: 500,
        letterSpacing: em(0.08),
        color: theme.palette.text.primary,
      }),
      head: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? floowColors.grey[900]
          : floowColors.grey[50],
        fontWeight: 700,
        color: theme.palette.mode === 'dark'
          ? floowColors.grey[300]
          : floowColors.grey[800],
      }),
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderColor: theme.palette.mode === 'dark'
          ? floowColors.grey[800]
          : floowColors.grey[100],
      }),
    },
  },

  MuiSelect: {
    styleOverrides: {
      outlined: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? floowColors.grey[900]
          : floowColors.grey[50],
        color: theme.palette.text.primary,
      }),
    },
  },

  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? floowColors.grey[900]
          : floowColors.white,
        border: theme.palette.mode === 'dark'
          ? `${rem(1)} solid ${floowColors.grey[700]}`
          : 'none',
      }),
    },
  },

  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.text.primary,
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark'
            ? floowColors.grey[800]
            : floowColors.grey[50],
        },
        '&.Mui-selected': {
          backgroundColor: theme.palette.mode === 'dark'
            ? floowColors.grey[800]
            : floowColors.grey[100],
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? floowColors.grey[700]
              : floowColors.grey[200],
          },
        },
      }),
    },
  },

  MuiSwitch: {
    styleOverrides: {
      track: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'dark'
          ? floowColors.grey[700]
          : floowColors.grey[400],
        opacity: 1,
      }),
    },
  },
};
