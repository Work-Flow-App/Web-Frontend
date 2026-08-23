import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import { floowColors } from '../../../theme/colors';
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
  selectable = false,
  selected = false,
  onSelect,
}: PricingCardProps): React.ReactElement {
  const handleButtonClick = () => {
    if (!disabled && onButtonClick) {
      onButtonClick();
    }
  };

  const clickable = selectable && !!onSelect;

  const handleCardClick = () => {
    if (clickable) onSelect?.();
  };

  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (!clickable) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <S.CardWrapper
      background={background}
      selected={selectable ? selected : featured}
      clickable={clickable}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role={clickable ? 'radio' : undefined}
      aria-checked={clickable ? selected : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {(badge || featured) && <S.FeaturedBadge>{badge ?? 'Most Popular'}</S.FeaturedBadge>}

      <S.HeaderSection>
        <S.TitleRow>
          <S.NameGroup>
            {selectable ? <S.RadioIndicator selected={selected} /> : icon}
            <S.PlanName>{planName}</S.PlanName>
          </S.NameGroup>

          <S.PriceSection>
            <S.PriceRow>
              <S.Currency>{currency}</S.Currency>
              <S.Price>{price}</S.Price>
            </S.PriceRow>
            {pricePeriod && <S.PricePeriod>{pricePeriod}</S.PricePeriod>}
          </S.PriceSection>
        </S.TitleRow>

        {planDescription && <S.PlanDescription>{planDescription}</S.PlanDescription>}
      </S.HeaderSection>

      {/* Stepper (opt-in add-on controls) */}
      {stepper}

      {/* Button is opt-in: a selectable card group typically drives one shared button outside the cards */}
      {onButtonClick && (
        <S.StyledButton onClick={handleButtonClick} disabled={disabled}>
          {buttonText}
        </S.StyledButton>
      )}

      {/* Features */}
      {features.length > 0 && (
        <S.FeaturesSection>
          <S.FeaturesSectionTitle>What you will get</S.FeaturesSectionTitle>
          {features.map((feature: PricingFeature, index: number) => (
            <S.FeatureItem key={index}>
              {feature.included === false ? (
                <RemoveIcon fontSize="small" sx={{ color: floowColors.blackAlpha[30], flexShrink: 0 }} />
              ) : (
                <CheckIcon fontSize="small" sx={{ color: floowColors.success.main, flexShrink: 0 }} />
              )}
              <S.FeatureText>{feature.text}</S.FeatureText>
            </S.FeatureItem>
          ))}
        </S.FeaturesSection>
      )}
    </S.CardWrapper>
  );
}

export { PricingCard as default, PricingCard };
