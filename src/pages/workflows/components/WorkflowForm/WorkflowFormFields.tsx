import React from 'react';
import { WorkflowFormSchema } from '../../schema/WorkflowFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input, TextArea } from '../../../../components/UI/Forms';
import { FormField } from '../../../../components/UI/FormComponents';

export const WorkflowFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(WorkflowFormSchema);

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
          rows={4}
        />
      </FormField>
    </>
  );
};
