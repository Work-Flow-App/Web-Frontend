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
  typography: {
    ...typography,
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
  } as any,
  shape: {
    borderRadius: 8,
  },
} as ThemeOptions);

export default Theme;
