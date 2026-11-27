import React, { useState } from 'react';
import * as S from './AttachmentUploadDialog.styles';

export interface ExpandableDescriptionProps {
  description?: string;
  isMine?: boolean;
}

export const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({
  description,
  isMine = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description || !description.trim()) {
    return null;
  }

  const trimmed = description.trim();
  const isLong = trimmed.length > 70 || trimmed.includes('\n');

  return (
    <S.ExpandableContainer isMine={isMine}>
      <S.ExpandableText isExpanded={isExpanded} isMine={isMine}>
        {trimmed}
      </S.ExpandableText>
      {isLong && (
        <S.MoreButton
          type="button"
          isMine={isMine}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((prev) => !prev);
          }}
        >
          {isExpanded ? 'less' : '... more'}
        </S.MoreButton>
      )}
    </S.ExpandableContainer>
  );
};
