import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import type { CheckboxProps } from './Checkbox.types';
import * as S from './Checkbox.styles';

export const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  checked: externalChecked,
  onChange: externalOnChange,
  error: externalError,
  disabled = false,
  description,
  hideErrorMessage = false,
}) => {
  // Get React Hook Form context
  const { control } = useFormContext();

  // Use controller to integrate with React Hook Form
  const { field, fieldState } = useController({
    control,
    name,
    defaultValue: externalChecked ?? false,
  });

  // Use form-controlled value
  const checked = field.value ?? false;
  const error = fieldState?.error ?? externalError;

  const hasError = Boolean(error);
  const errorMessage = typeof error === 'object' && error?.message ? error.message : '';

  const handleClick = () => {
    if (disabled) return;
    const newValue = !checked;
    field.onChange(newValue);
    externalOnChange?.(newValue);
  };

  return (
    <S.CheckboxWrapper>
      <S.CheckboxContainer
        hasError={hasError}
        disabled={disabled}
        onClick={handleClick}
      >
        <S.CheckboxBox
          isChecked={checked}
          hasError={hasError}
          disabled={disabled}
        >
          <S.CheckIcon isChecked={checked} viewBox="0 0 12 12">
            <polyline points="2 6 5 9 10 3" />
          </S.CheckIcon>
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => {
              const newValue = e.target.checked;
              field.onChange(newValue);
              externalOnChange?.(newValue);
            }}
            disabled={disabled}
            style={{ display: 'none' }}
          />
        </S.CheckboxBox>

        <S.CheckboxContent>
          {label && <S.CheckboxLabel>{label}</S.CheckboxLabel>}
          {description && <S.CheckboxDescription>{description}</S.CheckboxDescription>}
        </S.CheckboxContent>
      </S.CheckboxContainer>

      {hasError && errorMessage && !hideErrorMessage && (
        <S.ErrorText>{errorMessage}</S.ErrorText>
      )}
    </S.CheckboxWrapper>
  );
};

export default Checkbox;
