import { darken, lighten } from '@mui/material';
import { floowColors } from './colors';

// Use colors from design system
const PRIMARY = floowColors.black;
const SECONDARY = floowColors.grey[900];
const SUCCESS = floowColors.success.main;
const ERROR = floowColors.error.main;
const WARNING = floowColors.warning.main;
const INFO = floowColors.info.main;
const TEXT = floowColors.text.primary;
const DISABLED_TEXT = floowColors.text.disabled;
const ALT_TEXT = floowColors.text.secondary;
const BACKGROUND = floowColors.background.default;
const BACKGROUND_PAPER = floowColors.background.paper;
const MAIN_HEADER_BG = floowColors.grey[50];
const CHILD_HEADER_BG = floowColors.grey[100];
const DISABLE_BG = floowColors.grey[100];
const FIELD_BORDER = floowColors.border.medium;
const TABLE_BORDER = floowColors.border.light;
const ICON = floowColors.grey[600];
const SUCCESS_TEXT = floowColors.text.inverse;

// Floow Color System
const GREY_900 = floowColors.grey[900];
const GREY_800 = floowColors.grey[800];
const GREY_700 = floowColors.grey[700];
const GREY_600 = floowColors.grey[600];
const GREY_500 = floowColors.grey[500];
const GREY_400 = floowColors.grey[400];
const GREY_300 = floowColors.grey[300];
const GREY_200 = floowColors.grey[200];
const GREY_100 = floowColors.grey[100];
const GREY_50 = floowColors.grey[50];
const WHITE = floowColors.white;
const BLACK = floowColors.black;
const BLACK_LIGHT = '#333333';
const BLACK_DARK = floowColors.darkBlack;

declare module '@mui/material/styles' {
  interface PaletteColor {
    bgLight?: string;
  }

  interface Palette {
    myAwesomeColor?: string;
  }
  interface TypeText {
    success?: string;
    dark?: string;
  }
  interface SimplePaletteColorOptions {
    alert?: string;
    bgLight?: string;
  }
  interface TypeBackground {
    mainHeader?: string;
    childHeader?: string;
    dark?: string;
    default: string;
    disabled?: string;
  }
  interface DynamicValues {
    [name: string]: string | number;
  }
  export interface CustomColors {
    grey_900: string;
    grey_800: string;
    grey_700: string;
    grey_600: string;
    grey_500: string;
    grey_400: string;
    grey_300: string;
    grey_200: string;
    grey_100: string;
    grey_50: string;
    white: string;
    black: string;
    black_light: string;
    black_dark: string;
    black_25: string;
    error: string;
    error_light: string;
    warning: string;
    warning_light: string;
    info: string;
    info_light: string;
    success: string;
    success_light: string;
  }
  interface PaletteOptions {
    icon?: DynamicValues;
    colors?: DynamicValues;
    animation?: DynamicValues;
    border?: DynamicValues;
  }

  interface BoxShadow {
    buttonShadow: string;
    modalShadow: string;
    dropDownListShadow: string;
  }
  interface Palette {
    icon?: DynamicValues;
    colors: CustomColors;
    animation?: DynamicValues;
    border?: DynamicValues;
    tertiary: PaletteColor;
    boxShadow: BoxShadow;
  }
}

const FloowPalette = {
  primary: {
    light: BLACK_LIGHT,
    main: PRIMARY,
    dark: BLACK_DARK,
    contrastText: WHITE,
    alert: 'rgba(0, 0, 0, 0.1)',
  },
  secondary: {
    light: GREY_800,
    main: SECONDARY,
    dark: '#121212',
    contrastText: WHITE,
  },
  tertiary: {
    light: lighten(ALT_TEXT, 0.6),
    main: ALT_TEXT,
    dark: darken(ALT_TEXT, 0.1),
    contrastText: WHITE,
  },
  success: {
    light: 'rgba(0, 166, 62, 0.15)',
    main: SUCCESS,
    dark: SUCCESS,
    contrastText: WHITE,
    alert: 'rgba(0, 166, 62, 0.15)',
  },
  warning: {
    light: 'rgba(255, 165, 0, 0.15)',
    main: WARNING,
    dark: '#FF8C00',
    contrastText: WHITE,
  },
  error: {
    light: 'rgba(251, 44, 54, 0.15)',
    bgLight: 'rgba(251, 44, 54, 0.1)',
    main: ERROR,
    dark: ERROR,
    contrastText: WHITE,
    alert: 'rgba(251, 44, 54, 0.15)',
  },
  info: {
    light: 'rgba(33, 150, 243, 0.15)',
    main: INFO,
    dark: '#1976D2',
    contrastText: WHITE,
  },
  text: {
    primary: TEXT,
    secondary: ALT_TEXT,
    disabled: DISABLED_TEXT,
    success: SUCCESS_TEXT,
    dark: darken(TEXT, 0.1),
  },
  background: {
    mainHeader: MAIN_HEADER_BG,
    childHeader: CHILD_HEADER_BG,
    dark: BLACK,
    default: BACKGROUND,
    paper: BACKGROUND_PAPER,
    disabled: DISABLE_BG,
  },
  border: {
    light: lighten(FIELD_BORDER, 0.5),
    main: FIELD_BORDER,
    dark: darken(FIELD_BORDER, 0.1),
    secondary: TABLE_BORDER,
  },

  // Animation
  animation: {
    transparent: 'rgba(0, 0, 0, 0)',
  },

  icon: {
    light: lighten(ICON, 0.7),
    main: ICON,
    dark: GREY_700,
    opacityRegular: 0.5,
    opacityHover: 1,
  },

  colors: {
    grey_900: GREY_900,
    grey_800: GREY_800,
    grey_700: GREY_700,
    grey_600: GREY_600,
    grey_500: GREY_500,
    grey_400: GREY_400,
    grey_300: GREY_300,
    grey_200: GREY_200,
    grey_100: GREY_100,
    grey_50: GREY_50,
    white: WHITE,
    black: BLACK,
    black_light: BLACK_LIGHT,
    black_dark: BLACK_DARK,
    black_25: '#E9E9E9',
    error: ERROR,
    error_light: 'rgba(251, 44, 54, 0.15)',
    warning: WARNING,
    warning_light: 'rgba(255, 165, 0, 0.15)',
    info: INFO,
    info_light: 'rgba(33, 150, 243, 0.15)',
    success: SUCCESS,
    success_light: 'rgba(0, 166, 62, 0.15)',
  },
  boxShadow: {
    buttonShadow: `0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.20)`,
    modalShadow: `0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)`,
    dropDownListShadow: `0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)`,
  },
};

export default FloowPalette;
