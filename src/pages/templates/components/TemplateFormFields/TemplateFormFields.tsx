import React from 'react';
import { TemplateFormSchema } from '../../schema/TemplateFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { FormField } from '../../../../components/UI/FormComponents';

export const TemplateFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(TemplateFormSchema);

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
        <Input
          name={fieldTitles.description}
          placeholder={placeHolders.description}
          hideErrorMessage={false}
        />
      </FormField>
    </>
  );
};
