import { useMemo } from 'react';
import { SchemaGenerator } from './SchemaGenerator';
import { buildDynamicDefaultValues } from './buildDynamicDefaultValues';
import type {
  IFields,
  IFieldTitles,
  IFieldPlaceHolders,
  IDefaultValues,
  IFieldIsRequired,
} from './SchemaGenerator';
import type { ObjectSchema, AnyObject } from 'yup';

export interface ISchema {
  fieldTitles: IFieldTitles;
  fieldRules: ObjectSchema<AnyObject>;
  defaultValues: IDefaultValues;
  placeHolders: IFieldPlaceHolders;
  fieldLabels: IFieldTitles;
  isRequireds: IFieldIsRequired;
}

/**
 * @param source When editing an existing record, pass it to hydrate defaultValues from its
 * same-named fields (falling back to each field's own schema defaultValue). Omit for create mode
 * — defaultValues then come straight from the schema.
 */
export const useSchema = (fields: IFields, source?: object): ISchema => {
  const methods = useMemo(() => {
    const schema = new SchemaGenerator(fields);
    const fieldTitles = schema.getTitles();
    const fieldRules = schema.getRules();
    const defaultValues = source ? buildDynamicDefaultValues(fields, source) : schema.getDefaultValues();
    const placeHolders = schema.getPlaceHolders();
    const fieldLabels = schema.getLabels();
    const isRequireds = schema.getIsRequireds();

    return {
      fieldTitles,
      fieldRules,
      defaultValues,
      placeHolders,
      fieldLabels,
      isRequireds,
    };
  }, [fields, source]);

  return methods;
};
