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
    75: '#F0F0F0',  // Light background variant for hover states
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A1A1A1',
    500: '#737373',
    600: '#525252',
    650: '#3d4956',  // Medium-dark grey for dividers/separators
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Dark Shades
  dark: {
    primary: '#121212',
    secondary: '#171717',
    tertiary: '#262626',
    slate: '#1b232d',  // Secondary dark shade for active/hover states
  },

  // Gradient Colors
  gradient: {
    whiteToGrey: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)',
    darkGrey: 'linear-gradient(180deg, #5E5E5E 0%, #121212 100%)',
    blackWhiteBlack: 'linear-gradient(270deg, #000000 0%, #FFFFFF 50%, #000000 100%)',
    silver: 'linear-gradient(180deg, #FAFAFA 0%, #949494 100%)',
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
} as const;

export type FloowColors = typeof floowColors;
