import React from 'react';
import { StyledLink } from './Link.styles';
import type { LinkProps } from './Link.types';

export const Link: React.FC<LinkProps> = ({ children, onClick, className = '' }) => {
  return (
    <StyledLink onClick={onClick} className={className}>
      {children}
    </StyledLink>
  );
};
