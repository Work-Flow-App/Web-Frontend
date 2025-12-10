import React from 'react';
import { ClientFormSchema } from '../../schema/ClientFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';

export const ClientFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(ClientFormSchema);

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input name={fieldTitles.name} placeholder={placeHolders.name} hideErrorMessage={false} />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.email} required={isRequireds.email}>
          <Input name={fieldTitles.email} placeholder={placeHolders.email} type="email" hideErrorMessage={false} />
        </FormField>
        <FormField label={fieldLabels.telephone} required={isRequireds.telephone}>
          <Input name={fieldTitles.telephone} placeholder={placeHolders.telephone} hideErrorMessage={false} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label={fieldLabels.mobile} required={isRequireds.mobile}>
          <Input name={fieldTitles.mobile} placeholder={placeHolders.mobile} hideErrorMessage={false} />
        </FormField>
        <FormField label={fieldLabels.address} required={isRequireds.address}>
          <Input name={fieldTitles.address} placeholder={placeHolders.address} hideErrorMessage={false} />
        </FormField>
      </FormRow>
    </>
  );
};
