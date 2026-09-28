import React, { useState, useEffect } from 'react';
import { Divider } from '@mui/material';
import { StandaloneDropdown } from '../../../../components/UI/Forms/Dropdown';
import type { DropdownOption } from '../../../../components/UI/Forms/Dropdown';
import { Button } from '../../../../components/UI/Button';
import {
  FilterPopover,
  PanelContainer,
  PanelHeader,
  PanelTitle,
  PanelBody,
  PanelFooter,
  FilterRowWrapper,
  FilterLabel,
} from './AssetFilterPanel.styles';

const toOption = (options: DropdownOption[], value?: string | number): DropdownOption | '' =>
  (value !== undefined && value !== '' ? options.find((o) => o.value === value) : undefined) ?? '';

export interface AssetFilterState {
  status: string;
  group: number | '';
}

interface AssetFilterPanelProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  currentFilters: AssetFilterState;
  groupOptions: DropdownOption[];
  statusOptions: DropdownOption[];
  onApply: (filters: AssetFilterState) => void;
  onReset: () => void;
}

export const AssetFilterPanel: React.FC<AssetFilterPanelProps> = ({
  anchorEl,
  onClose,
  currentFilters,
  groupOptions,
  statusOptions,
  onApply,
  onReset,
}) => {
  const [draft, setDraft] = useState<AssetFilterState>(currentFilters);
  const [dropdownKey, setDropdownKey] = useState(0);

  useEffect(() => {
    if (anchorEl) {
      setDraft(currentFilters);
      setDropdownKey((k) => k + 1);
    }
  }, [anchorEl]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = (value: string | number) => {
    setDraft((prev) => ({ ...prev, status: (value as string) || 'all' }));
  };

  const handleGroupChange = (value: string | number) => {
    setDraft((prev) => ({ ...prev, group: (value as number | '') || '' }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    onReset();
    setDraft({ status: 'all', group: '' });
    setDropdownKey((k) => k + 1);
    onClose();
  };

  return (
    <FilterPopover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <PanelContainer>
        <PanelHeader>
          <PanelTitle variant="subtitle2">Filter Assets</PanelTitle>
        </PanelHeader>

        <Divider />

        <PanelBody>
          <FilterRow label="Group">
            <StandaloneDropdown
              key={`group-${dropdownKey}`}
              name="filter-asset-group"
              placeHolder="All Groups"
              preFetchedOptions={groupOptions}
              defaultValue={toOption(groupOptions, draft.group) as unknown as string}
              onChange={handleGroupChange}
              disableClearable
              hideErrorMessage
              fullWidth
            />
          </FilterRow>

          <FilterRow label="Status">
            <StandaloneDropdown
              key={`status-${dropdownKey}`}
              name="filter-asset-status"
              placeHolder="All Statuses"
              preFetchedOptions={statusOptions}
              defaultValue={toOption(statusOptions, draft.status) as unknown as string}
              onChange={handleStatusChange}
              disableClearable
              hideErrorMessage
              fullWidth
            />
          </FilterRow>
        </PanelBody>

        <Divider />

        <PanelFooter>
          <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
            Reset all
          </Button>
          <Button variant="contained" color="primary" size="small" onClick={handleApply}>
            Apply filters
          </Button>
        </PanelFooter>
      </PanelContainer>
    </FilterPopover>
  );
};

const FilterRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <FilterRowWrapper>
    <FilterLabel variant="caption" color="text.secondary">
      {label}
    </FilterLabel>
    {children}
  </FilterRowWrapper>
);
