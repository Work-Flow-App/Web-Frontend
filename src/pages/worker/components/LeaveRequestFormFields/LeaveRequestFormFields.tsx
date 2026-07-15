import React from 'react';
import { LeaveRequestFormSchema } from '../../schema/LeaveRequestFormSchema';
import { useSchema } from '../../../../utils/validation';
import { Input } from '../../../../components/UI/Forms/Input';
import { Dropdown } from '../../../../components/UI/Forms/Dropdown';
import { TextArea } from '../../../../components/UI/Forms/TextArea';
import { FormRow, FormField } from '../../../../components/UI/FormComponents';
import { LEAVE_TYPE_OPTIONS } from '../../../../services/api';

export const LeaveRequestFormFields: React.FC = () => {
  const { placeHolders, fieldLabels, fieldTitles, isRequireds } = useSchema(LeaveRequestFormSchema);

  return (
    <>
      <FormField label={fieldLabels.type} required={isRequireds.type}>
        <Dropdown
          name={fieldTitles.type}
          placeHolder={placeHolders.type}
          preFetchedOptions={LEAVE_TYPE_OPTIONS}
          fullWidth
          disableClearable
        />
      </FormField>

      <FormRow>
        <FormField label={fieldLabels.startDate} required={isRequireds.startDate}>
          <Input
            name={fieldTitles.startDate}
            placeholder={placeHolders.startDate}
            type="date"
            hideErrorMessage={false}
          />
        </FormField>
        <FormField label={fieldLabels.endDate} required={isRequireds.endDate}>
          <Input
            name={fieldTitles.endDate}
            placeholder={placeHolders.endDate}
            type="date"
            hideErrorMessage={false}
          />
        </FormField>
      </FormRow>

      <FormField label={fieldLabels.reason} required={isRequireds.reason}>
        <TextArea
          name={fieldTitles.reason}
          placeholder={placeHolders.reason}
          hideErrorMessage={false}
          rows={3}
        />
      </FormField>
    </>
  );
};
