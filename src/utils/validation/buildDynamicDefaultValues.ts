import type { IFields, IDefaultValues } from './SchemaGenerator';

/**
 * Builds the dynamicDefaultValues for useSchema when editing an existing record: for each
 * schema field, takes the record's same-named property, falling back to the field's own
 * defaultValue when the record doesn't have it. Only applies when the record's field names
 * match the schema's 1:1 — nested/renamed source shapes still need their own explicit mapping.
 */
export const buildDynamicDefaultValues = (fields: IFields, source: object): IDefaultValues => {
  const record = source as Record<string, unknown>;
  return Object.fromEntries(Object.keys(fields).map((key) => [key, record[key] ?? fields[key].defaultValue]));
};
