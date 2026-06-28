import React from 'react';
import { Badge } from '../Badge';
import { FieldsContainer } from './FieldsBadgeList.styles';
import type { FieldsBadgeListProps } from './FieldsBadgeList.types';

export const FieldsBadgeList: React.FC<FieldsBadgeListProps> = ({ fields, emptyText = '-' }) => {
  if (fields.length === 0) {
    return <>{emptyText}</>;
  }

  return (
    <FieldsContainer>
      {fields.map((field, index) => (
        <Badge key={index} variant="primary" size="small">
          {field.label || field.name}
        </Badge>
      ))}
    </FieldsContainer>
  );
};
