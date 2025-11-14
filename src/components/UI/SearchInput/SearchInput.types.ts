import { InputHTMLAttributes } from 'react';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Placeholder text for the search input
   */
  placeholder?: string;

  /**
   * Current value of the search input
   */
  value?: string;

  /**
   * Callback function when input value changes
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Callback function when search is submitted (Enter key)
   */
  onSearch?: (query: string) => void;

  /**
   * Aria label for accessibility
   */
  'aria-label'?: string;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Variant style of the search input
   * @default 'light'
   */
  variant?: 'light' | 'dark';
}
