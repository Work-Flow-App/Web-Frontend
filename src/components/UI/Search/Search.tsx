import { memo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '../Forms/Input';
import type { SearchProps } from './Search.types';
import * as S from './Search.styles';

const SearchIconSvg = ({ isFocused }: { isFocused: boolean }) => (
  <S.SearchIcon
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: isFocused ? 'none' : 'block' }}
  >
    <path
      d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
      stroke="#D4D4D4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </S.SearchIcon>
);

export const Search = memo(
  ({
    placeholder = 'Search',
    value,
    onChange,
    onSearch,
    disabled = false,
    width,
    className,
    styles,
  }: SearchProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const methods = useForm({
      defaultValues: {
        search: value || '',
      },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && onSearch) {
        const searchValue = methods.getValues('search');
        onSearch(searchValue);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <FormProvider {...methods}>
        <S.SearchContainer width={width} className={className}>
          <Input
            name="search"
            placeholder={placeholder}
            disabled={disabled}
            hideErrorMessage
            fullWidth
            startAdornment={<SearchIconSvg isFocused={isFocused} />}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            styles={styles}
          />
        </S.SearchContainer>
      </FormProvider>
    );
  }
);

Search.displayName = 'Search';
