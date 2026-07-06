import React from 'react';
import * as S from './OverviewField.styles';

interface CustomerNameProps {
  name: string | null | undefined;
}

export const CustomerName: React.FC<CustomerNameProps> = ({ name }) => {
  return (
    <S.OverviewCard>
      <S.CardLabel>Customer Name</S.CardLabel>
      <S.CardValueContainer>
        <S.CardValueMain>{name || '-'}</S.CardValueMain>
      </S.CardValueContainer>
    </S.OverviewCard>
  );
};
