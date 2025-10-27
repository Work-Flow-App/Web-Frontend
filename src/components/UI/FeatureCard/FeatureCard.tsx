import React from 'react';
import * as S from './FeatureCard.styled';
import type { FeatureCardProps } from './FeatureCard.types';

function FeatureCard({ title, description, icon, onClick, background, borderColor }: FeatureCardProps): React.ReactElement {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <S.CardWrapper
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      background={background}
      borderColor={borderColor}
    >
      {icon && <S.IconWrapper>{icon}</S.IconWrapper>}
      <S.Title>{title}</S.Title>
      <S.Description>{description}</S.Description>
    </S.CardWrapper>
  );
}

export { FeatureCard as default, FeatureCard };
