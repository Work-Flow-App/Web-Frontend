import React, { useState, useEffect } from 'react';
import { Divider, ToggleButton } from '@mui/material';
import { StandaloneDropdown } from '../../../../components/UI/Forms/Dropdown';
import type { DropdownOption } from '../../../../components/UI/Forms/Dropdown';
import type { JobFilters } from '../../../../services/api';
import { Button } from '../../../../components/UI/Button';
import {
  FilterPopover,
  PanelContainer,
  PanelHeader,
  PanelTitle,
  PanelBody,
  ViewToggleGroup,
  FilterSection,
  PanelFooter,
  FilterRowWrapper,
  FilterLabel,
} from './JobFilterPanel.styles';

const STATUS_OPTIONS: DropdownOption[] = [
  { label: 'New', value: 'NEW' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

// StandaloneDropdown initialises its internal state from defaultValue on mount.
// We pass a full DropdownOption object (cast to string to satisfy the typed prop) so
// MUI Autocomplete can resolve getOptionLabel and isOptionEqualToValue correctly.
const toOption = (options: DropdownOption[], value?: string): DropdownOption | '' =>
  (value ? options.find((o) => o.value === value) : undefined) ?? '';

interface JobFilterPanelProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  showArchived: boolean;
  onToggleArchived: (archived: boolean) => void;
  currentFilters: JobFilters;
  onApply: (filters: JobFilters) => void;
  templateOptions: DropdownOption[];
  customerOptions: DropdownOption[];
  clientOptions: DropdownOption[];
  workflowOptions: DropdownOption[];
}

export const JobFilterPanel: React.FC<JobFilterPanelProps> = ({
  anchorEl,
  onClose,
  showArchived,
  onToggleArchived,
  currentFilters,
  onApply,
  templateOptions,
  customerOptions,
  clientOptions,
  workflowOptions,
}) => {
  const [draft, setDraft] = useState<JobFilters>(currentFilters);
  // Incremented only when we want to force-remount the dropdowns (panel open /
  // reset / view toggle) — NOT on every selection, which was causing the remount
  // that wiped the visual selection immediately after the user picked an option.
  const [dropdownKey, setDropdownKey] = useState(0);

  useEffect(() => {
    if (anchorEl) {
      setDraft(currentFilters);
      setDropdownKey((k) => k + 1);
    }
  }, [anchorEl]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: keyof JobFilters) => (v: string | number) =>
    setDraft((prev) => ({ ...prev, [key]: (v as string) || undefined }));

  const handleViewToggle = (_: React.MouseEvent, value: 'active' | 'archived' | null) => {
    if (!value) return;
    const archived = value === 'archived';
    if (archived) {
      setDraft({});
      setDropdownKey((k) => k + 1);
      onApply({});
    }
    onToggleArchived(archived);
  };

  const handleApply = () => {
    const cleaned = Object.fromEntries(
      Object.entries(draft).filter(([, v]) => v !== undefined && v !== '' && v !== null)
    ) as JobFilters;
    onApply(cleaned);
    onClose();
  };

  const handleClear = () => {
    setDraft({});
    setDropdownKey((k) => k + 1);
    onApply({});
    onToggleArchived(false);
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
          <PanelTitle variant="subtitle2">View & Filter</PanelTitle>
        </PanelHeader>

        <Divider />

        <PanelBody>
          <FilterRow label="View">
            <ViewToggleGroup
              value={showArchived ? 'archived' : 'active'}
              exclusive
              onChange={handleViewToggle}
              size="small"
              fullWidth
            >
              <ToggleButton value="active">Active</ToggleButton>
              <ToggleButton value="archived">Archived</ToggleButton>
            </ViewToggleGroup>
          </FilterRow>

          <FilterSection $disabled={showArchived}>
            <FilterRow label="Status">
              <StandaloneDropdown
                key={`status-${dropdownKey}`}
                name="filter-status"
                placeHolder="Any status"
                preFetchedOptions={STATUS_OPTIONS}
                defaultValue={toOption(STATUS_OPTIONS, draft.status) as unknown as string}
                onChange={set('status')}
                hideErrorMessage
                fullWidth
              />
            </FilterRow>

            {templateOptions.length > 0 && (
              <FilterRow label="Template">
                <StandaloneDropdown
                  key={`template-${dropdownKey}`}
                  name="filter-template"
                  placeHolder="Any template"
                  preFetchedOptions={templateOptions}
                  defaultValue={toOption(templateOptions, draft.templateName) as unknown as string}
                  onChange={set('templateName')}
                  hideErrorMessage
                  fullWidth
                />
              </FilterRow>
            )}

            {customerOptions.length > 0 && (
              <FilterRow label="Customer">
                <StandaloneDropdown
                  key={`customer-${dropdownKey}`}
                  name="filter-customer"
                  placeHolder="Any customer"
                  preFetchedOptions={customerOptions}
                  defaultValue={toOption(customerOptions, draft.customerName) as unknown as string}
                  onChange={set('customerName')}
                  hideErrorMessage
                  fullWidth
                />
              </FilterRow>
            )}

            {clientOptions.length > 0 && (
              <FilterRow label="Client">
                <StandaloneDropdown
                  key={`client-${dropdownKey}`}
                  name="filter-client"
                  placeHolder="Any client"
                  preFetchedOptions={clientOptions}
                  defaultValue={toOption(clientOptions, draft.clientName) as unknown as string}
                  onChange={set('clientName')}
                  hideErrorMessage
                  fullWidth
                />
              </FilterRow>
            )}

            {workflowOptions.length > 0 && (
              <FilterRow label="Workflow">
                <StandaloneDropdown
                  key={`workflow-${dropdownKey}`}
                  name="filter-workflow"
                  placeHolder="Any workflow"
                  preFetchedOptions={workflowOptions}
                  defaultValue={toOption(workflowOptions, draft.workflowName) as unknown as string}
                  onChange={set('workflowName')}
                  hideErrorMessage
                  fullWidth
                />
              </FilterRow>
            )}
          </FilterSection>
        </PanelBody>

        <Divider />

        <PanelFooter>
          <Button variant="outlined" color="secondary" size="small" onClick={handleClear}>
            Reset all
          </Button>
          <Button variant="contained" color="primary" size="small" onClick={handleApply} disabled={showArchived}>
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
