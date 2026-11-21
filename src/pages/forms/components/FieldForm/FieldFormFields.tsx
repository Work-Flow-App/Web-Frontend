import React from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { FieldFormSchema } from '../../schema/FieldFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input, TextArea, Checkbox } from '../../../../components/UI/Forms';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { FormField } from '../../../../components/UI/FormComponents';
import * as S from './FieldForm.styles';
import {
  FORM_FIELD_TYPE_OPTIONS,
  FORM_FIELD_ROLE_TARGET_OPTIONS,
  FORM_FIELD_TYPES_WITH_OPTIONS,
  FormFieldDtoTypeEnum,
} from '../../../../services/api';
import { OptionsEditor } from '../OptionsEditor';

export const FieldFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(FieldFormSchema);
  const { control } = useFormContext();
  const typeValue = useWatch({ control, name: fieldTitles.type });
  const selectedType = (typeof typeValue === 'object' && typeValue ? typeValue.value : typeValue) as
    | FormFieldDtoTypeEnum
    | undefined;

  const isSection = selectedType === FormFieldDtoTypeEnum.Section;
  const showOptions = selectedType ? FORM_FIELD_TYPES_WITH_OPTIONS.includes(selectedType) : false;

  return (
    <>
      <FormField
        label={isSection ? 'Section Title' : fieldLabels.label}
        required={isRequireds.label}
      >
        <Input
          name={fieldTitles.label}
          placeholder={isSection ? 'e.g. Site Safety Inspection' : placeHolders.label}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField
        label={isSection ? 'Section Subtext (Optional)' : fieldLabels.description}
        required={false}
      >
        <TextArea
          name={fieldTitles.description}
          placeholder={
            isSection
              ? 'Add section instructions or guidance (optional)'
              : placeHolders.description
          }
          hideErrorMessage={false}
          rows={2}
        />
      </FormField>

      <S.FormRowResponsive>
        <FormField label={fieldLabels.type} required={isRequireds.type}>
          <Dropdown
            name={fieldTitles.type}
            preFetchedOptions={FORM_FIELD_TYPE_OPTIONS}
            placeHolder={placeHolders.type}
            fullWidth
            disableClearable
          />
        </FormField>
        {!isSection && (
          <FormField label={fieldLabels.roleTarget} required={isRequireds.roleTarget}>
            <Dropdown
              name={fieldTitles.roleTarget}
              preFetchedOptions={FORM_FIELD_ROLE_TARGET_OPTIONS}
              placeHolder={placeHolders.roleTarget}
              fullWidth
              disableClearable
            />
          </FormField>
        )}
      </S.FormRowResponsive>

      {!isSection && showOptions && (
        <FormField label={fieldLabels.options} required={isRequireds.options}>
          <Controller
            control={control}
            name={fieldTitles.options}
            render={({ field, fieldState }) => (
              <OptionsEditor
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </FormField>
      )}

      {!isSection && (
        <Checkbox name={fieldTitles.required} label={fieldLabels.required} hideErrorMessage={false} />
      )}
    </>
  );
};
