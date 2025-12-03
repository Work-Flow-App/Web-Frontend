// Export old components for backward compatibility
export { Dropdown } from './Dropdown';
export { StandaloneDropdown } from './StandaloneDropdown';
export type { DropdownProps, DropdownOption as OldDropdownOption, DropdownSize } from './Dropdown.types';

// Export new universal dropdown (recommended)
export { UniversalDropdown } from './UniversalDropdown';
export { useAsyncDropdown } from './useAsyncDropdown';
export type {
  UniversalDropdownProps,
  DropdownOption,
  UseAsyncDropdownOptions,
  UseAsyncDropdownReturn,
} from './UniversalDropdown.types';

// Default export is the new universal dropdown
export { UniversalDropdown as default } from './UniversalDropdown';
