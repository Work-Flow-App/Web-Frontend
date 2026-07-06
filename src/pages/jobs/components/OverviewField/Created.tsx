import React from 'react';
import * as S from './OverviewField.styles';

interface CreatedProps {
  createdAt: string | null | undefined;
}

export const Created: React.FC<CreatedProps> = ({ createdAt }) => {
  let formattedDate = '-';
  if (createdAt) {
    const date = new Date(createdAt);
    if (!isNaN(date.getTime())) {
      // Formats as DD/MM/YYYY (e.g., 18/06/2026)
      formattedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  }

  return (
    <S.OverviewCard>
      <S.CardLabel>Created</S.CardLabel>
      <S.CardValueContainer>
        <S.CardValueMain>{formattedDate}</S.CardValueMain>
      </S.CardValueContainer>
    </S.OverviewCard>
  );
};
