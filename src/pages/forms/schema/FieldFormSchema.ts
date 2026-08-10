import { InputValidationRules, type IFields } from '../../../utils/validation';
import { FormFieldDtoTypeEnum, FormFieldDtoRoleTargetEnum } from '../../../services/api';

export const FieldFormSchema: IFields = {
  label: {
    title: 'label',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g. Site safety checked',
    label: 'Field Label',
    isRequired: true,
  },
  type: {
    title: 'type',
    rule: InputValidationRules.DropDownRequired('Field type'),
    defaultValue: FormFieldDtoTypeEnum.Text,
    placeHolder: 'Select field type',
    label: 'Field Type',
    isRequired: true,
  },
  roleTarget: {
    title: 'roleTarget',
    rule: InputValidationRules.DropDownRequired('Filled by'),
    defaultValue: FormFieldDtoRoleTargetEnum.Both,
    placeHolder: 'Select who fills this field',
    label: 'Filled By',
    isRequired: true,
  },
  required: {
    title: 'required',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    label: 'Required field',
    isRequired: false,
  },
  options: {
    title: 'options',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Comma-separated choices, e.g. Yes, No, N/A',
    label: 'Options',
    isRequired: false,
  },
};

export interface FieldFormData {
  label: string;
  type: FormFieldDtoTypeEnum | { value: FormFieldDtoTypeEnum; label: string };
  roleTarget: FormFieldDtoRoleTargetEnum | { value: FormFieldDtoRoleTargetEnum; label: string };
  required?: boolean;
  options?: string;
}
