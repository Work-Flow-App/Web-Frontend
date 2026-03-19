import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { FieldFormSchema } from '../../schema/FieldFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { Checkbox } from '../../../../components/UI/Forms/Checkbox';
import { FormField } from '../../../../components/UI/FormComponents';
import { FieldType, FIELD_TYPE_OPTIONS } from '../../../../enums';

export const FieldFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(FieldFormSchema);
  const { control, formState: { errors } } = useFormContext();

  const { field: typeField } = useController({
    control,
    name: fieldTitles.jobFieldType,
  });

  const selectedValue =
    typeof typeField.value === 'object' && typeField.value !== null
      ? typeField.value.value
      : typeField.value;

  const typeError = errors[fieldTitles.jobFieldType] as { message?: string } | undefined;

  return (
    <>
      <FormField label={fieldLabels.label} required={isRequireds.label}>
        <Input
          name={fieldTitles.label}
          placeholder={placeHolders.label}
          hideErrorMessage={false}
        />
      </FormField>

      <Box>
        <Typography
          variant="body2"
          sx={{ mb: 1, fontWeight: 500, color: typeError ? 'error.main' : 'text.primary' }}
        >
          {fieldLabels.jobFieldType}
          {isRequireds.jobFieldType && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
          )}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
          {FIELD_TYPE_OPTIONS.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <Box
                key={option.value}
                onClick={() => typeField.onChange({ label: option.label, value: option.value })}
                sx={{
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1.25,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: isSelected ? 'primary.50' : 'background.paper',
                  transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  userSelect: 'none',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                  {option.label}
                </Typography>
                {isSelected && <CheckIcon fontSize="small" color="primary" />}
              </Box>
            );
          })}
        </Box>

        {typeError?.message && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {typeError.message}
          </Typography>
        )}
      </Box>

      {selectedValue === FieldType.DROPDOWN && (
        <FormField label={fieldLabels.options} required={isRequireds.options}>
          <Input
            name={fieldTitles.options}
            placeholder={placeHolders.options}
            hideErrorMessage={false}
          />
        </FormField>
      )}

      <Checkbox name={fieldTitles.required} label="Required field" />
    </>
  );
};
