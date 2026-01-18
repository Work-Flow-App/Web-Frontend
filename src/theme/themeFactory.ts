import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { rem } from '../components/UI/Typography/utility';
import overrides from './overrides';
import transitions from './transitions';
import typography from './typography';
import spacingConfig from './spacing';
import { getPalette } from './palette';
import type { CustomThemeColors } from './palette';

// Augment theme with custom fontSize scale and font weights
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
  interface TypographyVariants {
    fontWeightSemiBold: number;
  }
  interface TypographyVariantsOptions {
    fontWeightSemiBold?: number;
  }
}

export interface AppThemeOptions {
  mode: 'light' | 'dark';
  customColors?: CustomThemeColors;
}

export const createAppTheme = ({ mode, customColors }: AppThemeOptions) => {
  const palette = getPalette(mode, customColors);

  // Dynamic overrides for buttons to ensure they use the primary color
  const dynamicOverrides = {
    ...overrides,
    MuiButton: {
      ...overrides?.MuiButton,
      styleOverrides: {
        ...overrides?.MuiButton?.styleOverrides,
        containedPrimary: {
           // @ts-ignore - palette is not fully typed in the factory context yet against the custom palette
          backgroundColor: palette.primary.main,
          color: palette.primary.contrastText,
          '&:hover': {
            // @ts-ignore
            backgroundColor: palette.primary.dark,
          },
        },
        outlinedPrimary: {
          // @ts-ignore
          color: palette.primary.main,
          // @ts-ignore
          borderColor: palette.primary.main,
          '&:hover': {
             // @ts-ignore
            borderColor: palette.primary.dark,
             // @ts-ignore
            backgroundColor: palette.primary.alert,
          },
        },
      },
    },
  };

  const themeOptions: ThemeOptions = {
    palette,
    components: dynamicOverrides,
    spacing: spacingConfig.unit,
    transitions: transitions as any,
    typography,
    shape: {
      borderRadius: 8,
    },
    fontSize: {
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
    },
  };

  return createTheme(themeOptions);
};
