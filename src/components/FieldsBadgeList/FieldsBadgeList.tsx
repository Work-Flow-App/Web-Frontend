import React from 'react';
import { Tooltip } from '@mui/material';
import { Badge } from '../Badge';
import { FieldsContainer } from './FieldsBadgeList.styles';
import type { FieldsBadgeListProps } from './FieldsBadgeList.types';

export const FieldsBadgeList: React.FC<FieldsBadgeListProps> = ({
  fields,
  emptyText = '-',
  maxVisible = 3,
}) => {
  if (fields.length === 0) {
    return <>{emptyText}</>;
  }

  const visible = fields.slice(0, maxVisible);
  const overflow = fields.length - maxVisible;
  const overflowNames = fields
    .slice(maxVisible)
    .map((f) => f.label || f.name)
    .join(', ');

  return (
    <FieldsContainer>
      {visible.map((field, index) => (
        <Badge key={index} variant="primary" size="small">
          {field.label || field.name}
        </Badge>
      ))}
      {overflow > 0 && (
        <Tooltip title={overflowNames} arrow placement="top">
          <span>
            <Badge variant="default" size="small">
              +{overflow} more
            </Badge>
          </span>
        </Tooltip>
      )}
    </FieldsContainer>
  );
};
