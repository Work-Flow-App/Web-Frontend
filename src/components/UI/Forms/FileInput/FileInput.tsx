import React, { useRef } from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { Button } from '../../Button';
import type { FileInputProps } from './FileInput.types';
import * as S from './FileInput.styles';

/**
 * Single-file picker bound to React Hook Form: the field's value is the chosen File (or null),
 * so required/format checks live in the form's schema like any other field.
 */
export const FileInput: React.FC<FileInputProps> = ({
  name,
  label,
  required = false,
  accept,
  existingFileName,
  disabled = false,
  error: externalError,
}) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ control, name, defaultValue: null });
  const inputRef = useRef<HTMLInputElement>(null);

  const file = field.value instanceof File ? field.value : null;
  const error = fieldState.error ?? externalError;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.files?.[0] ?? null);
    field.onBlur();
    // Clear the native input so picking the same file again still fires onChange.
    e.target.value = '';
  };

  const buttonLabel = file ? 'Change File' : existingFileName ? 'Replace File' : 'Choose File';

  return (
    <S.FileInputWrapper>
      {label && (
        <S.FileInputLabel htmlFor={name}>
          {label}
          {required && <S.RequiredIndicator>*</S.RequiredIndicator>}
        </S.FileInputLabel>
      )}
      <S.FileRow>
        <input
          id={name}
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel}
        </Button>
        <S.FileName>{file?.name || existingFileName || 'No file selected'}</S.FileName>
      </S.FileRow>
      {error?.message && <S.ErrorText>{error.message}</S.ErrorText>}
    </S.FileInputWrapper>
  );
};
