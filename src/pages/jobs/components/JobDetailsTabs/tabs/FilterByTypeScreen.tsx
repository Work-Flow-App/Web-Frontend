import React, { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@mui/material';
import { useGlobalModalInnerContext } from '../../../../../components/UI/GlobalModal/context';
import { FILTER_TYPES } from './StepActivityTab.utils';
import * as SS from './StepActivityTab.styles';

interface FilterByTypeScreenProps {
  activeFilters: string[];
  onApply: (filters: string[]) => void;
  onClearAll: () => void;
}

export const FilterByTypeScreen: React.FC<FilterByTypeScreenProps> = ({
  activeFilters,
  onApply,
  onClearAll,
}) => {
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, updateOnClose } =
    useGlobalModalInnerContext();

  const [localFilters, setLocalFilters] = useState<string[]>(activeFilters);
  const localFiltersRef = useRef(localFilters);

  useEffect(() => {
    localFiltersRef.current = localFilters;
  }, [localFilters]);

  useEffect(() => {
    updateModalTitle('Filter by Type');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: 'Apply',
      cancelButtonText: 'Clear All',
    });
    updateOnConfirm(() => {
      onApply(localFiltersRef.current);
    });
    updateOnClose(() => {
      onClearAll();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (value: string) => {
    setLocalFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <>
      {FILTER_TYPES.map(({ value, label, dotColor }) => (
        <SS.FilterTypeRow key={value} onClick={() => toggle(value)}>
          <Checkbox
            checked={localFilters.includes(value)}
            onChange={() => toggle(value)}
            onClick={e => e.stopPropagation()}
            size="small"
            sx={{ p: 0 }}
          />
          <SS.FilterTypeDot dotColor={dotColor} />
          <SS.FilterTypeLabel>{label}</SS.FilterTypeLabel>
        </SS.FilterTypeRow>
      ))}
    </>
  );
};
