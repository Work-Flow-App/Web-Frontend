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
    dark: '#1976d2',
    main: '#2196f3',
  },

  red: {
    main: '#ef4444',
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
  },

  // Status Colors
  error: {
    main: '#FB2C36',
    light: 'rgba(251, 44, 54, 0.15)',
  },

  warning: {
    main: '#FFA500',
    light: 'rgba(255, 165, 0, 0.15)',
  },

  info: {
    main: '#2196F3',
    light: 'rgba(33, 150, 243, 0.15)',
  },

  success: {
    main: '#00A63E',
    light: 'rgba(0, 166, 62, 0.15)',
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
  },

  // Border Colors
  border: {
    light: '#F5F5F5',
    medium: '#E5E5E5',
    dark: '#525252',
  },

  // Text Colors
  text: {
    primary: '#262626',
    secondary: '#A1A1A1',
    disabled: '#D4D4D4',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#000000',
    secondary: '#171717',
  },

  // Chart Colors
  chart: {
    primary: '#3f51b5',    // Indigo/Blue
    secondary: '#f50057',  // Pink/Magenta
    tertiary: '#4caf50',   // Green
    quaternary: '#ff9800', // Orange
    quinary: '#9c27b0',    // Purple
  },
} as const;

export type FloowColors = typeof floowColors;
