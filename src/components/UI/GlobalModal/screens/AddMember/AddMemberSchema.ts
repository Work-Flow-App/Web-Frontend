import { InputValidationRules, type IFields } from '../../../../../utils/validation';

export const AddMemberFormSchema: IFields = {
  email: {
    title: 'email',
    rule: InputValidationRules.EmailRequired,
    defaultValue: '',
    placeHolder: 'member@email.com',
    label: 'Email Address',
    isRequired: true,
  },
  role: {
    title: 'role',
    rule: InputValidationRules.DropDownRequired(),
    defaultValue: { label: 'Worker', value: 'worker' },
    placeHolder: 'Select Role',
    label: 'Role',
    isRequired: true,
  },
};
