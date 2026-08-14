import type { ReactNode } from 'react';

export interface PricingFeature {
  /**
   * The text of the feature
   */
  text: string;

  /**
   * Whether the feature is included (checked) or not
   */
  included?: boolean;
}

export interface PricingCardProps {
  /**
   * The plan name/title
   */
  planName: string;

  /**
   * The plan description/subtitle
   */
  planDescription?: string;

  /**
   * The price amount
   */
  price: number | string;

  /**
   * The price period (e.g., "per month", "per year")
   */
  pricePeriod?: string;

  /**
   * The currency symbol
   * @default '$'
   */
  currency?: string;

  /**
   * The button text
   */
  buttonText?: string;

  /**
   * Button click handler
   */
  onButtonClick?: () => void;

  /**
   * List of features included in the plan
   */
  features?: PricingFeature[];

  /**
   * Optional icon to display at the top
   */
  icon?: ReactNode;

  /**
   * Optional custom background
   */
  background?: string;

  /**
   * Whether this is a highlighted/featured plan
   */
  featured?: boolean;

  /**
   * Disables the action button (e.g. for a non-actionable/informational plan)
   */
  disabled?: boolean;

  /**
   * Small badge label rendered on the card, e.g. "Most Popular"
   */
  badge?: string;

  /**
   * Optional slot rendered between the price and the button, e.g. add-on steppers
   */
  stepper?: ReactNode;
}
