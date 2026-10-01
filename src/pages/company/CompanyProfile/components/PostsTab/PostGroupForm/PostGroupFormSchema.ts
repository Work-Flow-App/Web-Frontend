import { InputValidationRules } from '../../../../../../utils/validation';
import type { SchemaFieldDefinition } from '../../SchemaField';

export const PostGroupFormSchema: Record<string, SchemaFieldDefinition> = {
  name: {
    title: 'name',
    rule: InputValidationRules.StringRequired,
    defaultValue: '',
    placeHolder: 'e.g. Safety Updates',
    label: 'Group Name',
    isRequired: true,
  },
  description: {
    title: 'description',
    rule: InputValidationRules.String,
    defaultValue: '',
    placeHolder: 'What kind of posts belong in this group? (optional)',
    label: 'Description',
    isRequired: false,
  },
};
