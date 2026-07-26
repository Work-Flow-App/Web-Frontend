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
    label: 'Make this post public',
    isRequired: false,
    control: 'checkbox',
    helperText: 'Anyone with the link can view this post without logging in, even outside your company',
  },
};
