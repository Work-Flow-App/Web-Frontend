import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FieldFormSchema } from '../../schema/FieldFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { RadioGroup } from '../../../../components/UI/Forms/Radio';
import { FormField } from '../../../../components/UI/FormComponents';

const FIELD_TYPES = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Number', value: 'NUMBER' },
  { label: 'Date', value: 'DATE' },
  { label: 'Boolean', value: 'BOOLEAN' },
  { label: 'Dropdown', value: 'DROPDOWN' },
];

export const FieldFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(FieldFormSchema);
  const { control } = useFormContext();
  const selectedFieldType = useWatch({ control, name: fieldTitles.jobFieldType });

  // Extract value from dropdown option object
  const selectedFieldTypeValue = typeof selectedFieldType === 'object' && selectedFieldType !== null
    ? selectedFieldType.value
    : selectedFieldType;

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input
          name={fieldTitles.name}
          placeholder={placeHolders.name}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField label={fieldLabels.label} required={isRequireds.label}>
        <Input
          name={fieldTitles.label}
          placeholder={placeHolders.label}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField label={fieldLabels.jobFieldType} required={isRequireds.jobFieldType}>
        <Dropdown
          name={fieldTitles.jobFieldType}
          preFetchedOptions={FIELD_TYPES}
          placeHolder={placeHolders.jobFieldType}
          disablePortal={true}
        />
      </FormField>

      {selectedFieldTypeValue === 'DROPDOWN' && (
        <FormField label={fieldLabels.options} required={isRequireds.options}>
          <Input
            name={fieldTitles.options}
            placeholder={placeHolders.options}
            hideErrorMessage={false}
          />
        </FormField>
      )}

      <FormField label={fieldLabels.required} required={isRequireds.required}>
        <RadioGroup
          name={fieldTitles.required}
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      </FormField>

      <FormField label={fieldLabels.orderIndex} required={isRequireds.orderIndex}>
        <Input
          type="number"
          name={fieldTitles.orderIndex}
          placeholder={placeHolders.orderIndex}
          hideErrorMessage={false}
        />
      </FormField>
    </>
  );
};
