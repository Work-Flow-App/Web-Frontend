import type { ReactNode } from 'react';
import type { ButtonVariant, ButtonColor } from '../Button';
import type { DropdownOption } from '../Forms/Dropdown';

export interface PageAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
}

export interface PageWrapperProps {
  title: string | ReactNode;
  description?: string;
  children: ReactNode;
  actions?: PageAction[];
  dropdownOptions?: DropdownOption[];
  dropdownValue?: string | number;
  dropdownPlaceholder?: string;
  onDropdownChange?: (value: string | number) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
  headerExtra?: ReactNode;
  maxWidth?: string | number;
}

export interface PageWrapperContextValue {
  title: string;
  description?: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addAction: (action: PageAction) => void;
  removeAction: (label: string) => void;
  clearActions: () => void;
  setHeaderExtra: (extra: ReactNode) => void;
}
