import { rem } from '../components/UI/Typography/utility';

// Typography system - Manrope from Figma
// Based on design system with sizes from XS to 9XL
export default {
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
  useNextVariants: true,

  // XS - 12px/16px
  xs: {
    fontSize: rem(12),
    lineHeight: rem(16),
  },

  // SM - 14px/20px
  sm: {
    fontSize: rem(14),
    lineHeight: rem(20),
  },

  // Base - 16px/24px
  base: {
    fontSize: rem(16),
    lineHeight: rem(24),
  },

  // LG - 18px/auto
  lg: {
    fontSize: rem(18),
    lineHeight: 'auto',
  },

  // XL - 20px/auto
  xl: {
    fontSize: rem(20),
    lineHeight: 'auto',
  },

  // 2XL - 24px/auto
  '2xl': {
    fontSize: rem(24),
    lineHeight: 'auto',
  },

  // 3XL - 30px/auto
  '3xl': {
    fontSize: rem(30),
    lineHeight: 'auto',
  },

  // 4XL - 36px/auto
  '4xl': {
    fontSize: rem(36),
    lineHeight: 'auto',
  },

  // 5XL - 48px/auto
  '5xl': {
    fontSize: rem(48),
    lineHeight: 'auto',
  },

  // 6XL - 60px/auto
  '6xl': {
    fontSize: rem(60),
    lineHeight: 'auto',
  },

  // 7XL - 72px/auto
  '7xl': {
    fontSize: rem(72),
    lineHeight: 'auto',
  },

  // 8XL - 96px/auto
  '8xl': {
    fontSize: rem(96),
    lineHeight: 'auto',
  },

  // 9XL - 128px/auto
  '9xl': {
    fontSize: rem(128),
    lineHeight: 'auto',
  },

  // MUI standard variants mapped to design system
  h1: {
    fontSize: rem(96), // 8XL
    lineHeight: 'auto',
    fontWeight: 700,
  },
  h2: {
    fontSize: rem(72), // 7XL
    lineHeight: 'auto',
    fontWeight: 700,
  },
  h3: {
    fontSize: rem(48), // 5XL
    lineHeight: 'auto',
    fontWeight: 700,
  },
  h4: {
    fontSize: rem(36), // 4XL
    lineHeight: 'auto',
    fontWeight: 700,
  },
  h5: {
    fontSize: rem(24), // 2XL
    lineHeight: 'auto',
    fontWeight: 700,
  },
  h6: {
    fontSize: rem(20), // XL
    lineHeight: 'auto',
    fontWeight: 600,
  },
  // Body text - Base size
  body1: {
    fontSize: rem(16),
    lineHeight: rem(24),
    fontWeight: 400, // Regular
  },
  body2: {
    fontSize: rem(14),
    lineHeight: rem(20),
    fontWeight: 400, // Regular
  },
  // Caption - SM size
  caption: {
    fontSize: rem(14),
    lineHeight: rem(20),
    fontWeight: 500, // Medium
  },
  // Button text
  button: {
    fontSize: rem(16),
    lineHeight: rem(24),
    fontWeight: 600, // Semi Bold
    textTransform: 'none' as const,
  },

  // Font weights from design system
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
};
