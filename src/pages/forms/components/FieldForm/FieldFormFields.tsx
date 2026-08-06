import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FieldFormSchema } from '../../schema/FieldFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input, Checkbox } from '../../../../components/UI/Forms';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { FormField, FormRow } from '../../../../components/UI/FormComponents';
import { FORM_FIELD_TYPE_OPTIONS, FORM_FIELD_ROLE_TARGET_OPTIONS, FORM_FIELD_TYPES_WITH_OPTIONS } from '../../../../services/api';
import type { FormFieldDtoTypeEnum } from '../../../../services/api';

export const FieldFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(FieldFormSchema);
  const { control } = useFormContext();
  const typeValue = useWatch({ control, name: fieldTitles.type });
  const selectedType = (typeof typeValue === 'object' && typeValue ? typeValue.value : typeValue) as
    | FormFieldDtoTypeEnum
    | undefined;
  const showOptions = selectedType ? FORM_FIELD_TYPES_WITH_OPTIONS.includes(selectedType) : false;

  return (
    <>
      <FormField label={fieldLabels.label} required={isRequireds.label}>
        <Input name={fieldTitles.label} placeholder={placeHolders.label} hideErrorMessage={false} />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.type} required={isRequireds.type}>
          <Dropdown
            name={fieldTitles.type}
            preFetchedOptions={FORM_FIELD_TYPE_OPTIONS}
            placeHolder={placeHolders.type}
            fullWidth
            disableClearable
            disablePortal
          />
        </FormField>
        <FormField label={fieldLabels.roleTarget} required={isRequireds.roleTarget}>
          <Dropdown
            name={fieldTitles.roleTarget}
            preFetchedOptions={FORM_FIELD_ROLE_TARGET_OPTIONS}
            placeHolder={placeHolders.roleTarget}
            fullWidth
            disableClearable
            disablePortal
          />
        </FormField>
      </FormRow>

      {showOptions && (
        <FormField label={fieldLabels.options} required={isRequireds.options}>
          <Input name={fieldTitles.options} placeholder={placeHolders.options} hideErrorMessage={false} />
        </FormField>
      )}

      <Checkbox name={fieldTitles.required} label={fieldLabels.required} hideErrorMessage={false} />
    </>
  );
};
