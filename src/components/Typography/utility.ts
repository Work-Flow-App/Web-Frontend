import type { Palette, CSSObject } from '@mui/material/styles';
import Kind from './enum/Kind';

/**
 * Converts pixel to rem
 *
 * @param { number } px
 * @returns { string } `1rem`
 * @example rem(16);
 */
export const rem = (px: number): string => `${px / 16}rem`;

/**
 * Converts pixel to em
 *
 * @param { number } px
 * @returns { string } `1em`
 * @example em(16);
 */
export const em = (px: number): string => `${px / 16}em`;

/**
 * The Bold Values
 * @returns the bold value
 * @example Bold.400, Bold.600
 */
export const Bold = {
  _200: 200,
  _300: 300,
  _400: 400,
  _500: 500,
  _600: 600,
  _700: 700,
  _800: 800,
  _900: 900,
  _1000: 1000,
};

/**
 * The Border Values
 * @returns the bold value
 * @example Bold.400, Bold.600
 */
export const border = (width: number, style: string, color: string) => {
  return `${rem(width)} ${style} ${color}`;
};

/**
 * Get color by kind from palette
 * @returns the color value based on kind
 * @example getColorByKind(Kind.Primary, palette)
 */
export const getColorByKind = (kind: string | undefined, palette: Palette) => {
  switch (kind) {
    case Kind.Primary:
      return palette.primary.main;
    case Kind.Secondary:
      return palette.secondary.main;
    case Kind.Ternary:
      return palette.grey?.[900] || palette.grey[900];
    case Kind.Success:
      return palette.success.main;
    case Kind.Error:
      return palette.error.main;
    case Kind.Warning:
      return palette.warning.main;
    default:
      return palette.text.primary;
  }
};

export const titleCaseStyle: CSSObject = {
  // textTransform: `lowercase`,

  '&:first-letter': {
    textTransform: 'uppercase',
  },
};
