import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { StyledSearchInput, StyledSearchInputDark, SearchInputWrapper, SearchIcon as SearchIconWrapper } from './SearchInput.styles';
import type { SearchInputProps } from './SearchInput.types';

/**
 * SearchInput Component
 *
 * A styled search input field with accessibility support and keyboard handling.
 * Supports Enter key to trigger search callback and variant styling (light/dark).
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 *
 * // Light variant (default)
 * <SearchInput
 *   placeholder="Search..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onSearch={(query) => console.log('Search:', query)}
 *   aria-label="Search products"
 * />
 *
 * // Dark variant (for dark backgrounds)
 * <SearchInput
 *   variant="dark"
 *   placeholder="Search..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 * />
 * ```
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = 'Search',
      value,
      onChange,
      onSearch,
      'aria-label': ariaLabel = 'Search',
      className,
      variant = 'light',
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        const target = e.target as HTMLInputElement;
        onSearch(target.value);
      }
      props.onKeyDown?.(e);
    };

    const StyledInput = variant === 'dark' ? StyledSearchInputDark : StyledSearchInput;

    return (
      <SearchInputWrapper>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInput
          ref={ref}
          type="search"
          role="combobox"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          aria-label={ariaLabel}
          maxLength={256}
          className={className}
          {...props}
        />
      </SearchInputWrapper>
    );
  }
);

SearchInput.displayName = 'SearchInput';
