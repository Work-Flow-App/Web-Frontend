import { useEffect, useState, memo } from 'react';
import type React from 'react';
import { InputAdornment, Tooltip } from '@mui/material';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import type { InputProps } from './Input.types';
import * as S from './Input.styles';

const HIDDEN_TYPE = 'hidden';

const StartAdornment = ({ icon }: { icon?: string }) => {
  return (
    <>
      {icon && (
        <S.AdornmentWrapper position="start">
          <span className="material-icons">{icon}</span>
        </S.AdornmentWrapper>
      )}
    </>
  );
};

const EndAdornment = ({ icon }: { icon?: string; disabled?: boolean }) => {
  if (icon) {
    return (
      <InputAdornment position="end">
        <span className="material-icons" style={{ display: 'flex' }}>
          {icon}
        </span>
      </InputAdornment>
    );
  }
  return null;
};

const BaseTextInput = (props: InputProps) => {
  const {
    styles,
    name,
    disabled,
    endAdornment,
    startAdornment,
    startIcon,
    defaultValue,
    placeHolder,
    placeholder,
    onChange,
    onBlur,
    withRequiredBorder,
    dependency,
    dependentFields,
    dynamicValueCallback,
    dataSource,
    decimalLimit,
    isDisabled,
    shouldNotSkipHiddenTypeReset,
    error,
    shouldValidateOnChange,
    onValueChange,
    disableResetFieldWhenDependencyValueIsCleared,
    variant,
    showToolTip,
    ...restProps
  } = props;

  const [hasValue, setHasValue] = useState(false);
  const { control, setValue, resetField, trigger } = useFormContext();
  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  const updateHasValue = () => {
    if (inputValue !== '' && inputValue !== null && inputValue !== undefined) {
      setHasValue(true);
    } else {
      setHasValue(false);
    }
  };

  const inputValue = useWatch({ name });
  const dependencyValue = useWatch({ name: dependency || `${name}-dependency` });
  const dataSourceValue = useWatch({ name: dataSource || `${name}-dataSource` });

  useEffect(() => {
    // Skip reset for password visibility toggle (password <-> text type changes)
    const isPasswordTypeToggle = restProps.type === 'password' || restProps.type === 'text';

    if ((restProps.type !== HIDDEN_TYPE || shouldNotSkipHiddenTypeReset) && !isPasswordTypeToggle) {
      resetField(name, { defaultValue });
    }
  }, [defaultValue, name, resetField, restProps.type, shouldNotSkipHiddenTypeReset]);

  useEffect(() => {
    updateHasValue();
    onValueChange?.(inputValue, dependentFields);
  }, [inputValue]);

  useEffect(() => {
    if (dataSource) {
      setValue(name, dataSourceValue?.label || dataSourceValue || '');
    }
  }, [dataSource, dataSourceValue, name, setValue]);

  useEffect(() => {
    if (dependency && !dependencyValue) {
      if (!disableResetFieldWhenDependencyValueIsCleared) {
        setValue(name, '');
      }
    } else if (dependency && dependencyValue && dynamicValueCallback) {
      setValue(name, dynamicValueCallback);
    }
  }, [dependency, dependencyValue, dynamicValueCallback, name, setValue, disableResetFieldWhenDependencyValueIsCleared]);

  useEffect(() => {
    if (decimalLimit && field.value) {
      const newFieldValue = typeof field.value === 'string' ? Number(field.value) : field.value;
      const splitNewFieldValue = newFieldValue.toString().split('.');
      const fieldLength = splitNewFieldValue?.length ? splitNewFieldValue[1]?.length : 0;
      if (!Number.isInteger(newFieldValue) && fieldLength >= decimalLimit) {
        setValue(name, newFieldValue.toFixed(decimalLimit));
      }
    }
  }, [decimalLimit, field.value, name, setValue]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const splitValues = inputValue.split('.');

    if (
      restProps?.type === 'number' &&
      inputValue &&
      restProps?.inputProps &&
      (Number(inputValue) < restProps?.inputProps?.min || Number(inputValue) > restProps?.inputProps?.max)
    ) {
      return;
    }
    if (decimalLimit) {
      const hasDecimalValues =
        (typeof inputValue === 'string' || typeof inputValue === 'number') && splitValues?.length;
      const decimalValues = hasDecimalValues ? splitValues[1]?.length : 0;
      if (inputValue && decimalValues > decimalLimit) return;
    }
    field.onChange(e);
    if (shouldValidateOnChange) {
      trigger(name);
    }
    onChange?.(e, dependentFields);
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateHasValue();
    onBlur?.(e, dependentFields);
    field.onBlur();
  };

  const inputBaseProps = {
    sx: styles?.input,
    startAdornment: startAdornment || <StartAdornment icon={startIcon} />,
    endAdornment: endAdornment || <EndAdornment disabled={disabled} />,
    disableInjectingGlobalStyles: true,
    disabled,
    placeholder: restProps?.inputProps?.max ? `${placeHolder || placeholder}, max - ${restProps?.inputProps?.max}` : placeHolder || placeholder,
    ...restProps,
    inputProps: restProps?.type === 'number' ? { ...restProps?.inputProps, step: 'any' } : restProps?.inputProps,
  };

  const renderInputField = () => {
    if (restProps.type === HIDDEN_TYPE) {
      return <input {...field} type={HIDDEN_TYPE} />;
    }

    if (showToolTip || restProps.readOnly) {
      return (
        <Tooltip title={inputValue || ''}>
          <S.StyledInput
            {...field}
            {...inputBaseProps}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            className={hasValue ? 'hasValue' : withRequiredBorder ? 'withRequiredBorder' : ''}
            disabled={isDisabled}
            error={!!error}
            variants={variant && typeof variant === 'function' ? variant(inputValue) : variant}
          />
        </Tooltip>
      );
    } else {
      return (
        <S.StyledInput
          {...field}
          {...inputBaseProps}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          className={hasValue ? 'hasValue' : withRequiredBorder ? 'withRequiredBorder' : ''}
          disabled={isDisabled}
          error={!!error}
          variants={variant && typeof variant === 'function' ? variant(inputValue) : variant}
        />
      );
    }
  };

  return renderInputField();
};

export const Input = memo((props: InputProps) => {
  const { label, hideErrorMessage, fullWidth, required, name } = props;
  const { formState } = useFormContext();
  const fieldError = props.error || (formState.errors[name] as any);

  return (
    <S.StyledFormControl fullWidth={fullWidth}>
      {label && (
        <S.InputLabel htmlFor={name}>
          {label}
          {required && <S.RequiredIndicator> *</S.RequiredIndicator>}
        </S.InputLabel>
      )}
      <S.InputWrapper>
        <BaseTextInput {...props} error={fieldError} />
      </S.InputWrapper>
      {!hideErrorMessage && fieldError && <S.ErrorWrapper>{fieldError.message}</S.ErrorWrapper>}
    </S.StyledFormControl>
  );
});

Input.displayName = 'Input';
