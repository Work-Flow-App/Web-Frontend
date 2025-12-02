import React from 'react';
import { WorkerFormSchema } from '../../schema/WorkerFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { PasswordInput } from '../../../../components/UI/Forms/PasswordInput';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';

export const WorkerFormFields: React.FC = () => {
  // Generate schema using the utility
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(WorkerFormSchema);

  return (
    <>
      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input
          name={fieldTitles.name}
          placeholder={placeHolders.name}
          hideErrorMessage={false}
        />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.initials} required={isRequireds.initials}>
          <Input
            name={fieldTitles.initials}
            placeholder={placeHolders.initials}
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.email} required={isRequireds.email}>
          <Input
            name={fieldTitles.email}
            placeholder={placeHolders.email}
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label={fieldLabels.telephone} required={isRequireds.telephone}>
          <Input
            name={fieldTitles.telephone}
            placeholder={placeHolders.telephone}
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.mobile} required={isRequireds.mobile}>
          <Input
            name={fieldTitles.mobile}
            placeholder={placeHolders.mobile}
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label={fieldLabels.username} required={isRequireds.username}>
          <Input
            name={fieldTitles.username}
            placeholder={placeHolders.username}
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.password} required={isRequireds.password}>
          <PasswordInput
            name={fieldTitles.password}
            placeholder={placeHolders.password}
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>
    </>
  );
};
