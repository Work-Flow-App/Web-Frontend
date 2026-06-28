import { useEffect, useState, memo } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import type { TextAreaProps } from './TextArea.types';
import * as S from './TextArea.styles';

const BaseTextArea = (props: TextAreaProps) => {
  const {
    styles,
    name,
    disabled,
    defaultValue,
    placeHolder,
    placeholder,
    onChange,
    onBlur,
    withRequiredBorder,
    dependency,
    dependentFields,
    isDisabled,
    error,
    shouldValidateOnChange,
    onValueChange,
    disableResetFieldWhenDependencyValueIsCleared,
    rows = 4,
    minRows,
    maxRows,
    maxLength,
    readOnly,
    // Destructure these to prevent them from being passed to DOM via restProps
    hideErrorMessage,
    fullWidth,
    label,
    required,
    showCharCount,
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

  useEffect(() => {
    resetField(name, { defaultValue });
  }, [defaultValue, name, resetField]);

  useEffect(() => {
    updateHasValue();
    onValueChange?.(inputValue, dependentFields);
  }, [inputValue]);

  useEffect(() => {
    if (dependency && !dependencyValue) {
      if (!disableResetFieldWhenDependencyValueIsCleared) {
        setValue(name, '');
      }
    }
  }, [dependency, dependencyValue, name, setValue, disableResetFieldWhenDependencyValueIsCleared]);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Enforce maxLength if provided
    if (maxLength && inputValue.length > maxLength) {
      return;
    }

    field.onChange(e);
    if (shouldValidateOnChange) {
      trigger(name);
    }
    onChange?.(e, dependentFields);
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    updateHasValue();
    onBlur?.(e, dependentFields);
    field.onBlur();
  };

  const textAreaProps = {
    ...field,
    ...restProps,
    rows,
    disabled: isDisabled || disabled,
    placeholder: placeHolder || placeholder,
    onChange: handleOnChange,
    onBlur: handleOnBlur,
    className: `${hasValue ? 'hasValue' : withRequiredBorder ? 'withRequiredBorder' : ''} ${error ? 'error' : ''}`,
    readOnly,
    maxLength,
    style: {
      minHeight: minRows ? `${minRows * 24}px` : undefined,
      maxHeight: maxRows ? `${maxRows * 24}px` : undefined,
      ...styles?.input,
    },
  };

  return <S.StyledTextArea {...textAreaProps} />;
};

export const TextArea = memo((props: TextAreaProps) => {
  const { label, hideErrorMessage, fullWidth, required, name, maxLength, showCharCount } = props;
  const { formState } = useFormContext();
  const fieldError = props.error || (formState.errors[name] as any);
  const inputValue = useWatch({ name });
  const charCount = inputValue?.length || 0;

  return (
    <S.StyledFormControl fullWidth={fullWidth}>
      {label && (
        <S.TextAreaLabel htmlFor={name}>
          {label}
          {required && <S.RequiredIndicator> *</S.RequiredIndicator>}
        </S.TextAreaLabel>
      )}
      <S.TextAreaWrapper>
        <BaseTextArea {...props} error={fieldError} />
      </S.TextAreaWrapper>
      {!hideErrorMessage && fieldError && <S.ErrorWrapper>{fieldError.message}</S.ErrorWrapper>}
      {showCharCount && maxLength && (
        <S.CharCountWrapper>
          {charCount}/{maxLength}
        </S.CharCountWrapper>
      )}
    </S.StyledFormControl>
  );
});

TextArea.displayName = 'TextArea';
