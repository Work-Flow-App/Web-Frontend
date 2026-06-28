import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { TextField, CircularProgress, FormHelperText, InputLabel } from '@mui/material';
import { useFormContext, useController, FormProvider } from 'react-hook-form';
import type { UniversalDropdownProps, DropdownOption } from './UniversalDropdown.types';
import * as S from './Dropdown.styles';

// Safe hook to get form context without throwing
const useSafeFormContext = () => {
  try {
    return useFormContext();
  } catch {
    return null;
  }
};

/**
 * Universal Dropdown Component
 * Works both standalone and with React Hook Form
 * Supports async data fetching, search, and all common use cases
 */
export const UniversalDropdown = <T = string | number,>(props: UniversalDropdownProps<T>) => {
  const {
    // Basic props
    name,
    id = name,
    label,
    placeholder = 'Select an option',
    helperText,
    size = 'medium',
    required = false,
    disabled = false,
    error: externalError,

    // Options props
    options: externalOptions = [],
    loading: externalLoading = false,

    // Value props
    value: externalValue,
    defaultValue,
    onChange,

    // Async props
    onSearch,
    searchDebounce = 300,

    // Features
    clearable = true,
    searchable = false,
    fullWidth = false,
    disablePortal = false,

    // Styling
    className,
    sx,

    // React Hook Form
    useFormIntegration = false,

    // Advanced
    getOptionLabel,
    getOptionValue,
    isOptionEqualToValue,
    renderOption,
    noOptionsText = 'No options available',
    loadingText = 'Loading...',

    // Callbacks
    onOpen,
    onClose,
    onBlur,
    onFocus,
  } = props;

  // Internal state
  const [internalValue, setInternalValue] = useState<DropdownOption<T> | null>(null);
  const [internalOptions, setInternalOptions] = useState<DropdownOption<T>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  // React Hook Form integration - safely get form context
  const formContext = useSafeFormContext();
  const hasFormContext = Boolean(formContext?.control);

  // Always call useController but only when we have both context and name
  // This satisfies rules of hooks while allowing dynamic form integration
  const controllerResult = (hasFormContext && name)
    ? useController({
        name: name!,
        control: formContext!.control,
        defaultValue: defaultValue as any,
      })
    : { field: undefined, fieldState: undefined };

  const { field, fieldState } = controllerResult;

  // Determine controlled vs uncontrolled
  const isControlled = externalValue !== undefined || field !== undefined;
  const currentValue = field?.value ?? externalValue ?? internalValue;

  // Determine error state
  const error = externalError ?? fieldState?.error;
  const hasError = !!error;

  // Convert external options to internal format
  useEffect(() => {
    if (Array.isArray(externalOptions)) {
      const formatted = externalOptions.map((opt) => {
        if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
          return opt as DropdownOption<T>;
        }
        return {
          label: String(opt),
          value: opt as T,
        };
      });
      setInternalOptions(formatted);
    }
  }, [externalOptions]);

  // Handle loading state
  useEffect(() => {
    setIsLoading(externalLoading);
  }, [externalLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Helper: Get option label
  const getLabel = useCallback(
    (option: DropdownOption<T> | null): string => {
      if (!option) return '';
      if (getOptionLabel) return getOptionLabel(option);
      return option.label;
    },
    [getOptionLabel]
  );

  // Helper: Get option value
  const getValue = useCallback(
    (option: DropdownOption<T>): T => {
      if (getOptionValue) return getOptionValue(option);
      return option.value;
    },
    [getOptionValue]
  );

  // Helper: Check if options are equal
  const areOptionsEqual = useCallback(
    (option: DropdownOption<T> | null, value: DropdownOption<T> | null): boolean => {
      if (!option || !value) return option === value;
      if (isOptionEqualToValue) return isOptionEqualToValue(option, value);
      return getValue(option) === getValue(value);
    },
    [getValue, isOptionEqualToValue]
  );

  // Handle change
  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: DropdownOption<T> | null) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (field) {
        field.onChange(newValue);
      }

      if (onChange) {
        onChange(newValue ? getValue(newValue) : null, newValue);
      }
    },
    [isControlled, field, onChange, getValue]
  );

  // Handle search with debounce
  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchValue(value);

      if (!onSearch) return;

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          onSearch(value);
        }
      }, searchDebounce);
    },
    [onSearch, searchDebounce]
  );

  // Handle open
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  // Handle close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchValue('');
    onClose?.();
  }, [onClose]);

  // Handle blur
  const handleBlur = useCallback(() => {
    field?.onBlur();
    onBlur?.();
  }, [field, onBlur]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue || onSearch) {
      return internalOptions;
    }

    const lowerSearch = searchValue.toLowerCase();
    return internalOptions.filter((option) =>
      getLabel(option).toLowerCase().includes(lowerSearch)
    );
  }, [internalOptions, searchValue, searchable, onSearch, getLabel]);

  // Custom no options text
  const noOptionsContent = useMemo(() => {
    if (isLoading) return loadingText;
    return noOptionsText;
  }, [isLoading, loadingText, noOptionsText]);

  // Build class name
  const classNames = [
    className,
    hasError && 'hasError',
    currentValue && 'hasValue',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <S.AutocompleteWrapper>
      {label && (
        <InputLabel required={required} error={hasError}>
          {label}
        </InputLabel>
      )}

      <S.AutocompleteInnerWrapper sx={sx}>
        <S.MuiAutocomplete
          id={id}
          open={isOpen}
          onOpen={handleOpen}
          onClose={handleClose}
          options={filteredOptions}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          loading={isLoading}
          disabled={disabled}
          disableClearable={!clearable}
          disablePortal={disablePortal}
          isOptionEqualToValue={areOptionsEqual}
          getOptionLabel={getLabel}
          noOptionsText={noOptionsContent}
          className={classNames}
          dropdownSize={size}
          fullWidth={fullWidth}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              error={hasError}
              onChange={searchable ? handleSearch : undefined}
              onFocus={onFocus}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && <CircularProgress size={16} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={
            renderOption
              ? (props, option, state) => renderOption(props, option, state)
              : (props, option) => {
                  const { key, ...otherProps } = props as any;
                  return (
                    <li {...otherProps} key={key || getValue(option)}>
                      <S.MuiListItemContent>{getLabel(option)}</S.MuiListItemContent>
                    </li>
                  );
                }
          }
          PopperComponent={(props) => (
            <S.CustomPopper {...props} className={`${props.className} custom-popper-class`} />
          )}
        />

        {hasError && error?.message && (
          <FormHelperText error>{error.message}</FormHelperText>
        )}

        {!hasError && helperText && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </S.AutocompleteInnerWrapper>
    </S.AutocompleteWrapper>
  );
};

UniversalDropdown.displayName = 'UniversalDropdown';

export default UniversalDropdown;
