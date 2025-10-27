import React from 'react';
import * as S from './PricingCard.styled';
import type { PricingCardProps } from './PricingCard.types';

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
}: PricingCardProps): React.ReactElement {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <S.CardWrapper background={background}>
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

      {/* Button */}
      <S.StyledButton onClick={handleButtonClick}>{buttonText}</S.StyledButton>

      {/* Features */}
      {features.length > 0 && (
        <S.FeaturesSection>
          <S.FeaturesSectionTitle>What you will get</S.FeaturesSectionTitle>
          {features.map((feature, index) => (
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
