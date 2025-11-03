import React from 'react';
import type { RadioGroupProps } from './Radio.types';
import * as S from './Radio.styles';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  error,
  label,
  orientation = 'vertical',
}) => {
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'object' && error?.message ? error.message : '';

  const handleOptionClick = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
  };

  return (
    <S.RadioGroupWrapper>
      {label && <S.RadioGroupLabel>{label}</S.RadioGroupLabel>}

      <S.RadioOptionsContainer orientation={orientation}>
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <S.RadioOption
              key={option.value}
              isSelected={isSelected}
              hasError={hasError}
              onClick={() => handleOptionClick(option.value)}
            >
              <S.RadioCircle isSelected={isSelected} />
              <S.RadioContent>
                <S.RadioLabel>{option.label}</S.RadioLabel>
                {option.description && (
                  <S.RadioDescription>{option.description}</S.RadioDescription>
                )}
              </S.RadioContent>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleOptionClick(option.value)}
                style={{ display: 'none' }}
              />
            </S.RadioOption>
          );
        })}
      </S.RadioOptionsContainer>

      {hasError && errorMessage && <S.ErrorText>{errorMessage}</S.ErrorText>}
    </S.RadioGroupWrapper>
  );
};

export default RadioGroup;
