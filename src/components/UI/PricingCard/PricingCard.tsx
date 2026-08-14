import React from 'react';
import * as S from './PricingCard.styled';
import type { PricingCardProps, PricingFeature } from './PricingCard.types';

function PricingCard({
  planName,
  planDescription,
  price,
  pricePeriod = 'per month',
  currency = '$',
  buttonText = 'Get Started',
  onButtonClick,
  features = [],
  icon,
  background,
  featured = false,
  disabled = false,
  badge,
  stepper,
}: PricingCardProps): React.ReactElement {
  const handleButtonClick = () => {
    if (!disabled && onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <S.CardWrapper background={background} featured={featured}>
      {(badge || featured) && <S.FeaturedBadge>{badge ?? 'Most Popular'}</S.FeaturedBadge>}

      {/* Icon */}
      {icon ? icon : <S.IconCircle />}

      {/* Header Section */}
      <S.HeaderSection>
        <S.PlanName>{planName}</S.PlanName>
        {planDescription && <S.PlanDescription>{planDescription}</S.PlanDescription>}

        {/* Price */}
        <S.PriceSection>
          <S.Currency>{currency}</S.Currency>
          <S.Price>{price}</S.Price>
          {pricePeriod && <S.PricePeriod>{pricePeriod}</S.PricePeriod>}
        </S.PriceSection>
      </S.HeaderSection>

      {/* Stepper (opt-in add-on controls) */}
      {stepper}

      {/* Button */}
      <S.StyledButton onClick={handleButtonClick} disabled={disabled}>
        {buttonText}
      </S.StyledButton>

      {/* Features */}
      {features.length > 0 && (
        <S.FeaturesSection>
          <S.FeaturesSectionTitle>What you will get</S.FeaturesSectionTitle>
          {features.map((feature: PricingFeature, index: number) => (
            <S.FeatureItem key={index}>
              <S.RadioIcon />
              <S.FeatureText>{feature.text}</S.FeatureText>
            </S.FeatureItem>
          ))}
        </S.FeaturesSection>
      )}
    </S.CardWrapper>
  );
}

export { PricingCard as default, PricingCard };
