import React from 'react';
import { Badge } from '../../../../components/UI/Badge';
import type { BadgeVariant } from '../../../../components/UI/Badge/Badge.types';
import type { AssetTableRow } from './DataColumn';

interface StatusBadgeProps {
  status: AssetTableRow['status'];
}

/**
 * Status badge component for assets
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusVariant = (): BadgeVariant => {
    switch (status) {
      case 'available':
        return 'success';
      case 'in-use':
        return 'error';
      case 'archived':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in-use':
        return 'In Use';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getStatusVariant()} size="small">
      {getStatusLabel()}
    </Badge>
  );
};
