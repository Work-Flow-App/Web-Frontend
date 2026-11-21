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
  description: {
    title: 'description',
    rule: InputValidationRules.StringNotRequired,
    defaultValue: '',
    placeHolder: 'Add instructions, help text, or section subtext (optional)',
    label: 'Description / Instructions',
    isRequired: false,
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
    placeHolder: 'e.g. Yes, No, N/A',
    label: 'Options',
    isRequired: false,
  },
};

export interface FieldFormData {
  label: string;
  description?: string;
  type: FormFieldDtoTypeEnum | { value: FormFieldDtoTypeEnum; label: string };
  roleTarget: FormFieldDtoRoleTargetEnum | { value: FormFieldDtoRoleTargetEnum; label: string };
  required?: boolean;
  options?: string;
}
