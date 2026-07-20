import { InputValidationRules } from '../../../../../../utils/validation';
import type { SchemaFieldDefinition } from '../../SchemaField';

export const PostFormSchema: Record<string, SchemaFieldDefinition> = {
  content: {
    title: 'content',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'Share an update with your team...',
    label: 'Content',
    isRequired: true,
    control: 'textarea',
    rows: 5,
  },
  isPublic: {
    title: 'isPublic',
    rule: InputValidationRules.BooleanNotRequired,
    defaultValue: false,
    placeHolder: '',
    label: 'Visible to workers',
    isRequired: false,
    control: 'checkbox',
    helperText: 'Workers can view this post',
  },
};
