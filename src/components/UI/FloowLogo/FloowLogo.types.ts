export type FloowLogoVariant = 'light' | 'white';

export interface FloowLogoProps {
  /** @deprecated Text is now embedded in the SVG logo */
  showText?: boolean;
  width?: string | number;
  height?: string | number;
  variant?: FloowLogoVariant;
}
