import React from 'react';
import type { ITitleHeader } from './ITitleHeader';
import {
  TitleHeaderContainer,
  TitleSection,
  Title,
  ActionsSection,
} from './TitleHeader.styles';

/**
 * TitleHeader component for table title
 *
 * @component
 * @example
 * ```tsx
 * <TitleHeader title="Team Members" />
 * ```
 */
const TitleHeader: React.FC<ITitleHeader> = ({
  title,
  actions,
  className,
}) => {
  // Don't render if no title and no actions
  if (!title && !actions) {
    return null;
  }

  return (
    <TitleHeaderContainer className={className}>
      <TitleSection>
        {title && <Title>{title}</Title>}
      </TitleSection>
      {actions && <ActionsSection>{actions}</ActionsSection>}
    </TitleHeaderContainer>
  );
};

export default TitleHeader;
