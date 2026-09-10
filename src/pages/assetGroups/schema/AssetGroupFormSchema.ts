import { InputValidationRules, type IFields } from '../../../utils/validation';

export const AssetGroupFormSchema: IFields = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Enter group name',
    label: 'Group Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Enter description (optional)',
    label: 'Description',
    isRequired: false,
  },
};

export interface AssetGroupFormData {
  name: string;
  description?: string;
}
