import React from 'react';
import { CertificateFormSchema } from '../../schema/CertificateFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';
import { CERTIFICATE_TYPE_OPTIONS } from '../../../../services/api';

export const CertificateFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(CertificateFormSchema);

  return (
    <>
      <FormField label={fieldLabels.type} required={isRequireds.type}>
        <Dropdown
          name={fieldTitles.type}
          placeHolder={placeHolders.type}
          preFetchedOptions={CERTIFICATE_TYPE_OPTIONS}
          fullWidth
          disableClearable
        />
      </FormField>

      <FormField label={fieldLabels.name} required={isRequireds.name}>
        <Input
          name={fieldTitles.name}
          placeholder={placeHolders.name}
          hideErrorMessage={false}
        />
      </FormField>

      <FormField label={fieldLabels.issuingAuthority} required={isRequireds.issuingAuthority}>
        <Input
          name={fieldTitles.issuingAuthority}
          placeholder={placeHolders.issuingAuthority}
          hideErrorMessage={false}
        />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.issueDate} required={isRequireds.issueDate}>
          <Input
            name={fieldTitles.issueDate}
            placeholder={placeHolders.issueDate}
            type="date"
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.expiryDate} required={isRequireds.expiryDate}>
          <Input
            name={fieldTitles.expiryDate}
            placeholder={placeHolders.expiryDate}
            type="date"
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>
    </>
  );
};
