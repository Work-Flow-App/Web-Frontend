export interface FeatureCardProps {
  /**
   * The title of the feature card
   */
  title: string;

  /**
   * The description text of the feature card
   */
  description: string;

  /**
   * Optional icon/image to display above the title
   */
  icon?: React.ReactNode;

  /**
   * Optional click handler for the card
   */
  onClick?: () => void;

  /**
   * Custom background color/gradient
   * @default 'rgba(255, 255, 255, 0.02)'
   */
  background?: string;

  /**
   * Custom border color
   * @default 'rgba(255, 255, 255, 0.25)'
   */
  borderColor?: string;

  /**
   * Optional className for custom styling
   */
  className?: string;
}
