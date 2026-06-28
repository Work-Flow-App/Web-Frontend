import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';
import type { FieldError } from 'react-hook-form';

export type DropdownSize = 'small' | 'medium' | 'full';

export interface DropdownOption {
  /**
   * Option value
   */
  value: string | number;

  /**
   * Option label to display
   */
  label: string;

  /**
   * If true, the option will be disabled
   */
  disabled?: boolean;
}

export interface IReadOnlyBox {
  /**
   * The name of the readonly box
   */
  name: string;

  /**
   * The size of the readonly box
   */
  size?: number;

  /**
   * The value of the readonly box
   */
  value?: string;

  /**
   * The placeholder value of the box
   */
  placeHolder?: string;
}

export interface IAddNewConfig {
  /**
   * Whether the add new feature is enabled
   */
  enabled?: boolean;

  /**
   * Custom button text for add new
   */
  buttonText?: string;

  /**
   * Modal component to render when add new is clicked
   */
  modalComponent?: ReactNode;

  /**
   * Modal size
   */
  modalSize?: 'small' | 'medium' | 'large';

  /**
   * Additional modal data
   */
  modalData?: Record<string, unknown>;

  /**
   * Callback when add new is clicked
   */
  onAddNew?: (inputValue: string, name?: string, dependentFields?: string[]) => void;

  /**
   * Callback when refresh is needed
   */
  onRefresh?: () => void;

  /**
   * Additional callbacks
   */
  callBacks?: Record<string, (...args: unknown[]) => void>;
}

export interface IApiHook<T = unknown> {
  /**
   * Call API method
   */
  callApi: (params?: Record<string, unknown>) => void;

  /**
   * Call async API method
   */
  callAsyncApi: (params?: Record<string, unknown>) => Promise<{ data?: T }>;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Success state
   */
  isSuccess?: boolean;

  /**
   * Error state
   */
  isError?: boolean;

  /**
   * API response data
   */
  data?: T;
}

export interface DropdownProps {
  /**
   * The id of the dropdown
   */
  id?: string;

  /**
   * The name of the dropdown (required for form integration)
   */
  name: string;

  /**
   * Placeholder text when no value is selected
   * @default 'Select an option'
   */
  placeHolder?: string;

  /**
   * Dropdown size based on Figma specs
   * small: 426px width
   * medium: fit content
   * full: 922px width
   * @default 'medium'
   */
  size?: DropdownSize;

  /**
   * Prefetched options. This is the sync/client option rendering method
   * Required if isAsync is false
   */
  preFetchedOptions?: DropdownOption[];

  /**
   * Whether to fetch the options from the backend
   * @default false
   */
  isAsync?: boolean;

  /**
   * API hook which will be called to fetch options from the backend
   * Required if isAsync is true
   */
  apiHook?: IApiHook;

  /**
   * If the apiHook needs to be called every time from the component
   * @default false
   */
  getLiveData?: boolean;

  /**
   * The query param callback if required to send with the apiHook
   */
  getQueryParams?: (dependencyValue?: unknown, keyword?: string) => Record<string, unknown>;

  /**
   * Callback to map the returned response from the backend into DropdownOption array
   * Required if apiHook is provided
   */
  setFetchedOption?: (data: unknown, name?: string) => DropdownOption[];

  /**
   * Whether the prefetched data is loading or not
   * @default false
   */
  isPreFetchLoading?: boolean;

  /**
   * If true, the dropdown will be disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * If true, the dropdown will be disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * If true, shows error state
   * @default false
   */
  error?: FieldError;

  /**
   * Helper text to display below the dropdown
   */
  helperText?: string;

  /**
   * Label for the dropdown
   */
  label?: string;

  /**
   * If true, the dropdown will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom styles using MUI sx prop
   */
  sx?: SxProps<Theme>;

  /**
   * If true, the field is required
   * @default false
   */
  required?: boolean;

  /**
   * This defines if the border is required or not for required field
   * @default false
   */
  withRequiredBorder?: boolean;

  /**
   * The value of the readonly box on the right side
   */
  readOnlyBox?: IReadOnlyBox;

  /**
   * Callback to dynamically update the options based on other input values
   */
  dynamicOptionCallback?: (itemValue: unknown) => DropdownOption[];

  /**
   * To be able to access the selected value from the parent component
   */
  onValueChange?: (value: string | number, dependentFields?: string[], name?: string) => void;

  /**
   * Callback for Change event
   */
  onChange?: (value: string | number, dependentFields?: string[]) => void;

  /**
   * The name of the parent field
   * If this field gets empty then the field will be emptied as well
   */
  dependency?: string;

  /**
   * The name list of the child fields
   * This will be only used in GridForm
   */
  dependentFields?: string[];

  /**
   * Defines if the dropdown value can be cleared or not
   * @default false
   */
  disableClearable?: boolean;

  /**
   * Default value for the dropdown
   */
  defaultValue?: string | number;

  /**
   * Current value of the dropdown
   */
  value?: string | number;

  /**
   * Whether to hide the error message or not
   * @default false
   */
  hideErrorMessage?: boolean;

  /**
   * Whether the option is equal to value or not
   * @default true
   */
  isOptionEqualToValue?: boolean;

  /**
   * Whether to render the option list outside of parent scope
   * @default false
   */
  disablePortal?: boolean;

  /**
   * Whether to skip the resetting the default value
   * @default false
   */
  skipDefaultReset?: boolean;

  /**
   * Whether to show the tooltip or not
   * @default false
   */
  showTooltip?: boolean;

  /**
   * Configuration for adding new items to the dropdown
   */
  addNewConfig?: IAddNewConfig;

  /**
   * Whether to allow multiple selections
   * @default false
   */
  multiple?: boolean;
}
