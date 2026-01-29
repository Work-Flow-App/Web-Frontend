import { darken, lighten } from '@mui/material/styles';
import { floowColors } from './colors';
import type { PaletteMode } from '@mui/material';

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
const BLACK_LIGHT = floowColors.tailwind.gray[800];
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
    authGradient?: string;
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
    chart_primary: string;
    chart_secondary: string;
    chart_tertiary: string;
    chart_quaternary: string;
    chart_quinary: string;
    slate_light: string;
    slate_main: string;
    slate_dark: string;
    blue_dark: string;
    blue_main: string;
    red_main: string;
    gradient_blueVertical: string;
    gradient_blueHorizontal: string;
    gradient_slateHorizontal: string;
    invitation_pending: string;
    invitation_accepted: string;
    invitation_expired: string;
    overlay_backdrop: string;
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
    authCard: string;
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

export interface CustomThemeColors {
  primary: string;
  secondary?: string;
  background?: string;
  paper?: string;
}

export const getPalette = (mode: PaletteMode, customColors?: CustomThemeColors) => {
  const isDark = mode === 'dark';

  const primaryMain = customColors?.primary || (isDark ? WHITE : PRIMARY);
  const secondaryMain = customColors?.secondary || (isDark ? GREY_400 : SECONDARY);
  const backgroundDefault = customColors?.background || (isDark ? BLACK_DARK : BACKGROUND);
  const backgroundPaper = customColors?.paper || (isDark ? GREY_900 : BACKGROUND_PAPER);
  const textPrimary = isDark ? WHITE : TEXT;
  const textSecondary = isDark ? GREY_400 : ALT_TEXT;

  return {
    mode,
    primary: {
      light: BLACK_LIGHT,
      main: primaryMain,
      dark: BLACK_DARK,
      contrastText: isDark ? BLACK : WHITE,
      alert: floowColors.blackAlpha[10],
    },
    secondary: {
      light: GREY_800,
      main: secondaryMain,
      dark: floowColors.dark.primary,
      contrastText: isDark ? BLACK : WHITE,
    },
    tertiary: {
      light: lighten(textSecondary, 0.6),
      main: textSecondary,
      dark: darken(textSecondary, 0.1),
      contrastText: WHITE,
    },
    success: {
      light: floowColors.success.light,
      main: SUCCESS,
      dark: SUCCESS,
      contrastText: WHITE,
      alert: floowColors.success.light,
    },
    warning: {
      light: floowColors.warning.light,
      main: WARNING,
      dark: floowColors.warning.dark,
      contrastText: WHITE,
    },
    error: {
      light: floowColors.error.light,
      bgLight: floowColors.error.bgLight,
      main: ERROR,
      dark: ERROR,
      contrastText: WHITE,
      alert: floowColors.error.light,
    },
    info: {
      light: floowColors.info.light,
      main: INFO,
      dark: floowColors.info.dark,
      contrastText: WHITE,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: DISABLED_TEXT,
      success: SUCCESS_TEXT,
      dark: darken(textPrimary, 0.1), // Adjusted for dark mode?
    },
    background: {
      mainHeader: isDark ? GREY_900 : MAIN_HEADER_BG,
      childHeader: isDark ? GREY_800 : CHILD_HEADER_BG,
      dark: BLACK,
      default: backgroundDefault,
      paper: backgroundPaper,
      disabled: DISABLE_BG,
      authGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    border: {
      light: lighten(FIELD_BORDER, 0.5),
      main: FIELD_BORDER,
      dark: darken(FIELD_BORDER, 0.1),
      secondary: TABLE_BORDER,
      subtle: floowColors.blackAlpha[5],
    },

    // Animation
    animation: {
      transparent: 'rgba(0, 0, 0, 0)',
    },

    icon: {
      light: lighten(ICON, 0.7),
      main: isDark ? GREY_400 : ICON,
      dark: GREY_700,
      opacityRegular: 0.5,
      opacityHover: 1,
    },

    colors: {
      grey_900: isDark ? GREY_50 : GREY_900,
      grey_800: isDark ? GREY_100 : GREY_800,
      grey_700: isDark ? GREY_200 : GREY_700,
      grey_600: isDark ? GREY_300 : GREY_600,
      grey_500: isDark ? GREY_400 : GREY_500,
      grey_400: isDark ? GREY_500 : GREY_400,
      grey_300: isDark ? GREY_600 : GREY_300,
      grey_200: isDark ? GREY_700 : GREY_200,
      grey_100: isDark ? GREY_800 : GREY_100,
      grey_50: isDark ? GREY_900 : GREY_50,
      white: isDark ? BLACK_LIGHT : WHITE,
      black: isDark ? WHITE : BLACK,
      black_light: BLACK_LIGHT,
      black_dark: BLACK_DARK,
      black_25: '#E9E9E9',
      error: ERROR,
      error_light: floowColors.error.light,
      warning: WARNING,
      warning_light: floowColors.warning.light,
      info: INFO,
      info_light: floowColors.info.light,
      success: SUCCESS,
      success_light: floowColors.success.light,
      chart_primary: floowColors.chart.primary,
      chart_secondary: floowColors.chart.secondary,
      chart_tertiary: floowColors.chart.tertiary,
      chart_quaternary: floowColors.chart.quaternary,
      chart_quinary: floowColors.chart.quinary,
      slate_light: floowColors.slate.light,
      slate_main: floowColors.slate.main,
      slate_dark: floowColors.slate.dark,
      blue_dark: floowColors.blue.dark,
      blue_main: floowColors.blue.main,
      blue_light: floowColors.blue.light,
      blue_hover: floowColors.blue.hover,
      red_main: floowColors.red.main,
      gradient_blueVertical: floowColors.gradient.blueVertical,
      gradient_blueHorizontal: floowColors.gradient.blueHorizontal,
      gradient_slateHorizontal: floowColors.gradient.slateHorizontal,
      gradient_authBackground: floowColors.gradient.authBackground,
      gradient_authGlow: floowColors.gradient.authGlow,
      gradient_pricingCard: floowColors.gradient.pricingCard,
      gradient_pricingIcon: floowColors.gradient.pricingIcon,
      gradient_pricingButton: floowColors.gradient.pricingButton,
      gradient_pricingButtonHover: floowColors.gradient.pricingButtonHover,
      invitation_pending: floowColors.invitationStatus.pending,
      invitation_accepted: floowColors.invitationStatus.accepted,
      invitation_expired: floowColors.invitationStatus.expired,
      // Overlay colors
      overlay_light: floowColors.overlay.light,
      overlay_medium: floowColors.overlay.medium,
      overlay_dark: floowColors.overlay.dark,
      overlay_backdrop: floowColors.overlay.backdrop,
      // Shadow colors
      shadow_xs: floowColors.shadow.xs,
      shadow_sm: floowColors.shadow.sm,
      shadow_md: floowColors.shadow.md,
      shadow_lg: floowColors.shadow.lg,
      shadow_xl: floowColors.shadow.xl,
      shadow_xxl: floowColors.shadow.xxl,
      shadow_xxxl: floowColors.shadow.xxxl,
      shadow_drag: floowColors.shadow.drag,
      shadow_card: floowColors.shadow.card,
      shadow_hover: floowColors.shadow.hover,
      shadow_focus: floowColors.shadow.focus,
      // White alpha
      whiteAlpha_2: floowColors.whiteAlpha[2],
      whiteAlpha_3: floowColors.whiteAlpha[3],
      whiteAlpha_5: floowColors.whiteAlpha[5],
      whiteAlpha_12: floowColors.whiteAlpha[12],
      whiteAlpha_25: floowColors.whiteAlpha[25],
      whiteAlpha_50: floowColors.whiteAlpha[50],
      whiteAlpha_70: floowColors.whiteAlpha[70],
      whiteAlpha_80: floowColors.whiteAlpha[80],
      whiteAlpha_90: floowColors.whiteAlpha[90],
      // Black alpha
      blackAlpha_2: floowColors.blackAlpha[2],
      blackAlpha_4: floowColors.blackAlpha[4],
      blackAlpha_5: floowColors.blackAlpha[5],
      blackAlpha_8: floowColors.blackAlpha[8],
      blackAlpha_10: floowColors.blackAlpha[10],
      blackAlpha_15: floowColors.blackAlpha[15],
      blackAlpha_20: floowColors.blackAlpha[20],
      blackAlpha_35: floowColors.blackAlpha[35],
      blackAlpha_50: floowColors.blackAlpha[50],
      // Status badge colors
      statusBadge_active_bg: floowColors.statusBadge.active.bg,
      statusBadge_active_text: floowColors.statusBadge.active.text,
      statusBadge_pending_bg: floowColors.statusBadge.pending.bg,
      statusBadge_pending_text: floowColors.statusBadge.pending.text,
      statusBadge_inactive_bg: floowColors.statusBadge.inactive.bg,
      statusBadge_inactive_text: floowColors.statusBadge.inactive.text,
      statusBadge_default_bg: floowColors.statusBadge.default.bg,
      statusBadge_default_text: floowColors.statusBadge.default.text,
      // Form colors
      form_input_bg: floowColors.form.input.bg,
      form_input_border: floowColors.form.input.border,
      form_input_borderHover: floowColors.form.input.borderHover,
      form_input_borderFocus: floowColors.form.input.borderFocus,
      form_input_borderDisabled: floowColors.form.input.borderDisabled,
      form_input_bgDisabled: floowColors.form.input.bgDisabled,
      form_input_textDisabled: floowColors.form.input.textDisabled,
      form_button_primary: floowColors.form.button.primary,
      form_button_primaryHover: floowColors.form.button.primaryHover,
      form_button_secondary: floowColors.form.button.secondary,
      form_button_secondaryHover: floowColors.form.button.secondaryHover,
      // Tab colors
      tab_active: floowColors.tab.active,
      tab_inactive: floowColors.tab.inactive,
      // Tag colors
      tag_default: floowColors.tag.default,
      // Tailwind colors
      tailwind_gray_50: floowColors.tailwind.gray[50],
      tailwind_gray_200: floowColors.tailwind.gray[200],
      tailwind_gray_300: floowColors.tailwind.gray[300],
      tailwind_gray_400: floowColors.tailwind.gray[400],
      tailwind_gray_500: floowColors.tailwind.gray[500],
      tailwind_gray_600: floowColors.tailwind.gray[600],
      tailwind_gray_700: floowColors.tailwind.gray[700],
      tailwind_gray_900: floowColors.tailwind.gray[900],
      // Text colors
      text_label: floowColors.text.label,
      text_heading: floowColors.text.heading,
      text_muted: floowColors.text.muted,
      // Glass morphism
      glass_background: floowColors.glass.background,
      glass_border: floowColors.glass.border,
      glass_backgroundDark: floowColors.glass.backgroundDark,
      // Scrollbar
      scrollbar_thumb: floowColors.scrollbar.thumb,
      scrollbar_track: floowColors.scrollbar.track,
    },
    boxShadow: {
      buttonShadow: `0px 1px 5px 0px ${floowColors.shadow.xxl}, 0px 2px 2px 0px ${floowColors.blackAlpha[14]}, 0px 3px 1px -2px ${floowColors.blackAlpha[20]}`,
      modalShadow: `0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px ${floowColors.shadow.lg}`,
      dropDownListShadow: `0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px ${floowColors.shadow.xl}`,
      authCard: `0px 4px 20px ${floowColors.shadow.lg}, 0px 2px 8px ${floowColors.shadow.sm}`,
    },
  };
};

const FloowPalette = getPalette('light');

export default FloowPalette;
