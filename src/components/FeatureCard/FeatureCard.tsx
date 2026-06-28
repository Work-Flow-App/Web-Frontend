import React from 'react';
import * as S from './FeatureCard.styled';
import type { IFeatureCard } from './IFeatureCard';

function FeatureCard({ title, description, icon, onClick, background, borderColor, className }: IFeatureCard): React.ReactElement {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <S.CardWrapper
      onClick={handleClick}
      className={className}
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
