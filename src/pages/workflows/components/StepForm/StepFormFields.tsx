import React from 'react';
import { StepFormSchema } from '../../schema/StepFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input, TextArea, Checkbox } from '../../../../components/UI/Forms';
import { FormField } from '../../../../components/UI/FormComponents';

export const StepFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(StepFormSchema);

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input
          name={fieldTitles.name}
          placeholder={placeHolders.name}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField label={fieldLabels.description} required={isRequireds.description}>
        <TextArea
          name={fieldTitles.description}
          placeholder={placeHolders.description}
          hideErrorMessage={false}
          rows={3}
        />
      </FormField>

      <Checkbox
        name={fieldTitles.optional}
        label={fieldLabels.optional}
        description="This step can be skipped during workflow execution"
        hideErrorMessage={false}
      />
    </>
  );
};
