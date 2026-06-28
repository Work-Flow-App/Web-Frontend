import React from 'react';
import * as S from './OverviewField.styles';

interface StatusProps {
  status: string | null | undefined;
}

export const Status: React.FC<StatusProps> = ({ status }) => {
  return (
    <S.OverviewCard>
      <S.CardLabel>Status</S.CardLabel>
      <S.CardValueContainer>
        <S.CardValueMain>{status || '-'}</S.CardValueMain>
      </S.CardValueContainer>
    </S.OverviewCard>
  );
};
