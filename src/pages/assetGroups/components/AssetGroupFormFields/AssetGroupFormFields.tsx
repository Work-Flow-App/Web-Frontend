import React from 'react';
import { AssetGroupFormSchema } from '../../schema/AssetGroupFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { FormField } from '../../../../components/UI/FormComponents';

export const AssetGroupFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(AssetGroupFormSchema);

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input name={fieldTitles.name} placeholder={placeHolders.name} hideErrorMessage={false} />
      </FormField>

      <FormField label={fieldLabels.description} required={isRequireds.description}>
        <TextArea name={fieldTitles.description} placeholder={placeHolders.description} hideErrorMessage={false} rows={3} />
      </FormField>
    </>
  );
};
