import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

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

export default Theme;
