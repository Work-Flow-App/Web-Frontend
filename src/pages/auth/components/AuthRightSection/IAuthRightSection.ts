export interface FeatureItem {
  title: string;
  description: string;
}

export interface AuthRightSectionProps {
  /**
   * Array of features to display in the carousel
   * @default DEFAULT_FEATURES
   */
  features?: FeatureItem[];

  /**
   * Tagline text to display below the logo
   * @default "Turn chaos into clarity with smarter task management. Stay organized, stay ahead!"
   */
  tagline?: string;

  /**
   * Enable/disable auto-play animation for feature cards
   * @default true
   */
  enableAutoPlay?: boolean;

  /**
   * Interval in milliseconds for auto-play animation
   * @default 4000
   */
  autoPlayInterval?: number;
}
