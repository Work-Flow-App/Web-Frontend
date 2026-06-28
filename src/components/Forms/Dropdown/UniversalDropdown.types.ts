import type { ReactNode } from 'react';
import type { SxProps, Theme, AutocompleteRenderOptionState } from '@mui/material';
import type { FieldError } from 'react-hook-form';

export type DropdownSize = 'small' | 'medium' | 'full';

/**
 * Dropdown option interface
 */
export interface DropdownOption<T = string | number> {
  /**
   * The value of the option
   */
  value: T;

  /**
   * The display label of the option
   */
  label: string;

  /**
   * Whether the option is disabled
   */
  disabled?: boolean;

  /**
   * Any additional custom data
   */
  [key: string]: any;
}

/**
 * Universal Dropdown Props
 * Works both standalone and with React Hook Form
 */
export interface UniversalDropdownProps<T = string | number> {
  // ============ BASIC PROPS ============

  /**
   * Name of the field (required for form integration)
   */
  name?: string;

  /**
   * ID attribute for the dropdown
   */
  id?: string;

  /**
   * Label displayed above the dropdown
   */
  label?: string;

  /**
   * Placeholder text when no value is selected
   * @default 'Select an option'
   */
  placeholder?: string;

  /**
   * Helper text displayed below the dropdown
   */
  helperText?: string;

  /**
   * Size of the dropdown
   * @default 'medium'
   */
  size?: DropdownSize;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Error object (can be from react-hook-form or custom)
   */
  error?: FieldError | { message?: string };

  // ============ OPTIONS PROPS ============

  /**
   * Array of options to display
   * Can be an array of DropdownOption objects or primitive values
   */
  options?: Array<DropdownOption<T> | T>;

  /**
   * Whether options are currently loading
   * @default false
   */
  loading?: boolean;

  // ============ VALUE PROPS ============

  /**
   * Controlled value
   */
  value?: DropdownOption<T> | null;

  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: DropdownOption<T> | null;

  /**
   * Callback when value changes
   * @param value - The selected value (primitive type)
   * @param option - The full option object
   */
  onChange?: (value: T | null, option: DropdownOption<T> | null) => void;

  // ============ ASYNC / SEARCH PROPS ============

  /**
   * Callback when user types in search field
   * Use this to fetch data from server
   * @param searchTerm - The search string
   */
  onSearch?: (searchTerm: string) => void;

  /**
   * Debounce delay for search in milliseconds
   * @default 300
   */
  searchDebounce?: number;

  // ============ FEATURES ============

  /**
   * Whether the value can be cleared
   * @default true
   */
  clearable?: boolean;

  /**
   * Enable client-side search/filtering
   * @default false
   */
  searchable?: boolean;

  /**
   * Whether dropdown takes full width of container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Disable portal rendering (render in place)
   * @default false
   */
  disablePortal?: boolean;

  // ============ STYLING ============

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * MUI sx prop for custom styling
   */
  sx?: SxProps<Theme>;

  // ============ REACT HOOK FORM ============

  /**
   * Enable React Hook Form integration
   * Set to true to use with useForm()
   * @default false
   */
  useFormIntegration?: boolean;

  // ============ ADVANCED CUSTOMIZATION ============

  /**
   * Custom function to get option label
   */
  getOptionLabel?: (option: DropdownOption<T>) => string;

  /**
   * Custom function to get option value
   */
  getOptionValue?: (option: DropdownOption<T>) => T;

  /**
   * Custom function to determine if two options are equal
   */
  isOptionEqualToValue?: (
    option: DropdownOption<T>,
    value: DropdownOption<T>
  ) => boolean;

  /**
   * Custom render function for options
   */
  renderOption?: (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: DropdownOption<T>,
    state: AutocompleteRenderOptionState
  ) => ReactNode;

  /**
   * Text to display when no options are available
   * @default 'No options available'
   */
  noOptionsText?: string;

  /**
   * Text to display while loading
   * @default 'Loading...'
   */
  loadingText?: string;

  // ============ CALLBACKS ============

  /**
   * Callback when dropdown opens
   */
  onOpen?: () => void;

  /**
   * Callback when dropdown closes
   */
  onClose?: () => void;

  /**
   * Callback when dropdown loses focus
   */
  onBlur?: () => void;

  /**
   * Callback when dropdown gains focus
   */
  onFocus?: () => void;
}

/**
 * Hook for async data fetching
 */
export interface UseAsyncDropdownOptions<T = any> {
  /**
   * Function to fetch data
   */
  fetchFn: (searchTerm?: string) => Promise<T[]>;

  /**
   * Function to transform API response to DropdownOption[]
   */
  transformFn?: (data: T[]) => DropdownOption[];

  /**
   * Initial options
   */
  initialOptions?: DropdownOption[];

  /**
   * Whether to fetch on mount
   * @default false
   */
  fetchOnMount?: boolean;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounce?: number;
}

export interface UseAsyncDropdownReturn {
  /**
   * Options to pass to UniversalDropdown
   */
  options: DropdownOption[];

  /**
   * Loading state to pass to UniversalDropdown
   */
  loading: boolean;

  /**
   * Search handler to pass to UniversalDropdown
   */
  onSearch: (searchTerm: string) => void;

  /**
   * Error state if fetch fails
   */
  error: Error | null;

  /**
   * Manual refetch function
   */
  refetch: () => void;
}
