import React from 'react';
import { CustomerFormSchema } from '../../schema/CustomerFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';

export const CustomerFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(CustomerFormSchema);

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
        <FormField label={fieldLabels.street} required={isRequireds.street}>
          <Input name={fieldTitles.street} placeholder={placeHolders.street} hideErrorMessage={false} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label={fieldLabels.city} required={isRequireds.city}>
          <Input name={fieldTitles.city} placeholder={placeHolders.city} hideErrorMessage={false} />
        </FormField>
        <FormField label={fieldLabels.postalCode} required={isRequireds.postalCode}>
          <Input name={fieldTitles.postalCode} placeholder={placeHolders.postalCode} hideErrorMessage={false} />
        </FormField>
      </FormRow>

      <FormField label={fieldLabels.country} required={isRequireds.country}>
        <Input name={fieldTitles.country} placeholder={placeHolders.country} hideErrorMessage={false} />
      </FormField>
    </>
  );
};
