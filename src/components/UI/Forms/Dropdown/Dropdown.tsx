import React, { useEffect, useState, useRef, memo, useCallback } from 'react';
import { TextField, CircularProgress, FormHelperText, InputLabel } from '@mui/material';
import type { DropdownProps, DropdownOption } from './Dropdown.types';
import * as S from './Dropdown.styles';
import { useFormContext, useController, useWatch } from 'react-hook-form';

// Helper function to add scrollbar classes (can be replaced with actual implementation)
const addScrollbarClasses = (selector: string) => {
  // Implementation for adding scrollbar classes
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    el.classList.add('custom-scrollbar');
  });
};

// Debounce hook implementation
const useDebouncedCallback = <T extends (...args: any[]) => void>(
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
 * Reusable Dropdown component based on Floow design system
 * Supports React Hook Form, async data fetching, dependencies, and more
 */
export const BaseDropdown = memo((props: DropdownProps) => {
  // Destructure Props
  const {
    apiHook,
    id,
    placeHolder = 'Select an option',
    name,
    isAsync = false,
    preFetchedOptions = [],
    getQueryParams,
    readOnlyBox,
    setFetchedOption,
    onValueChange,
    withRequiredBorder = false,
    isPreFetchLoading = false,
    isDisabled = false,
    disabled = false,
    dependency,
    dependentFields,
    disableClearable = false,
    dynamicOptionCallback,
    defaultValue,
    isOptionEqualToValue = true,
    getLiveData = false,
    onChange,
    disablePortal = false,
    error,
    skipDefaultReset = false,
    addNewConfig,
    size = 'medium',
    label,
    helperText,
    required = false,
    hideErrorMessage = false,
    fullWidth = false,
    className,
    sx,
  } = props;

  // Component States
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [inputFieldValue, setInputFieldValue] = useState<string>('');
  const [prevParentCache, setParentCache] = useState<DropdownOption | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // React Hook Form
  const methods = useFormContext?.() || {};
  const { control, setValue, resetField, clearErrors } = methods;

  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  const fieldValue = useWatch({ name, control });
  const dependencyValueRaw = methods.watch?.(dependency || `${name}-dependency`);
  const dependencyValue =
    dependencyValueRaw && !dependencyValueRaw?.value
      ? { label: dependencyValueRaw, value: dependencyValueRaw }
      : dependencyValueRaw;

  // Local Variables
  const isValueFetchableOnPress = apiHook && isAsync;

  // Side Effects
  useEffect(() => {
    if (apiHook && !isAsync && setFetchedOption && !getLiveData && !dependency) {
      let qParam = null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!apiHook) {
      setLoading(!!isPreFetchLoading);
    }
  }, [isPreFetchLoading]);

  useEffect(() => {
    if (!apiHook) {
      if (setFetchedOption) {
        setOptions([...setFetchedOption(preFetchedOptions, name)]);
      } else {
        setOptions([...(preFetchedOptions as DropdownOption[])]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preFetchedOptions?.length, apiHook]);

  useEffect(() => {
    if (!skipDefaultReset && resetField) {
      resetField(name, { defaultValue });
    }
  }, [defaultValue, skipDefaultReset, resetField, name]);

  useEffect(() => {
    if (dependency && prevParentCache && prevParentCache?.value !== dependencyValue?.value) {
      setValue?.(name, null);
      if (readOnlyBox?.name) {
        resetField?.(readOnlyBox.name);
      }
      clearErrors?.(name);
    }
    if (apiHook && !isAsync && dependency && prevParentCache?.value !== dependencyValue?.value && setFetchedOption) {
      if (dependencyValue?.value) {
        let qParam = null;
        setLoading(true);

        if (getQueryParams) {
          qParam = getQueryParams(dependencyValue);
        }

        apiHook.callAsyncApi(qParam).then((res) => {
          if (res?.data) {
            setOptions([...setFetchedOption(res.data, name)]);
          } else {
            setOptions([]);
          }
          setLoading(false);
        });
      } else {
        setOptions([]);
      }
    }

    setParentCache(dependencyValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency, dependencyValue?.value, prevParentCache?.value]);

  useEffect(() => {
    const isError = !!error;
    setHasError(isError);
  }, [error]);

  useEffect(() => {
    setHasValue(!!fieldValue);

    if (!fieldValue && readOnlyBox && setValue) {
      setValue(readOnlyBox.name, '');
    }
  }, [fieldValue, readOnlyBox, setValue]);

  useEffect(() => {
    if (apiHook && isAsync && setFetchedOption && !apiHook.isLoading && apiHook.isSuccess) {
      if (!Array.isArray(apiHook?.data) && !Array.isArray(apiHook?.data?.list)) {
        setOptions([]);
      } else {
        setOptions([...setFetchedOption(apiHook?.data, name)]);
      }

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiHook?.isLoading, apiHook?.isSuccess, apiHook?.data]);

  useEffect(() => {
    if (apiHook && isAsync && setFetchedOption && !apiHook.isLoading && apiHook.isError) {
      setOptions([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiHook?.isLoading, apiHook?.isError]);

  useEffect(() => {
    if (readOnlyBox?.value && setValue) {
      setValue(readOnlyBox.name, readOnlyBox.value);
    }
  }, [readOnlyBox?.value, readOnlyBox?.name, setValue]);

  useEffect(() => {
    addScrollbarClasses('.MuiAutocomplete-listbox');
  }, []);

  const fetchOptions = useCallback(() => {
    if (dependency && dynamicOptionCallback) {
      setOptions(dynamicOptionCallback(dependencyValue));
    } else if (!apiHook && !isAsync && preFetchedOptions) {
      if (setFetchedOption) {
        setOptions([...setFetchedOption(preFetchedOptions, name)]);
      } else {
        setOptions([...(preFetchedOptions as DropdownOption[])]);
      }
    } else if (apiHook && !isAsync && setFetchedOption && getLiveData) {
      let qParam = null;
      setLoading(true);

      if (getQueryParams) {
        qParam = getQueryParams(dependencyValue);
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
      let qParam = null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependency, dynamicOptionCallback, apiHook, isAsync, preFetchedOptions, setFetchedOption, getLiveData, getQueryParams, addNewConfig, dependencyValue, name]);

  const handleOnKeyUp = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputFieldValue = (event.target as HTMLInputElement).value;
    setInputFieldValue(inputFieldValue);
    if (isValueFetchableOnPress) {
      if (inputFieldValue) {
        setLoading(true);
        if (dependency) {
          const qParam = getQueryParams?.(dependencyValue, inputFieldValue);
          qParam && apiHook?.callApi(qParam);
        } else {
          const qParam = getQueryParams?.(inputFieldValue);
          qParam && apiHook?.callApi(qParam);
        }
      } else {
        setOptions([]);
        setLoading(false);
      }
    }
  }, [isValueFetchableOnPress, dependency, dependencyValue, getQueryParams, apiHook]);

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
    field.onChange(dropdownData);
    onChange?.(dropdownData, dependentFields);
    onValueChange?.(dropdownData, dependentFields, name);
    parentRef?.current?.focus();
  }, [field, onChange, onValueChange, dependentFields, name]);

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
    addNewConfig?.onAddNew?.(inputFieldValue, name, dependentFields);
  }, [inputFieldValue, name, dependentFields, addNewConfig]);

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
      <S.AutocompleteWrapper ref={parentRef} tabIndex={-1} className="myDropdown" sx={sx}>
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
          renderOption={(props, option, state: any) => {
            const dropdownOption = option as DropdownOption;
            return (
              <li {...props} key={`${name}-${dropdownOption.value}-${state?.index}`}>
                <S.MuiListItemContent>{dropdownOption.label}</S.MuiListItemContent>
              </li>
            );
          }}
          noOptionsText={customNoOptionsText}
          {...field}
          onChange={handleChange}
          isOptionEqualToValue={handleIsOptionEqualToValue}
          disabled={isDisabled || disabled || (!isAsync && isLoading)}
          disableClearable={disableClearable}
          getOptionLabel={(option: unknown) => (option as DropdownOption)?.label || ''}
        />
        {!hideErrorMessage && errorMessage && (
          <FormHelperText error={hasError}>{errorMessage}</FormHelperText>
        )}
      </S.AutocompleteWrapper>
    </S.AutocompleteWrapper>
  );
});

BaseDropdown.displayName = 'BaseDropdown';

/**
 * Dropdown component wrapper for use with React Hook Form
 */
export const Dropdown = (props: DropdownProps) => {
  return <BaseDropdown {...props} />;
};

export default Dropdown;
