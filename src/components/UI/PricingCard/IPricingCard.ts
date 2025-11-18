export interface IPricingFeature {
  /**
   * The text of the feature
   */
  text: string;

  /**
   * Whether the feature is included (checked) or not
   */
  included?: boolean;
}

export interface IPricingCard {
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
  features?: IPricingFeature[];

  /**
   * Optional icon to display at the top
   */
  icon?: React.ReactNode;

  /**
   * Optional custom background
   */
  background?: string;

  /**
   * Whether this is a highlighted/featured plan
   */
  featured?: boolean;
}
