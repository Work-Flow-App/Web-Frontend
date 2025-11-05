import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { rem } from '../components/UI/Typography/utility';

// Local
import palette from './palette';
import overrides from './overrides';
import transitions from './transitions';
import typography from './typography';
import spacingConfig from './spacing';

export const Theme = createTheme({
  palette,
  components: overrides,
  spacing: spacingConfig.unit,
  transitions,
  typography,
  shape: {
    borderRadius: 8,
  },
} as ThemeOptions);

// Augment theme with custom fontSize scale
declare module '@mui/material/styles' {
  interface Theme {
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
      '7xl': string;
      '8xl': string;
      '9xl': string;
    };
  }
  interface ThemeOptions {
    fontSize?: {
      xs?: string;
      sm?: string;
      base?: string;
      lg?: string;
      xl?: string;
      '2xl'?: string;
      '3xl'?: string;
      '4xl'?: string;
      '5xl'?: string;
      '6xl'?: string;
      '7xl'?: string;
      '8xl'?: string;
      '9xl'?: string;
    };
  }
}

// Add fontSize to the theme
Theme.fontSize = {
  xs: rem(12),
  sm: rem(14),
  base: rem(16),
  lg: rem(18),
  xl: rem(20),
  '2xl': rem(24),
  '3xl': rem(30),
  '4xl': rem(36),
  '5xl': rem(48),
  '6xl': rem(60),
  '7xl': rem(72),
  '8xl': rem(96),
  '9xl': rem(128),
};

export default Theme;
