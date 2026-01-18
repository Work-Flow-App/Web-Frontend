// Floow Design System - Color Palette
// Extracted from Figma design

export const floowColors = {
  // Primary Colors
  black: '#000000',
  darkBlack: '#0A0A0A',
  white: '#FFFFFF',

  // Grey Scale
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

  // Dark Shades
  dark: {
    primary: '#121212',
    secondary: '#171717',
    tertiary: '#262626',
    navy: '#151d26',
  },

  // Additional UI Colors
  slate: {
    light: '#e2e8f0',
    main: '#94a3b8',
    dark: '#64748b',
  },

  blue: {
    50: '#E1F5FE',
    100: '#90CAF9',
    dark: '#1976d2',
    main: '#2196f3',
    light: '#3b82f6',
    hover: '#2563eb',
  },

  red: {
    main: '#ef4444',
    dark: '#C62828',
  },

  green: {
    50: '#E8F5E9',
    main: '#2E7D32',
  },

  indigo: {
    main: '#6366F1',
  },

  // Tailwind-style colors (used in various components)
  tailwind: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Gradient Colors
  gradient: {
    whiteToGrey: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)',
    darkGrey: 'linear-gradient(180deg, #5E5E5E 0%, #121212 100%)',
    blackWhiteBlack: 'linear-gradient(270deg, #000000 0%, #FFFFFF 50%, #000000 100%)',
    silver: 'linear-gradient(180deg, #FAFAFA 0%, #949494 100%)',
    blueVertical: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
    blueHorizontal: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
    slateHorizontal: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)',
    // Auth page gradients
    authBackground: 'linear-gradient(0deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.35) 100%)',
    authGlow: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
    // Pricing card gradients
    pricingCard: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
    pricingIcon: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.41) 100%)',
    pricingButton: 'linear-gradient(180deg, #FFFFFF 0%, #B1B1B1 100%)',
    pricingButtonHover: 'linear-gradient(180deg, #FFFFFF 0%, #D1D1D1 100%)',
  },

  // Status Colors
  error: {
    main: '#FB2C36',
    light: 'rgba(251, 44, 54, 0.15)',
    bgLight: 'rgba(251, 44, 54, 0.1)',
  },

  warning: {
    main: '#FFA500',
    light: 'rgba(255, 165, 0, 0.15)',
    dark: '#FF8C00',
  },

  info: {
    main: '#2196F3',
    light: 'rgba(33, 150, 243, 0.15)',
    dark: '#1976D2',
    bg: '#0277BD',
  },

  success: {
    main: '#00A63E',
    light: 'rgba(0, 166, 62, 0.15)',
  },

  // Status Badge Colors (for asset history, etc.)
  statusBadge: {
    active: {
      bg: '#E8F5E9',
      text: '#2E7D32',
    },
    pending: {
      bg: '#E1F5FE',
      text: '#0277BD',
    },
    inactive: {
      bg: '#FFEBEE',
      text: '#C62828',
    },
    default: {
      bg: '#F5F5F5',
      text: '#616161',
    },
  },

  // Invitation Status Colors
  invitationStatus: {
    pending: '#FFA726',
    accepted: '#66BB6A',
    expired: '#9E9E9E',
  },

  // Glass Morphism Effects
  glass: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(255, 255, 255, 0.25)',
    backgroundDark: 'rgba(0, 0, 0, 0.5)',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    modal: 'rgba(0, 0, 0, 0.5)',
  },

  // Shadow Colors (for box-shadow)
  shadow: {
    xs: 'rgba(0, 0, 0, 0.02)',
    sm: 'rgba(0, 0, 0, 0.04)',
    md: 'rgba(0, 0, 0, 0.05)',
    lg: 'rgba(0, 0, 0, 0.08)',
    xl: 'rgba(0, 0, 0, 0.1)',
    xxl: 'rgba(0, 0, 0, 0.12)',
    xxxl: 'rgba(0, 0, 0, 0.15)',
    drag: 'rgba(0, 0, 0, 0.15)',
    card: 'rgba(0, 0, 0, 0.2)',
    hover: 'rgba(0, 0, 0, 0.12)',
    focus: 'rgba(59, 130, 246, 0.1)',
  },

  // White with opacity (for dark backgrounds)
  whiteAlpha: {
    2: 'rgba(255, 255, 255, 0.02)',
    3: 'rgba(255, 255, 255, 0.03)',
    5: 'rgba(255, 255, 255, 0.05)',
    12: 'rgba(255, 255, 255, 0.12)',
    25: 'rgba(255, 255, 255, 0.25)',
    41: 'rgba(255, 255, 255, 0.41)',
    50: 'rgba(255, 255, 255, 0.5)',
    70: 'rgba(255, 255, 255, 0.7)',
    80: 'rgba(255, 255, 255, 0.8)',
    90: 'rgba(255, 255, 255, 0.9)',
  },

  // Black with opacity
  blackAlpha: {
    2: 'rgba(0, 0, 0, 0.02)',
    4: 'rgba(0, 0, 0, 0.04)',
    5: 'rgba(0, 0, 0, 0.05)',
    8: 'rgba(0, 0, 0, 0.08)',
    10: 'rgba(0, 0, 0, 0.1)',
    14: 'rgba(0, 0, 0, 0.14)',
    15: 'rgba(0, 0, 0, 0.15)',
    20: 'rgba(0, 0, 0, 0.20)',
    30: 'rgba(0, 0, 0, 0.30)',
    35: 'rgba(0, 0, 0, 0.35)',
    50: 'rgba(0, 0, 0, 0.5)',
    60: 'rgba(0, 0, 0, 0.6)',
  },

  // Form State Colors
  form: {
    input: {
      bg: '#FAFAFA',
      border: '#F5F5F5',
      borderHover: '#90CAF9',
      borderFocus: '#1976d2',
      borderDisabled: '#E0E0E0',
      bgDisabled: '#E0E0E0',
      textDisabled: '#9E9E9E',
      placeholder: '#9ca3af',
    },
    button: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
    },
  },

  // Border Colors
  border: {
    light: '#F5F5F5',
    medium: '#E5E5E5',
    dark: '#525252',
    input: '#d1d5db',
    inputHover: '#9ca3af',
    inputFocus: '#3b82f6',
  },

  // Text Colors
  text: {
    primary: '#262626',
    secondary: '#A1A1A1',
    disabled: '#D4D4D4',
    inverse: '#FFFFFF',
    label: '#374151',
    heading: '#111827',
    muted: '#71717A',
    link: '#1976d2',
  },

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#000000',
    secondary: '#171717',
    footer: '#f9fafb',
    hover: 'rgba(0, 0, 0, 0.02)',
    active: 'rgba(0, 0, 0, 0.08)',
  },

  // Chart Colors
  chart: {
    primary: '#3f51b5',    // Indigo/Blue
    secondary: '#f50057',  // Pink/Magenta
    tertiary: '#4caf50',   // Green
    quaternary: '#ff9800', // Orange
    quinary: '#9c27b0',    // Purple
  },

  // Tab Colors
  tab: {
    active: '#6366F1',
    inactive: '#71717A',
  },

  // Tag Colors
  tag: {
    default: '#9E9E9E',
  },

  // Scrollbar Colors
  scrollbar: {
    thumb: '#A1A1A1',
    track: '#F5F5F5',
  },
} as const;

export type FloowColors = typeof floowColors;
