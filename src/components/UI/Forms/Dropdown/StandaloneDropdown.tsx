import React, { useEffect, useState, useRef, memo, useCallback } from 'react';
import { TextField, CircularProgress, FormHelperText, InputLabel } from '@mui/material';
import type { DropdownProps, DropdownOption } from './Dropdown.types';
import * as S from './Dropdown.styles';

// Helper function to add scrollbar classes
const addScrollbarClasses = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    el.classList.add('custom-scrollbar');
  });
};

// Debounce hook implementation
const useDebouncedCallback = <T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

/**
 * Standalone Dropdown component (does NOT use React Hook Form)
 * Use this component when the dropdown is NOT inside a form
 */
export const StandaloneDropdown = memo((props: DropdownProps) => {
  // Destructure Props
  const {
    apiHook,
    id,
    placeHolder = 'Select an option',
    name = 'standalone',
    isAsync = false,
    preFetchedOptions = [],
    getQueryParams,
    setFetchedOption,
    onValueChange,
    withRequiredBorder = false,
    isPreFetchLoading = false,
    isDisabled = false,
    disabled = false,
    disableClearable = false,
    defaultValue,
    isOptionEqualToValue = true,
    getLiveData = false,
    onChange,
    disablePortal,
    error,
    addNewConfig,
    size = 'medium',
    label,
    helperText,
    required = false,
    hideErrorMessage = false,
    fullWidth = false,
    className,
    sx,
    value: controlledValue,
  } = props;

  // Component States
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [inputFieldValue, setInputFieldValue] = useState<string>('');
  const [internalValue, setInternalValue] = useState<DropdownOption | null>(
    controlledValue || defaultValue || null
  );
  const parentRef = useRef<HTMLDivElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const fieldValue = controlledValue !== undefined ? controlledValue : internalValue;

  // Local Variables
  const isValueFetchableOnPress = apiHook && isAsync;

  // Side Effects
  useEffect(() => {
    if (apiHook && !isAsync && setFetchedOption && !getLiveData) {
      let qParam: Record<string, unknown> | undefined;
      setLoading(true);

      if (getQueryParams) {
        qParam = getQueryParams();
      }

      apiHook.callAsyncApi(qParam).then((res) => {
        if (res?.data) {
          setOptions([...setFetchedOption(res.data, name)]);
        } else {
          setOptions([]);
        }
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (!apiHook) {
      setLoading(!!isPreFetchLoading);
    }
  }, [isPreFetchLoading, apiHook]);

  useEffect(() => {
    if (!apiHook) {
      if (setFetchedOption) {
        setOptions([...setFetchedOption(preFetchedOptions, name)]);
      } else {
        setOptions([...(preFetchedOptions as DropdownOption[])]);
      }
    }
  }, [preFetchedOptions?.length, apiHook, setFetchedOption, name]);

  useEffect(() => {
    const isError = !!error;
    setHasError(isError);
  }, [error]);

  useEffect(() => {
    setHasValue(!!fieldValue);
  }, [fieldValue]);

  useEffect(() => {
    if (apiHook && isAsync && setFetchedOption && !apiHook.isLoading && apiHook.isSuccess) {
      if (!Array.isArray(apiHook?.data) && !Array.isArray((apiHook?.data as { list?: unknown[] })?.list)) {
        setOptions([]);
      } else {
        setOptions([...setFetchedOption(apiHook?.data, name)]);
      }

      setLoading(false);
    }
  }, [apiHook?.isLoading, apiHook?.isSuccess, apiHook?.data, setFetchedOption, name, isAsync]);

  useEffect(() => {
    if (apiHook && isAsync && setFetchedOption && !apiHook.isLoading && apiHook.isError) {
      setOptions([]);
      setLoading(false);
    }
  }, [apiHook?.isLoading, apiHook?.isError, setFetchedOption, isAsync]);

  useEffect(() => {
    addScrollbarClasses('.MuiAutocomplete-listbox');
  }, []);

  const fetchOptions = useCallback(() => {
    if (!apiHook && !isAsync && preFetchedOptions) {
      if (setFetchedOption) {
        setOptions([...setFetchedOption(preFetchedOptions, name)]);
      } else {
        setOptions([...(preFetchedOptions as DropdownOption[])]);
      }
    } else if (apiHook && !isAsync && setFetchedOption && getLiveData) {
      let qParam: Record<string, unknown> | undefined;
      setLoading(true);

      if (getQueryParams) {
        qParam = getQueryParams();
      }

      apiHook.callAsyncApi(qParam).then((res) => {
        if (res?.data) {
          setOptions([...setFetchedOption(res.data, name)]);
        } else {
          setOptions([]);
        }
        setLoading(false);
      });
    } else if (apiHook && isAsync && setFetchedOption) {
      let qParam: Record<string, unknown> | undefined;
      setLoading(true);

      if (getQueryParams && addNewConfig) {
        qParam = getQueryParams('');
      }

      if (qParam) {
        apiHook.callAsyncApi(qParam).then((res) => {
          if (res?.data) {
            setOptions([...setFetchedOption(res.data, name)]);
          } else {
            setOptions([]);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [apiHook, isAsync, preFetchedOptions, setFetchedOption, getLiveData, getQueryParams, addNewConfig, name]);

  const handleOnKeyUp = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputFieldValue = (event.target as HTMLInputElement).value;
    setInputFieldValue(inputFieldValue);
    if (isValueFetchableOnPress) {
      if (inputFieldValue) {
        setLoading(true);
        const qParam = getQueryParams?.(inputFieldValue);
        if (qParam && apiHook) {
          apiHook.callApi(qParam);
        }
      } else {
        setOptions([]);
        setLoading(false);
      }
    }
  }, [isValueFetchableOnPress, getQueryParams, apiHook]);

  const handleKeyUpWithDebounce = useDebouncedCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    handleOnKeyUp(e);
  }, 300);

  const clearOptions = useCallback(() => {
    if (isValueFetchableOnPress || !apiHook || getLiveData) {
      setOptions([]);
    }
  }, [isValueFetchableOnPress, apiHook, getLiveData]);

  const handleChange = useCallback((_event: React.SyntheticEvent, data: unknown) => {
    const dropdownData = data as DropdownOption | null;

    // Update internal value if not controlled
    if (controlledValue === undefined) {
      setInternalValue(dropdownData);
    }

    // Call external onChange handlers
    if (dropdownData?.value !== undefined && dropdownData?.value !== null) {
      onChange?.(dropdownData.value);
      onValueChange?.(dropdownData.value, undefined, name);
    }
    parentRef?.current?.focus();
  }, [controlledValue, onChange, onValueChange, name]);

  const handleIsOptionEqualToValue = useCallback((option: unknown, selectedOption: unknown): boolean => {
    if (!isOptionEqualToValue) return true;
    const opt = option as DropdownOption;
    const selected = selectedOption as DropdownOption;
    return opt.value === selected.value;
  }, [isOptionEqualToValue]);

  const handleAddButtonClick = useCallback(() => {
    if (parentRef.current) {
      const input = parentRef.current.querySelector('input');
      if (input) {
        input.blur();
      }
    }
    addNewConfig?.onAddNew?.(inputFieldValue, name, undefined);
  }, [inputFieldValue, name, addNewConfig]);

  const classNameString = `${className || ''} ${withRequiredBorder ? 'withRequiredBorder' : ''} ${
    hasValue ? 'hasValue' : ''
  } ${hasError ? 'hasError' : ''} ${
    (inputFieldValue === '' || inputFieldValue === null) && isValueFetchableOnPress && !isLoading
      ? 'hideOptionWrapper'
      : ''
  }`.trim();

  const customNoOptionsText = (
    <>
      <S.NoDataText>No Data Available</S.NoDataText>
      {addNewConfig?.enabled && (
        <S.AddNewButtonWrapper onClick={handleAddButtonClick}>
          {addNewConfig.buttonText || `Add new ${placeHolder?.toLowerCase() || 'item'}`}
        </S.AddNewButtonWrapper>
      )}
    </>
  );

  const errorMessage = error?.message || helperText;

  return (
    <S.AutocompleteWrapper>
      {label && (
        <InputLabel required={required} error={hasError}>
          {label}
        </InputLabel>
      )}
      <S.AutocompleteInnerWrapper ref={parentRef} tabIndex={-1} className="myDropdown" sx={sx}>
        <S.MuiAutocomplete
          disablePortal={disablePortal}
          id={id}
          options={options}
          onOpen={fetchOptions}
          onClose={clearOptions}
          className={classNameString}
          loading={isLoading}
          dropdownSize={size}
          fullWidth={fullWidth}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeHolder}
              error={hasError}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress size={12} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                autoComplete: 'new-password',
              }}
              onKeyUp={handleKeyUpWithDebounce}
              autoComplete="off"
            />
          )}
          PopperComponent={(props) => <S.CustomPopper {...props} className={`${props.className} custom-popper-class`} />}
          renderOption={(props, option, state) => {
            const dropdownOption = option as DropdownOption;
            const { key, ...otherProps } = props as any;
            return (
              <li {...otherProps} key={key || `${name}-${dropdownOption.value}-${state?.index}`}>
                <S.MuiListItemContent>{dropdownOption.label}</S.MuiListItemContent>
              </li>
            );
          }}
          noOptionsText={customNoOptionsText}
          value={fieldValue}
          onChange={handleChange}
          isOptionEqualToValue={handleIsOptionEqualToValue}
          disabled={isDisabled || disabled || (!isAsync && isLoading)}
          disableClearable={disableClearable}
          getOptionLabel={(option: unknown) => (option as DropdownOption)?.label || ''}
        />
        {!hideErrorMessage && errorMessage && (
          <FormHelperText error={hasError}>{errorMessage}</FormHelperText>
        )}
      </S.AutocompleteInnerWrapper>
    </S.AutocompleteWrapper>
  );
});

StandaloneDropdown.displayName = 'StandaloneDropdown';

export default StandaloneDropdown;
