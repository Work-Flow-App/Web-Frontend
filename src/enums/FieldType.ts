export const FieldType = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  BOOLEAN: 'BOOLEAN',
  DROPDOWN: 'DROPDOWN',
  MAP: 'MAP',
} as const;

export type FieldType = typeof FieldType[keyof typeof FieldType];

export const FIELD_TYPE_OPTIONS = [
  { label: 'Text', value: FieldType.TEXT },
  { label: 'Number', value: FieldType.NUMBER },
  { label: 'Date', value: FieldType.DATE },
  { label: 'Boolean', value: FieldType.BOOLEAN },
  { label: 'Dropdown', value: FieldType.DROPDOWN },
  { label: 'Map', value: FieldType.MAP },
];
